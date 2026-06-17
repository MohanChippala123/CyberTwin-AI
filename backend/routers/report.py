from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models.company import Company, Asset
from models.attack import AttackPath
from models.report import Report
from services.claude_service import generate_report_summary
import json
from datetime import datetime

router = APIRouter(prefix="/api/report", tags=["report"])


@router.get("/{company_id}")
async def get_company_report(company_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    assets = db.query(Asset).filter(Asset.company_id == company_id).all()
    attack_paths = db.query(AttackPath).filter(AttackPath.company_id == company_id).all()

    assets_json = json.dumps([{
        "name": a.name,
        "asset_type": a.asset_type,
        "risk_score": a.risk_score,
        "cve_ids": a.cve_ids
    } for a in assets])

    paths_json = json.dumps([{
        "name": p.name,
        "severity": p.severity,
        "likelihood": p.likelihood,
        "impact": p.impact
    } for p in attack_paths])

    try:
        report_data = generate_report_summary(company.name, assets_json, paths_json)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")

    report = Report(
        company_id=company_id,
        title=f"Security Report - {company.name}",
        content=report_data,
        format="json"
    )
    db.add(report)
    db.commit()

    return {
        "report_id": report.id,
        "company_id": company_id,
        "company_name": company.name,
        "generated_at": datetime.utcnow().isoformat(),
        **report_data,
        "assets": [{"name": a.name, "type": a.asset_type, "risk": a.risk_score} for a in assets],
        "attack_paths_count": len(attack_paths)
    }


@router.get("/{company_id}/download")
async def download_report(company_id: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    report = db.query(Report).filter(Report.company_id == company_id).order_by(Report.created_at.desc()).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    return JSONResponse(
        content=report.content,
        headers={"Content-Disposition": f"attachment; filename=report_{company_id}.json"}
    )
