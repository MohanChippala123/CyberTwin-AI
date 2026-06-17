from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class AttackStep(BaseModel):
    step_number: int
    asset_name: str
    asset_id: Optional[str] = None
    technique_id: str
    technique_name: str
    description: str
    indicators: List[str] = []

class AttackPathResponse(BaseModel):
    id: str
    company_id: str
    name: str
    description: Optional[str]
    severity: str
    mitre_tactics: List[str]
    steps: List[Dict]
    source_asset_id: Optional[str]
    target_asset_id: Optional[str]
    likelihood: float
    impact: float
    created_at: datetime

    class Config:
        from_attributes = True

class AttackPathsListResponse(BaseModel):
    company_id: str
    attack_paths: List[AttackPathResponse]
