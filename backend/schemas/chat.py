from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatMessageRequest(BaseModel):
    company_id: str
    session_id: Optional[str] = None
    message: str

class ChatMessageResponse(BaseModel):
    session_id: str
    role: str
    content: str
    referenced_assets: List[str] = []
    suggested_actions: List[str] = []
    created_at: datetime

class ChatHistoryResponse(BaseModel):
    session_id: str
    messages: List[ChatMessageResponse]
