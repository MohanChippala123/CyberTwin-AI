# 🏗️ CyberTwin AI - Architecture & Design

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CYBERTWIN AI PLATFORM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────────┐   │
│  │  React Frontend  │◄────HTTP────►│  FastAPI Backend     │   │
│  │  (TypeScript)    │              │  (Python)            │   │
│  └──────────────────┘              └──────────────────────┘   │
│         │                                      │               │
│         │                                      │               │
│    ┌────▼──────┐                        ┌─────▼────────┐      │
│    │  React    │                        │  SQLite      │      │
│    │  Flow     │                        │  Database    │      │
│    │  (Graph)  │                        └──────────────┘      │
│    │           │                                               │
│    │ Recharts  │                        ┌──────────────────┐  │
│    │ (Charts)  │                        │ Claude AI        │  │
│    │           │                        │ (Anthropic SDK)  │  │
│    │ Zustand   │                        │                  │  │
│    │ (State)   │                        │ 5 AI Prompts:    │  │
│    └───────────┘                        │ • Asset Gen      │  │
│                                         │ • Attack Paths   │  │
│                                         │ • SOC Chat       │  │
│                                         │ • What-If        │  │
│                                         │ • Reports        │  │
│                                         └──────────────────┘  │
│                                                                │
│                                         ┌──────────────────┐  │
│                                         │ NVD CVE API      │  │
│                                         │ (httpx)          │  │
│                                         └──────────────────┘  │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### FastAPI Application Stack

```
main.py
├── CORS Middleware
├── Database Initialization
└── Router Registration
    ├── /api/company/    → company.py router
    ├── /api/assets/     → assets.py router
    ├── /api/attack/     → attack.py router
    ├── /api/chat/       → chat.py router
    ├── /api/whatif/     → whatif.py router
    ├── /api/cve/        → cve.py router
    ├── /api/report/     → report.py router
    └── /api/demo/       → demo.py router
```

### Database Schema

```
Companies (1)
├── Assets (N)
│   ├── risk_score
│   ├── cve_ids
│   ├── status (safe/warning/critical)
│   └── pos_x, pos_y (React Flow positions)
├── AttackPaths (N)
│   ├── severity
│   ├── mitre_tactics[]
│   ├── steps[]
│   ├── likelihood, impact
│   └── source_asset_id, target_asset_id
├── Reports (N)
│   └── content (JSON)
└── ChatSessions (N)
    └── ChatMessages (N)
        ├── role (user/assistant)
        └── content
```

### Key Services

#### 1. Claude Service (`services/claude_service.py`)

**5 Specialized AI Functions:**

```python
generate_assets(company_name, domain, industry)
├─ Input: Company metadata
└─ Output: JSON list of 8-15 realistic assets
   {
     "name": "prod-api-gateway",
     "asset_type": "api",
     "services": ["nginx:1.18", "node:18"],
     "risk_score": 8.9,
     "cve_ids": ["CVE-2023-44487"]
   }

generate_attack_paths(assets_json, company_name)
├─ Input: Asset list + company context
└─ Output: 3-5 MITRE ATT&CK mapped attack chains
   {
     "name": "Phishing → DB Exfil",
     "severity": "critical",
     "mitre_tactics": ["TA0001", "TA0003"],
     "steps": [
       {"asset_name": "admin-user", "technique": "T1566.001"},
       ...
     ]
   }

soc_chat(company_context, history, message)
├─ System Prompt: SOC analyst "Alex" persona
├─ Input: Company data + conversation history
└─ Output: Security-focused analysis & recommendations

simulate_whatif(assets, paths, scenario, affected_asset)
├─ Input: Current infrastructure + attack scenario
└─ Output: Blast radius analysis
   {
     "scenario_name": "Admin Compromised",
     "new_risk_score": 9.4,
     "compromised_immediately": ["prod-db", "auth-service"],
     "at_risk_within_24h": ["api-gateway", "s3-bucket"],
     "financial_impact": "$2.5M - $5M"
   }

generate_report_summary(company, assets, paths)
├─ Input: Full company state
└─ Output: Executive security report
   {
     "executive_summary": "3-paragraph narrative",
     "overall_score": 7.2,
     "category_scores": {
       "network_security": 6.8,
       "application_security": 8.1,
       ...
     },
     "30_day_roadmap": ["Patch CVE-2023-44487", ...]
   }
```

**Model Choice:** `claude-haiku-4-5-20251001`
- ✓ Fast (500ms per request)
- ✓ Cost-effective ($0.80/$4 per 1M tokens)
- ✓ Good for JSON generation
- ✓ Sufficient context for security analysis

#### 2. Risk Scoring Service (`services/risk_service.py`)

**Asset Score Calculation (0-10):**

```
score = (
  base_type_risk[asset.type] * 0.25 +      // database=8, api=7.5, user=5
  (avg_cvss / 10) * 0.35 +                 // CVE severity
  network_exposure * 0.20 +                // internet-facing=1, internal=0.5
  attack_paths * 0.20                      // 0.15 per path, capped at 1.0
)
```

