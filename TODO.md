# TODO - HHMediabusiness React Refactor & Report

## Step 1: Inspect & confirm current usage
- [x] Read README and current frontend structure
- [x] Read Admin/Customer pages and hooks
- [x] Read current `frontend/src/App.jsx` (monolithic)


## Step 2: Refactor App to use page components
- [x] Replace monolithic UI/control logic in `frontend/src/App.jsx` with routing/rendering:

  - `/admin` -> AdminLoginPage or AdminDashboardPage based on auth
  - `/` -> CustomerStorePage
- [x] Remove duplicated CRUD/login handlers from `App.jsx`

## Step 3: Fix hooks to use Vite proxy paths
- [x] Update `frontend/src/hooks/useAuth.js` to call relative URLs (`/api/...`) not hardcoded `http://localhost:3001/...`
- [x] Update `frontend/src/hooks/useProducts.js` to call relative URLs (`/api/...`) not hardcoded `http://localhost:3001/...`
- [x] Ensure auth cookies/credentials are handled consistently

## Step 4: Wire hooks into page components
- [x] Pass correct props from `App.jsx` into:
  - `AdminLoginPage`
  - `AdminDashboardPage`
  - `CustomerStorePage`
- [x] Ensure CRUD actions trigger product refresh and UI messages

## Step 5: Create report
- [x] Write `REPORT.md` describing before/after architecture, CRUD flow, and how to run

## Step 6: Quick verification
- [x] `cd frontend && npm run dev` and manual browser checks:
  - [x] customer store load + search
  - [x] admin login/logout on `/admin`
  - [x] CRUD add/edit/delete working
