# Deploy Backend to Render

## Why you saw `Cannot find module .../src/dist/server.js`

Render was looking in the wrong folder. The compiled file lives at:

```
ai-referral-backend/dist/server.js   ✅ correct
ai-referral-backend/src/dist/server.js   ❌ wrong (causes your error)
```

This usually means **Root Directory** is set to `src` or the **build step did not run**.

---

## Fix in Render Dashboard

Open your Web Service → **Settings**:

| Setting | Value |
|---------|--------|
| **Root Directory** | `ai-referral-backend` (if monorepo) or **empty** (if backend is the only repo root) |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Node Version** | `20` (recommended) |

Do **not** set Root Directory to `src`.

---

## Environment variables (Render → Environment)

| Key | Example |
|-----|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Your Gemini API key |
| `JWT_SECRET` | Long random string (32+ chars) |
| `CORS_ORIGIN` | Your **exact** frontend URL(s), comma-separated, **no trailing slash** |
| | Example: `https://ai-referral.vercel.app` |
| | Multiple: `https://app.vercel.app,https://app.onrender.com` |
| `NODE_ENV` | `production` |

Render sets `PORT` automatically — you do not need to set it.

---

## Verify build locally

```bash
cd ai-referral-backend
npm install
npm run build
npm start
```

You should see `dist/server.js` created and `Server running on port 5000`.

---

## Monorepo vs single repo

**Monorepo** (both frontend + backend in one GitHub repo):
- Root Directory: `ai-referral-backend`

**Backend-only repo** (`ai-referral-backend` is the repo root):
- Root Directory: leave **blank**
- Build: `npm install && npm run build`
- Start: `npm start`

---

## After deploy

1. Open `https://YOUR-SERVICE.onrender.com/api/health` — should return `{"status":"ok",...}`
2. Set frontend `VITE_API_URL` to that URL (no trailing slash), then **rebuild** the frontend
3. Set backend `CORS_ORIGIN` to your frontend URL (no trailing slash) — must match exactly
4. Check Render logs for: `CORS allowed origins: https://your-frontend...`

## CORS errors?

| Check | Fix |
|-------|-----|
| Frontend URL | `CORS_ORIGIN` must match exactly (https, no trailing `/`) |
| Frontend API URL | `VITE_API_URL` = backend URL, rebuild frontend after changing |
| Multiple domains | `CORS_ORIGIN=https://a.com,https://b.com` |
| Still failing | Open browser DevTools → Network → check `Origin` header on failed request |