**Company Score Calculation:**

```
weighted_avg = (
  top_asset * 0.30 +
  second_asset * 0.20 +
  rest_average * 0.50
) + critical_path_bonus (max +1.5)

Result: 0.0-10.0
```

**Status Mapping:**
- `>= 8.0` → Critical (Red)
- `>= 6.0` → Warning (Amber)
- `>= 3.0` → Moderate (Blue)
- `< 3.0` → Safe (Green)

#### 3. CVE Service (`services/cve_service.py`)

**Data Sources:**
- Pre-cached database (5 demo CVEs)
- NVD API (free, no key required)
- CVSS score extraction
- Severity classification

#### 4. Risk Calculation Flow

```
Asset Creation
    ↓
Calculate asset risk_score (0-10)
    ↓
Update asset status (safe/warning/critical)
    ↓
Aggregate assets → company overall_risk_score
    ↓
Weigh by impact + likelihood
    ↓
Store in database
```

---

## Frontend Architecture

### Component Tree

```
App.tsx (Router)
├── HomePage.tsx
│   ├── HeroSection
│   ├── CompanyForm
│   │   └── Input fields (name, domain, industry, employees)
│   └── DemoButton
│
└── DashboardPage.tsx
    ├── TopNav.tsx
    │   ├── Company name + domain
    │   ├── Risk score badge
    │   └── What-If button
    │
    ├── AttackGraph.tsx (React Flow canvas)
    │   ├── AssetNode.tsx (custom nodes)
    │   │   ├── Icon (database, api, server, etc.)
    │   │   ├── Name label
    │   │   ├── Risk score badge
    │   │   └── Colored border by status
    │   │
    │   └── Animated edges
    │       └── Red for critical, amber for high, cyan for medium
    │
    ├── RiskScorePanel.tsx
    │   ├── RadialBarChart (Recharts gauge)
    │   ├── Risk breakdown cards
    │   └── Asset list (sortable by risk)
    │
    ├── SOCChatPanel.tsx
    │   ├── Message history
    │   ├── Message input
    │   └── Send button
    │
    └── WhatIfModal.tsx
        ├── Scenario selector
        ├── Asset picker
        ├── Results display
        │   ├── Blast radius
        │   ├── Impact estimate
        │   └── Actions
        └── Close button
```

### State Management (Zustand)

```typescript
useStore = {
  currentCompany: Company | null,
  assets: Asset[],
  attackPaths: AttackPath[],
  chatSessionId: string | null,
  loading: boolean,
  error: string | null,
  
  setCurrentCompany: (company) => void,
  setAssets: (assets) => void,
  setAttackPaths: (paths) => void,
  setChatSessionId: (id) => void,
  setLoading: (bool) => void,
  setError: (err) => void,
}
```

### API Client (`api/client.ts`)

**Fetch wrapper** for all backend endpoints:
- `generateCompany(data)`
- `generateAttackPaths(companyId)`
- `sendChatMessage(companyId, message)`
- `runWhatIfSimulation(companyId, scenario, assetId)`
- `getCompanyReport(companyId)`
- `seedDemoCompany()`
- etc.

### Styling Strategy

**Dark Cybersecurity Theme:**

```css
--cyber-bg: #0a0e1a (deep navy)
--cyber-surface: #0f1629 (panel background)
--cyber-border: #1e2d4a (subtle borders)
--cyber-cyan: #00d4ff (primary accent)
--cyber-green: #00ff9f (safe/success)
--cyber-red: #ff2d55 (critical/danger)
--cyber-amber: #ffb700 (warning)
```

**Tailwind + Custom Colors:**
- Responsive design (mobile-first)
- Dark mode default
- Smooth transitions
- Animations: spinning loader, pulsing badges

---

## Data Flow Examples

### Example 1: Load Demo Company

```
User clicks "Load Demo Company"
    ↓
POST /api/demo/seed
    ↓
Backend:
  1. Delete old demo companies
  2. Create Company (TechStartup Inc)
  3. Create 8 Assets (with pre-set risk scores + positions)
  4. Create 2 AttackPaths (steps + MITRE tactics)
  5. Calculate company overall_risk_score
  6. Commit to SQLite
    ↓
Return Company + Assets
    ↓
Frontend:
  1. Store in Zustand
  2. Navigate to /dashboard/{companyId}
  3. Render React Flow graph with assets
  4. Show risk gauge
  5. Initialize chat panel
```

### Example 2: Ask SOC Chat

```
User types: "What's our highest risk asset?"
    ↓
POST /api/chat/message
  {
    "company_id": "uuid",
    "session_id": "uuid or null",
    "message": "What's our highest risk asset?"
  }
    ↓
Backend:
  1. Load or create ChatSession
  2. Get company context (name, domain, risk score)
  3. Get all assets
  4. Build system prompt (SOC analyst persona)
  5. Call Claude with history
  6. Store user + assistant messages
    ↓
Return { "reply": "Based on the digital twin...", "assets": [...] }
    ↓
Frontend:
  1. Display assistant message
  2. Scroll to bottom
```

