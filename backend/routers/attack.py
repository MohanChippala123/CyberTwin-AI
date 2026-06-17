from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.company import Company, Asset
from models.attack import AttackPath
from schemas.attack import AttackPathResponse, AttackPathsListResponse
from services.claude_service import generate_attack_paths
from services.risk_service import calculate_company_risk_score
import json
from typing import List

router = APIRouter(prefix="/api/attack", tags=["attack"])


@router.post("/generate")
async def generate_attack_paths_endpoint(company_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    assets = db.query(Asset).filter(Asset.company_id == company_id).all()
    if not assets:
        raise HTTPException(status_code=400, detail="No assets found for company")

    assets_json = json.dumps([{
        "name": a.name,
        "asset_type": a.asset_type,
        "ip_address": a.ip_address,
        "os": a.os,
        "services": a.services,
        "risk_score": a.risk_score
    } for a in assets])

    try:
        ai_paths = generate_attack_paths(assets_json, company.name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate attack paths: {str(e)}")

    asset_map = {a.name: a.id for a in assets}

    for path_data in ai_paths.get("attack_paths", []):
        source_id = None
        target_id = None
        if path_data.get("steps"):
            source_id = asset_map.get(path_data["steps"][0].get("asset_name"))
            target_id = asset_map.get(path_data["steps"][-1].get("asset_name"))

        attack_path = AttackPath(
            company_id=company.id,
            name=path_data.get("name", "Unknown"),
            description=path_data.get("description"),
            severity=path_data.get("severity", "medium"),
            mitre_tactics=path_data.get("mitre_tactics", []),
            steps=path_data.get("steps", []),
            source_asset_id=source_id,
            target_asset_id=target_id,
            likelihood=path_data.get("likelihood", 0.5),
            impact=path_data.get("impact", 0.5),
        )
        db.add(attack_path)

    db.flush()

    attack_paths = db.query(AttackPath).filter(AttackPath.company_id == company_id).all()
    company.overall_risk_score = calculate_company_risk_score(assets, attack_paths)
    db.commit()

    return {
        "company_id": company_id,
        "attack_paths": [AttackPathResponse.from_orm(p) for p in attack_paths]
    }


@router.get("/{company_id}")
async def get_attack_paths(company_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    attack_paths = db.query(AttackPath).filter(AttackPath.company_id == company_id).all()

    return {
        "company_id": company_id,
        "attack_paths": [AttackPathResponse.from_orm(p) for p in attack_paths]
    }
