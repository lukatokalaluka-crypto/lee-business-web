# TODO

## CORS fix for /api/auth/check
- [ ] Update backend CORS in `backend/server.js` to allow the frontend origin used in Render (and support local dev).
- [ ] Keep `credentials: true` working with sessions.
- [ ] Verify frontend calls use the correct base (`/api` via Vite proxy in dev; correct `VITE_API_BASE` in production).
- [ ] Run backend + frontend locally to confirm the CORS error is gone for `/api/auth/check`.

