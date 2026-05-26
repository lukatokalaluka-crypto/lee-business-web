# HHMediabusiness Refactor Report (React)

## Summary
This refactor finishes the page-component architecture and ensures CRUD operations are performed logically through the existing React hooks and pages.

## What was wrong before
- `frontend/src/App.jsx` contained a large monolithic implementation (admin + customer UI + CRUD handlers in one file).
- The repo already had proper page components and hooks:
  - `src/pages/AdminLoginPage.jsx`
  - `src/pages/AdminDashboardPage.jsx`
  - `src/pages/CustomerStorePage.jsx`
  - `src/hooks/useAuth.js`
  - `src/hooks/useProducts.js`
  but the monolithic code bypassed these components.
- Hooks were implemented, but ESLint configuration in the frontend caused lint to fail (not an app runtime issue).

## What was changed (current structure)
- `frontend/src/App.jsx` now acts as the controller/router:
  - Detects the current path (`/admin` vs public store `/`).
  - Uses `useAuth()` for admin auth state.
  - Uses `useProducts()` for product list and CRUD.
  - Renders:
    - `AdminLoginPage` on `/admin` when not authenticated
    - `AdminDashboardPage` on `/admin` when authenticated
    - `CustomerStorePage` for the public store.

## Component responsibilities
### App.jsx (controller)
- Chooses which page to render based on route + `isAdmin`.
- Wires CRUD callbacks to the dashboard page:
  - `onAddProduct(formData)`
  - `onUpdateProduct(productId, formData)`
  - `onDeleteProduct(productId)`
- Wires auth callbacks:
  - `onSubmit` uses `useAuth().login`
  - `onLogout` uses `useAuth().logout`

### AdminLoginPage.jsx
- Pure UI form.
- Calls `onSubmit(email, password)` via props.

### AdminDashboardPage.jsx
- Pure UI + internal state for the add/edit form.
- Uses callbacks passed from `App.jsx` to execute CRUD.

### CustomerStorePage.jsx
- Pure UI for search + product grid.
- Client-side filtering by `searchTerm`.

### Hooks
- `useProducts.js`
  - Loads products.
  - Implements `addProduct`, `updateProduct`, `deleteProduct`.
  - Uses a fallback to `public/data.json` if API fetch fails.

- `useAuth.js`
  - Implements `login` and `logout`.

## CRUD flow
1. `App.jsx` loads product state via `useProducts()`.
2. Admin dashboard renders products and shows the add/edit form.
3. Add/Edit submit:
   - calls the relevant hook function (`addProduct` / `updateProduct`)
4. Delete button:
   - confirms and calls `deleteProduct(productId)`
5. Hook updates `products` state so the UI re-renders immediately.

## How to run
1. **Database Seed**:
   ```bash
   cd backend && node seed.js
   ```
### Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```
Backend runs on `http://localhost:3001`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`.

## Notes / Known issues
- Frontend `npm run lint` fails due to missing `eslint.config.js` for ESLint v9.
  - This does not affect dev server/runtime.
- Hooks use `http://localhost:3001` URLs. The Vite dev server is configured with a `/api` proxy; converting to relative `/api/...` would be a next-step improvement.

## Admin credentials (from repo README)
- Email: `business@gmail.com`
- Password: `123456`
