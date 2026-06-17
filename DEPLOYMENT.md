# 🚀 Deployment Guide - CyberTwin AI

## Quick Deploy to Render (Free Tier)

### Step 1: Set Up GitHub Pages Landing Page

1. Go to your GitHub repo settings: https://github.com/MohanChippala123/CyberTwin-AI/settings/pages
2. Under "Source", select "Deploy from a branch"
3. Select branch: `main`, folder: `/landing`
4. Your landing page will be at: `https://mohanChippala123.github.io/CyberTwin-AI/`

### Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo: `CyberTwin-AI`
4. Configure:
   - **Name**: `cybertwin-api`
   - **Runtime**: `Docker`
   - **Build Command**: (leave empty, uses Dockerfile)
   - **Start Command**: (leave empty, uses Dockerfile)
   - **Plan**: Free

5. Add Environment Variables:
   ```
   ANTHROPIC_API_KEY = sk-ant-YOUR_KEY_HERE
   DATABASE_URL = sqlite:///./cybertwin.db
   CORS_ORIGINS = https://YOUR_FRONTEND_URL.onrender.com,https://mohanChippala123.github.io
   ```

6. Click "Deploy" - wait ~5-10 minutes

### Step 3: Deploy Frontend to Render

1. Click "New +" → "Web Service"
2. Connect your GitHub repo again
3. Configure:
   - **Name**: `cybertwin-web`
   - **Runtime**: `Node`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm run preview`
   - **Plan**: Free

4. Add Environment Variables:
   ```
   VITE_API_URL = https://cybertwin-api.onrender.com
   ```

5. Click "Deploy" - wait ~5-10 minutes

---

## Check Deployment Status

- **Backend API**: https://cybertwin-api.onrender.com/health
- **Frontend App**: https://cybertwin-web.onrender.com
- **Landing Page**: https://mohanChippala123.github.io/CyberTwin-AI/

---

## Environment Variables Needed

### Backend (.env on Render)
```
ANTHROPIC_API_KEY=sk-ant-YOUR_ANTHROPIC_KEY
DATABASE_URL=sqlite:///./cybertwin.db
CORS_ORIGINS=https://cybertwin-web.onrender.com,https://mohanChippala123.github.io
```

### Frontend (Vite config)
```
VITE_API_URL=https://cybertwin-api.onrender.com
```

---

## Troubleshooting

### Backend won't start
- Check `ANTHROPIC_API_KEY` is valid
- Check Dockerfile exists in backend/
- View logs in Render dashboard

### Frontend can't connect to API
- Verify `VITE_API_URL` environment variable
- Check CORS_ORIGINS includes frontend URL
- Check API is running and responding to health check

### Landing page not showing
- Verify GitHub Pages enabled in repo settings
- Check `/landing/index.html` exists
- Wait ~5 minutes for GitHub to deploy

---

## Update After Changes

Just push to GitHub and Render will auto-redeploy!

```bash
git add -A
git commit -m "Update features"
git push origin main
```

---

## Scale Up Later

When you want to upgrade from free tier:

1. **Backend**: 
   - Upgrade to "Standard" plan ($7/month)
   - Switch to PostgreSQL (more reliable than SQLite)
   - Enable auto-scaling

2. **Frontend**:
   - Upgrade to "Standard" plan
   - Add Cloudflare CDN

3. **Database**:
   - Use Render PostgreSQL ($15/month)
   - Automated backups

---

## Production Checklist

- [ ] Update `SECRET_KEY` in `backend/services/auth_service.py`
- [ ] Set strong `ANTHROPIC_API_KEY`
- [ ] Enable HTTPS (automatic with Render)
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Monitor API usage
- [ ] Add error logging
- [ ] Set up alerts for downtime

---

## Costs (Free Tier)

- **Render Free Tier**: $0/month (for hobby projects)
  - 750 hours/month per service
  - Runs 24/7 with auto-sleep after inactivity
  - 100GB bandwidth

- **Upgrade Later**: 
  - Backend: $7-12/month
  - Frontend: $7-12/month
  - Database: $15/month

---

## Quick Links

- 🚀 Render Dashboard: https://dashboard.render.com
- 📚 Render Docs: https://render.com/docs
- 🔑 Anthropic API: https://console.anthropic.com
- 📊 GitHub: https://github.com/MohanChippala123/CyberTwin-AI

---

**You're live!** 🎉
