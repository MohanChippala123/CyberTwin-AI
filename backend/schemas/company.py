from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CompanyCreate(BaseModel):
    name: str
    domain: str
    industry: Optional[str] = None
    employee_count: Optional[int] = None

class AssetBase(BaseModel):
    name: str
    asset_type: str
    ip_address: Optional[str] = None
    os: Optional[str] = None
    services: List[str] = []
    risk_score: float = 0.0
    status: str = "safe"
    cve_ids: List[str] = []
    pos_x: float = 0.0
    pos_y: float = 0.0

class AssetResponse(AssetBase):
    id: str
    company_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class CompanyResponse(BaseModel):
    id: str
    name: str
    domain: str
    industry: Optional[str]
    employee_count: Optional[int]
    overall_risk_score: float
    is_demo: bool
    created_at: datetime
    assets: List[AssetResponse] = []

    class Config:
        from_attributes = True