### Example 3: Run What-If Scenario

```
User selects "Admin Account Compromised" + "admin-user-sarah"
    ↓
POST /api/whatif/simulate
  {
    "company_id": "uuid",
    "scenario": "admin_account_compromised",
    "affected_asset_id": "uuid"
  }
    ↓
Backend:
  1. Load company + all assets + attack paths
  2. Build JSON payload for Claude
  3. Call simulate_whatif AI function
  4. Get blast_radius analysis
  5. Parse financial impact
    ↓
Return simulation results
    ↓
Frontend:
  1. Show modal with results
  2. Display blast radius (3 categories)
  3. Show financial impact estimate
  4. List recommended actions
```

---

## API Request/Response Examples

### POST /api/company/generate

**Request:**
```json
{
  "name": "Acme Corp",
  "domain": "acme.com",
  "industry": "fintech",
  "employee_count": 500
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Corp",
  "domain": "acme.com",
  "overall_risk_score": 7.2,
  "is_demo": false,
  "created_at": "2026-06-16T12:00:00Z",
  "assets": [
    {
      "id": "asset-123",
      "name": "prod-api-gateway",
      "asset_type": "api",
      "risk_score": 8.9,
      "status": "critical",
      "cve_ids": ["CVE-2023-44487"],
      "pos_x": 400.0,
      "pos_y": 100.0
    }
  ]
}
```

### POST /api/attack/generate

**Response:**
```json
{
  "company_id": "550e8400-e29b-41d4-a716-446655440000",
  "attack_paths": [
    {
      "id": "path-456",
      "name": "Phishing → Admin → DB Exfil",
      "severity": "critical",
      "mitre_tactics": ["TA0001", "TA0003"],
      "likelihood": 0.72,
      "impact": 0.95,
      "steps": [
        {
          "step_number": 1,
          "asset_name": "admin-user-sarah",
          "technique_id": "T1566.001",
          "technique_name": "Spearphishing Attachment",
          "description": "Admin receives..."
        }
      ]
    }
  ]
}
```

---

## Performance Optimizations

| Aspect | Strategy |
|--------|----------|
| **Frontend Rendering** | React.memo, useMemo for graph nodes |
| **Graph Visualization** | React Flow (optimized for 100+ nodes) |
| **API Calls** | Zustand caching, no refetch on route change |
| **Database** | SQLite indexes on company_id, asset_type |
| **AI Calls** | Haiku model (fast), 500ms avg response |
| **CSS** | Tailwind JIT, minimal bundle |
| **Bundling** | Vite (instant HMR, optimized build) |

---

## Security Considerations

✅ **API Key Storage:** Server-side only (.env)  
✅ **CORS:** Restricted to localhost (dev), configurable for prod  
✅ **SQL Injection:** SQLAlchemy ORM prevents injection  
✅ **XSS:** React auto-escapes, no dangerouslySetInnerHTML  
✅ **CSRF:** Not needed (no cookies, stateless API)  
✅ **Data:** In-memory + SQLite (no cloud exposure)  

---

## Scaling Considerations

**For Production:**

1. **Database** → PostgreSQL (horizontal scaling)
2. **Cache** → Redis (session storage, caching)
3. **Queue** → Celery (async AI calls)
4. **Monitoring** → Prometheus + Grafana
5. **Auth** → JWT + OAuth2
6. **CDN** → CloudFront for static assets
7. **Load Balancer** → Nginx

---

## Testing Strategy

```python
# Backend
pytest tests/
  ├── test_models.py (database)
  ├── test_routers.py (API endpoints)
  ├── test_services.py (Claude, CVE, risk)
  └── test_integration.py (full flows)

# Frontend
npm test
  ├── component tests (React Testing Library)
  ├── integration tests (Cypress)
  └── visual tests (Percy)
```

---

## Deployment Pipeline

```
Local Dev
  ↓
npm run build (frontend)
  ↓
Docker build (backend)
  ↓
Push to DockerHub
  ↓
Deploy to AWS ECS
  ↓
Health checks
  ↓
Smoke tests
```

---

## Extensibility Points

| Extension | Method |
|-----------|--------|
| **Real Cloud Data** | Add AWS/Azure SDK integrations |
| **CVE Sources** | Extend cve_service.py with more APIs |
| **AI Models** | Swap claude-haiku for opus/sonnet |
| **Notifications** | Add Slack/Email routers |
| **Reporting** | Generate PDF reports with reportlab |
| **Webhooks** | Listen to external security events |
| **Auth** | Add user accounts + role-based access |

---

**This architecture is built for:**
- ✓ Rapid hackathon iteration
- ✓ Visual impact + professional UX
- ✓ AI-powered intelligence
- ✓ Production-grade scalability
