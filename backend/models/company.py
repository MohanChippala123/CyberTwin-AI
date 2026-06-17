from sqlalchemy import Column, String, Float, Integer, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    domain = Column(String(255), nullable=False)
    industry = Column(String(100))
    employee_count = Column(Integer)
    overall_risk_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_demo = Column(Boolean, default=False)

    assets = relationship("Asset", back_populates="company", cascade="all, delete-orphan")
    attack_paths = relationship("AttackPath", back_populates="company", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="company", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="company", cascade="all, delete-orphan")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)
    name = Column(String(255), nullable=False)
    asset_type = Column(String(50), nullable=False)
    ip_address = Column(String(50))
    os = Column(String(100))
    services = Column(JSON, default=list)
    risk_score = Column(Float, default=0.0)
    status = Column(String(20), default="safe")
    cve_ids = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)
    pos_x = Column(Float, default=0.0)
    pos_y = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="assets")
