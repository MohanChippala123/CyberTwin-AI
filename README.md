# 🎯 CyberTwin AI - Digital Twin Attack Simulator

**A hackathon-winning cybersecurity platform that simulates how attackers could compromise your digital infrastructure BEFORE a real attack happens.**

## 🔮 What Is It?

CyberTwin AI creates a **digital twin** of your company's attack surface and uses **Claude AI** to intelligently simulate realistic attack paths based on your actual assets, vulnerabilities, and network topology.

Think of it as a **safe playground to test your defenses** — no real attacks, just realistic threat modeling powered by AI.

### Features

✅ **Digital Twin Visualization** - Interactive React Flow graph showing all your assets and attack paths  
✅ **AI Attack Path Generator** - Claude analyzes your infrastructure and generates realistic attack chains  
✅ **SOC Analyst Chat** - Talk to "Alex" — an AI security analyst who understands your environment  
✅ **What-If Simulator** - "What happens if my admin account is compromised?"  
✅ **Risk Scoring** - Automatic vulnerability assessment with CVSS + CVE integration  
✅ **MITRE ATT&CK Mapping** - All attacks mapped to real MITRE techniques  
✅ **CVE Intelligence** - Integrated with NVD CVE database  
✅ **Security Reports** - Downloadable executive summaries  

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- An Anthropic API key (for Claude AI)

### Installation

#### 1. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file with your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY=sk-ant-...

# Seed the demo company
python demo_seed.py

# Start the API server
uvicorn main:app --reload --port 8000
```

#### 2. Frontend Setup

```bash
cd frontend

# Install npm dependencies
npm install

# Start the development server
npm run dev
# App opens at http://localhost:5173
```

---

## 📊 Architecture

```
CyberTwin AI/
├── backend/               # FastAPI + SQLite + Claude AI
│   ├── main.py           # FastAPI app
│   ├── models/           # SQLAlchemy models
│   ├── routers/          # API endpoints
│   ├── services/         # Claude AI, CVE, Risk scoring
│   └── requirements.txt   # Python dependencies
│
└── frontend/             # React + TypeScript + Tailwind
    ├── src/
    │   ├── pages/       # HomePage, DashboardPage
    │   ├── components/  # React Flow graph, panels, chat
    │   ├── api/         # API client
    │   └── store/       # Zustand state
    └── package.json     # npm dependencies
```

---

## 🎮 How to Use

### 1. Load Demo Company

Click **"Load Demo Company"** to instantly load **TechStartup Inc** with:
- 8 realistic assets (APIs, databases, servers, users, cloud)
- 2 complete attack scenarios
- Pre-calculated risk scores and CVE mappings

### 2. Explore the Digital Twin

The **graph visualization** shows:
- 🟢 Green = Safe assets
- 🟡 Yellow = Warning level  
- 🔴 Red = Critical vulnerabilities

Click nodes to inspect asset details, CVEs, and risk breakdown.

### 3. Chat with Your SOC Analyst

Ask questions like:
- "What's our highest risk asset?"
- "How could someone attack the database?"
- "What should we fix first?"

The AI responds with specific, actionable recommendations referencing your real assets.

### 4. Run What-If Scenarios

"What if the admin account is compromised?"

Instantly see:
- Blast radius (which assets get exposed)
- Financial impact estimate
- Immediate response actions
- Recommended long-term controls

### 5. Generate Security Reports

Download comprehensive security reports with:
- Executive summary
- Risk breakdown by category
- Top 5 vulnerabilities
- 30 and 90-day remediation roadmaps

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/company/generate` | Generate new digital twin |
| GET | `/api/assets/{company_id}` | List all assets |
| POST | `/api/attack/generate` | Generate attack paths |
| GET | `/api/attack/{company_id}` | Fetch existing attacks |
| POST | `/api/chat/message` | Chat with SOC analyst |
| POST | `/api/whatif/simulate` | Run attack simulation |
| GET | `/api/cve/lookup/{asset_id}` | Get CVE data |
| GET | `/api/report/{company_id}` | Generate security report |
| POST | `/api/demo/seed` | Seed demo company |

---

