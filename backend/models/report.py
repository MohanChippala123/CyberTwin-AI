from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import uuid
from datetime import datetime

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String, ForeignKey("companies.id"), nullable=False)
    title = Column(String(255))
    content = Column(JSON, default=dict)
    format = Column(String(20), default="json")
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="reports")
