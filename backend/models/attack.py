from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime

class AttackPath(Base):
    __tablename__ = "attack_paths"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    severity = Column(String(20))
    mitre_tactics = Column(JSON, default=list)
    steps = Column(JSON, default=list)
    source_asset_id = Column(String)
    target_asset_id = Column(String)
    likelihood = Column(Float, default=0.5)
    impact = Column(Float, default=0.5)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="attack_paths")


class MITRETechnique(Base):
    __tablename__ = "mitre_techniques"

    id = Column(String, primary_key=True)
    name = Column(String(255))
    tactic = Column(String(100))
    description = Column(Text)
    url = Column(String(500))
