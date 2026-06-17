# 🚀 Setup Instructions

## Step 1: Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Create a new API key
4. Copy your key (starts with `sk-ant-`)

## Step 2: Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env and paste your API key
# On Windows: notepad .env
# On Mac/Linux: nano .env
# Find: ANTHROPIC_API_KEY=sk-ant-YOUR_API_KEY_HERE
# Replace with your actual key

# Seed demo data
python demo_seed.py

# Start backend server
uvicorn main:app --reload --port 8000
```

**You should see:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Test Backend

Open in your browser or curl:
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok","service":"CyberTwin AI"}

curl http://localhost:8000/api/demo/companies
# Should return demo companies
```

---

## Step 3: Frontend Setup

In a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

**You should see:**
```
  VITE v5.1.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open http://localhost:5173 in your browser.

---

## Step 4: Try It Out

1. **Click "Load Demo Company"** to load TechStartup Inc
2. **Wait** for the dashboard to load (graph, assets, risk score)
3. **Click assets** in the graph to see details
4. **Ask the SOC analyst** questions about security
5. **Click "What-If Scenario"** to run simulations

---

## 🎯 Quick Demo Flow

```
1. Home Page → Load Demo
2. Dashboard loads with graph visualization
3. React Flow graph shows 8 assets with color-coded risk
4. Right panel shows risk score gauge (0-10)
5. Bottom panel is SOC analyst chat
6. Click assets to see CVEs and details
7. "What-If Scenario" button to simulate attacks
```

---

## ⚙️ Troubleshooting

### "Command not found: pip"
```bash
python -m pip install -r requirements.txt
```

### "Command not found: npm"
Install Node.js from https://nodejs.org

### "Address already in use: port 8000"
Backend is already running. Kill it:
```bash
# Windows
taskkill /PID <pid> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### "VITE module not found"
```bash
cd frontend
npm install @vitejs/plugin-react
```

### "API key not working"
- Check .env file exists and is readable
- Verify key starts with `sk-ant-`
- Make sure there are no extra spaces

### Graph not showing
- Check browser console for errors (F12)
- Verify backend is running (`curl http://localhost:8000/health`)
- Try refreshing the page

---

## 📊 File Structure After Setup

```
CyberPorjec/
├── backend/
│   ├── cybertwin.db         ← Created after python demo_seed.py
│   ├── .env                 ← Created, has your API key
│   └── [all source files]
├── frontend/
│   ├── node_modules/        ← Created after npm install
│   └── [all source files]
└── README.md
```

---

## 🎬 Demo Walkthrough

### What You'll See

**Home Page:**
- Beautiful dark cybersecurity UI
- Input form to create company OR demo button
- Click "Load Demo Company"

**Dashboard (after loading):**
- **Left**: Interactive React Flow graph with assets
  - Green nodes = safe
  - Red nodes = critical
  - Animated dashed lines = attack paths
- **Right panel**: Risk score gauge + top threats
- **Bottom**: Chat with SOC analyst "Alex"
- **Top**: Company info + What-If button

**Try These:**

1. **Hover over nodes** - See asset names and risk scores
2. **Click nodes** - Right panel shows asset details & CVEs
3. **Ask the chat:**
   - "What are our critical assets?"
   - "How could someone attack the database?"
   - "What's the blast radius if admin is compromised?"
4. **What-If Simulation:**
   - Select "Admin Account Compromised"
   - See which assets are at risk
   - Get financial impact estimate
   - Get recommended actions

---

## ✅ Success Indicators

- ✓ Backend starts without errors
- ✓ Demo database is seeded with TechStartup Inc
- ✓ Frontend builds successfully
- ✓ Graph displays with 8 assets
- ✓ Risk score gauge shows 7.8/10
- ✓ Chat responds to messages
- ✓ What-If simulation works

---

## 🔗 Important URLs

- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:5173
- **Health Check**: http://localhost:8000/health

---

## 💡 Pro Tips

1. **Keep both terminals open** while developing
2. **Backend logs** show API calls and errors
3. **Frontend dev tools** (F12) shows JavaScript errors
4. **Database** is at `backend/cybertwin.db` (can delete to reset)
5. **Re-seed** demo: `python backend/demo_seed.py`

---

**Ready? Go to http://localhost:5173 and start exploring!** 🎯