## 🤖 AI Prompts

CyberTwin uses 5 specialized Claude prompts:

1. **Asset Generation** - Realistic infrastructure simulation
2. **Attack Path Generation** - MITRE ATT&CK mapped attack chains
3. **SOC Chat** - Security analyst persona
4. **What-If Simulation** - Blast radius calculation
5. **Report Generation** - Executive summary writing

All use `claude-haiku-4-5` for speed + cost efficiency.

---

## 📊 Risk Scoring Algorithm

Assets are scored 0-10 based on:
- **Base type risk** (database=8.0, api=7.5, user=5.0)
- **CVE severity** (CVSS scores)
- **Network exposure** (internet-facing vs internal)
- **Attack path involvement** (how many attack chains target it)

Company score = weighted average of top assets + critical path bonus

---

## 🎨 UI Theme

Dark cybersecurity aesthetic:
- Background: `#0a0e1a`
- Accent: Cyan `#00d4ff`
- Safe: Green `#00ff9f`
- Critical: Red `#ff2d55`
- Warning: Amber `#ffb700`

Built with **Tailwind CSS** + **React Flow** + **Recharts**

---

## 📦 Tech Stack

**Backend:**
- FastAPI (async API)
- SQLAlchemy (ORM)
- SQLite (database)
- Anthropic SDK (Claude AI)
- httpx (NVD CVE API)

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- React Flow (@xyflow/react)
- Recharts (visualizations)
- Zustand (state management)

---

## 🔐 Security Notes

✅ **No real attacks** - Pure simulation using AI  
✅ **API keys safe** - Stored server-side only  
✅ **Local database** - SQLite, no cloud dependencies  
✅ **CORS enabled** - Frontend-backend communication  

---

## 🏆 Hackathon Winning Features

1. **Instant demo** - Load pre-seeded data instantly, no API wait
2. **Impressive visuals** - Interactive graph with animated attack paths
3. **AI-powered** - Claude generates realistic, contextualized attacks
4. **Complete flow** - From asset discovery to actionable reports
5. **Professional UX** - Dark theme, smooth animations, intuitive navigation
6. **Extensible** - Easy to add real data sources, webhooks, Slack integration

---

## 📝 Example Scenarios

### Scenario 1: Phishing Attack
```
User clicks malicious link
  ↓
Credentials stolen
  ↓
Lateral movement to admin workstation
  ↓
Token extraction
  ↓
Database compromise & exfiltration
→ Risk: CRITICAL · Impact: $2.5M
```

### Scenario 2: API Exploitation
```
CVE-2023-44487 (HTTP/2 Rapid Reset)
  ↓
Remote Code Execution on API Gateway
  ↓
Access to metadata service
  ↓
S3 bucket enumeration
  ↓
Customer data exfiltration
→ Risk: HIGH · Impact: $1.2M
```

---

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'anthropic'"
```bash
cd backend
pip install -r requirements.txt
```

### "TypeError: can't use async event in sync context"
Make sure you're running Python 3.10+

### Frontend can't connect to backend
Check that:
1. Backend is running on `localhost:8000`
2. Frontend is running on `localhost:5173`
3. Proxy is configured in `vite.config.ts`

### "ANTHROPIC_API_KEY not found"
```bash
cd backend
cp .env.example .env
# Edit .env with your actual API key
```

---

## 🚀 Next Steps

1. **Custom Data Import** - Connect to your actual cloud infrastructure (AWS, Azure, GCP)
2. **Continuous Monitoring** - Schedule periodic attack simulations
3. **Slack Integration** - Get security alerts in your Slack
4. **Team Collaboration** - Multi-user reporting and discussions
5. **Remediation Tracking** - Track fixes from report to resolution

---

## 👨‍💼 Built For

- **Security teams** evaluating risk
- **Startups** needing rapid security assessment
- **Enterprises** running tabletop exercises
- **Incident responders** understanding blast radius
- **Compliance teams** building security roadmaps

---

## 📄 License

Built for hackathons. Free to use, modify, and extend.

---

**Questions? Issues?** Open an issue or contact the team.

**Made with ❤️ using Claude AI** 🤖
