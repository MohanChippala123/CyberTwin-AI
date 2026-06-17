import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, init_db
from models.company import Company, Asset
from models.attack import AttackPath
from services.mock_data import DEMO_COMPANY, DEMO_ASSETS, DEMO_ATTACK_PATHS
from services.risk_service import calculate_asset_risk_score, calculate_company_risk_score

def seed_database():
    init_db()

    db = SessionLocal()

    try:
        db.query(Company).delete()
        db.commit()

        company = Company(
            name=DEMO_COMPANY["name"],
            domain=DEMO_COMPANY["domain"],
            industry=DEMO_COMPANY["industry"],
            employee_count=DEMO_COMPANY["employee_count"],
            is_demo=True,
        )
        db.add(company)
        db.flush()

        assets = []
        for asset_data in DEMO_ASSETS:
            asset = Asset(
                company_id=company.id,
                name=asset_data["name"],
                asset_type=asset_data["asset_type"],
                ip_address=asset_data.get("ip_address"),
                os=asset_data.get("os"),
                services=asset_data.get("services", []),
                risk_score=asset_data.get("risk_score", 0.0),
                status=asset_data.get("status", "safe"),
                cve_ids=asset_data.get("cve_ids", []),
                pos_x=asset_data.get("pos_x", 0.0),
                pos_y=asset_data.get("pos_y", 0.0),
            )
            db.add(asset)
            assets.append(asset)

        db.flush()

        asset_map = {asset.name: asset.id for asset in assets}

        for path_data in DEMO_ATTACK_PATHS:
            attack_path = AttackPath(
                company_id=company.id,
                name=path_data["name"],
                description=path_data.get("description"),
                severity=path_data.get("severity"),
                mitre_tactics=path_data.get("mitre_tactics", []),
                steps=path_data.get("steps", []),
                source_asset_id=asset_map.get(path_data["steps"][0]["asset_name"]) if path_data.get("steps") else None,
                target_asset_id=asset_map.get(path_data["steps"][-1]["asset_name"]) if path_data.get("steps") else None,
                likelihood=path_data.get("likelihood", 0.5),
                impact=path_data.get("impact", 0.5),
            )
            db.add(attack_path)

        db.commit()

        company.overall_risk_score = calculate_company_risk_score(assets, db.query(AttackPath).filter_by(company_id=company.id).all())
        db.commit()

        print(f"✓ Seeded demo company: {company.name} (ID: {company.id})")
        print(f"✓ Created {len(assets)} assets")
        print(f"✓ Created {len(DEMO_ATTACK_PATHS)} attack paths")
        print(f"✓ Overall risk score: {company.overall_risk_score:.1f}/10.0")

    except Exception as e:
        db.rollback()
        print(f"✗ Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
