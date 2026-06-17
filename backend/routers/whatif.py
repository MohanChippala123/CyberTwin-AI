from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.company import Company, Asset
from models.attack import AttackPath
from services.claude_service import simulate_whatif
import json

router = APIRouter(prefix="/api/whatif", tags=["whatif"])


@router.post("/simulate")
async def run_whatif_simulation(
    company_id: str,
    scenario: str,
    affected_asset_id: str = None,
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    assets = db.query(Asset).filter(Asset.company_id == company_id).all()
    if not assets:
        raise HTTPException(status_code=400, detail="No assets found")

    attack_paths = db.query(AttackPath).filter(AttackPath.company_id == company_id).all()

    affected_asset = None
    if affected_asset_id:
        affected_asset = db.query(Asset).filter(Asset.id == affected_asset_id).first()
    else:
        affected_asset = assets[0]

    assets_json = json.dumps([{
        "name": a.name,
        "asset_type": a.asset_type,
        "risk_score": a.risk_score
    } for a in assets])

    paths_json = json.dumps([{
        "name": p.name,
        "severity": p.severity,
        "steps": p.steps
    } for p in attack_paths])

    try:
        result = simulate_whatif(
            assets_json,
            paths_json,
            scenario,
            affected_asset.name
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

    return {
        "company_id": company_id,
        "scenario": scenario,
        "affected_asset_id": affected_asset.id,
        "affected_asset_name": affected_asset.name,
        **result
    }


@router.get("/scenarios")
async def get_scenarios():
    return {
        "scenarios": [
            {
                "id": "admin_account_compromised",
                "name": "Admin Account Compromised",
                "description": "What happens if an admin user account is compromised?"
            },
            {
                "id": "api_breach",
                "name": "API Breach",
                "description": "What if the API gateway is exploited?"
            },
            {
                "id": "database_exposed",
                "name": "Database Exposed",
                "description": "What if the database is exposed to the internet?"
            },
            {
                "id": "insider_threat",
                "name": "Insider Threat",
                "description": "What if an employee turns malicious?"
            },
            {
                "id": "supply_chain",
                "name": "Supply Chain Attack",
                "description": "What if a dependency is compromised?"
            }
        ]
    }
