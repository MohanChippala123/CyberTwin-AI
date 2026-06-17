from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from config import settings
from routers import company, assets, attack, chat, whatif, cve, report, demo, auth
import os
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(
    title="CyberTwin AI",
    description="Digital Twin Attack Simulator",
    version="0.1.0"
)

app.include_router(auth.router)
app.include_router(company.router)
app.include_router(assets.router)
app.include_router(attack.router)
app.include_router(chat.router)
app.include_router(whatif.router)
app.include_router(cve.router)
app.include_router(report.router)
app.include_router(demo.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_db()
    print("Database initialized")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "CyberTwin AI"}

@app.get("/")
async def root():
    return {"message": "CyberTwin AI - Digital Twin Attack Simulator API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
