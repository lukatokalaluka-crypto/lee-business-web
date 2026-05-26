# HHMediabusiness React Refactor Report

## Overview
The frontend has been refactored from a monolithic `App.jsx` structure into a modular, page-based architecture. This improves maintainability and prepares the application for more complex routing.

## Architecture

### 1. Page Components
- **`CustomerStorePage`**: The public-facing store. Includes product search and display.
- **`AdminLoginPage`**: Secure gateway for administrators.
- **`AdminDashboardPage`**: Central hub for product management (CRUD).

### 2. Logical Flow
The application uses custom hooks (`useAuth` and `useProducts`) to manage global state and side effects.
- **Data Ownership**: `App.jsx` acts as the controller, managing the logic of which page to render and providing action handlers.
- **CRUD Operations**: Handlers in `App.jsx` interface with the `useProducts` hook, which performs fetch requests to the backend. Success/Error states are passed down to ensure UI feedback.

## CRUD Implementation

| Operation | Logic Location | Component |
| :--- | :--- | :--- |
| **Create** | `addProduct` in `useProducts` | `AdminDashboardPage` (Add Form) |
| **Read** | `products` array | `CustomerStorePage` & `AdminDashboardPage` |
| **Update** | `updateProduct` in `useProducts` | `AdminDashboardPage` (Edit Form) |
| **Delete** | `deleteProduct` in `useProducts` | `AdminDashboardPage` (Delete Button) |

## Refactoring Details
- **Routing**: Replaced manual `currentView` toggling with URL-aware conditional rendering.
- **Separation of Concerns**: Styles are centralized in `common.js`, while UI logic is encapsulated within specific page components.
- **Validation**: Added basic confirmation dialogs for destructive actions (Delete).

## How to Run

1. **Backend**:
   ```bash
   cd backend && npm install && npm start
   ```
2. **Frontend**:
   ```bash
   cd frontend && npm install && npm run dev
   ```
   Access the store at `http://localhost:5173` and the admin panel at `http://localhost:5173/admin`.