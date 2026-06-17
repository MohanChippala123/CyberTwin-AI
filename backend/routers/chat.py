from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.company import Company, Asset
from models.chat import ChatSession, ChatMessage
from schemas.chat import ChatMessageRequest
from services.claude_service import soc_chat
import json

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/message")
async def send_chat_message(request: ChatMessageRequest, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == request.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    session = None
    if request.session_id:
        session = db.query(ChatSession).filter(ChatSession.id == request.session_id).first()

    if not session:
        session = ChatSession(company_id=request.company_id)
        db.add(session)
        db.flush()

    assets = db.query(Asset).filter(Asset.company_id == request.company_id).all()
    company_context = f"{company.name} ({company.domain}) - Industry: {company.industry}, Employees: {company.employee_count}, Risk Score: {company.overall_risk_score}/10"

    history = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).all()
    conversation_history = [
        {"role": msg.role, "content": msg.content} for msg in history
    ]

    try:
        ai_response = soc_chat(company_context, conversation_history, request.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate response: {str(e)}")

    user_msg = ChatMessage(session_id=session.id, role="user", content=request.message)
    assistant_msg = ChatMessage(session_id=session.id, role="assistant", content=ai_response)

    db.add(user_msg)
    db.add(assistant_msg)
    db.commit()

    return {
        "session_id": session.id,
        "reply": ai_response,
        "referenced_assets": [a.name for a in assets[:3]],
        "suggested_actions": ["Review assets", "Run what-if simulation"]
    }


@router.get("/session/{session_id}")
async def get_session_messages(session_id: str, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).all()

    return {
        "session_id": session.id,
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "created_at": m.created_at
            }
            for m in messages
        ]
    }
