# React + Flask Project – Auth Module Summary

## 📌 Project Overview

This project is a **React (Frontend) + Flask (Backend)** application with a
**role-based authentication system**.

Roles in the system:

- Admin
- Manager
- User

Backend is handled by a **separate team member (different city)**.
Frontend development is done independently using **API contract-based development**.

---

## 🔐 Authentication Rules

### Login

- **Single Login form for ALL roles**
  - Admin
  - Manager
  - User
- Role is determined from backend response, not from UI.

### Register

- **Register form is NOT for public users**
- Only:
  - Admin
  - Manager
- Normal users are NOT allowed to self-register.
- Users will be created later by Admin/Manager.

This follows **industry-standard access control**.

---

## 🎨 UI Status (Completed)

### Auth Page Architecture

Auth page is divided into **two background layers** + **one floating card**:

1. **Auth Page Left (Background Layer)**
   - Purple theme
   - Black blur / dark shadow
   - Purely visual (background only)

2. **Auth Page Right (Background Layer)**
   - Black background
   - Purple + blue glow shadow
   - Visual contrast for image side

3. **Auth Card (Foreground)**
   - Floating at center
   - Left side: Login/Register form
   - Right side: Image (no text)
   - Same UI for Login & Register

### UI Features

- Hover effects
- Focus glow on inputs
- Button animations
- Responsive behavior
- Mobile-friendly (right side hidden on small screens)

---

## 🧠 Frontend Architecture

### Folder Structure (Simplified)

src/
├─ components/
│ └─ auth/
│ ├─ LoginForm.jsx
│ └─ RegisterForm.jsx
├─ layouts/
│ └─ AuthLayout.jsx
├─ pages/
│ ├─ Login/
│ ├─ Register/
│ └─ Dashboard/
├─ routes/
│ └─ AppRoutes.jsx
├─ services/
│ └─ authService.js
├─ assets/
│ └─ auth-illustration.png
└─ index.css

---

## 🌐 Backend Integration Strategy

- Backend APIs already exist (Flask).
- Backend server may not be running locally yet.
- Frontend is written in **REAL API style**, not dummy logic.
- Dummy `setTimeout` login/register logic has been removed.

### Key Principle

> **Frontend and backend work in parallel using a fixed API contract.**

Only the backend URL will change later.

---

## 🔗 authService.js (Central API Layer)

All backend communication is handled through:

Responsibilities:

- Login API call
- Register API call
- Error handling
- Future token helpers

Frontend components **DO NOT directly use fetch/axios**.

---

## 🔑 Token & Role Handling (Planned / Partially Done)

On successful login:

- JWT token is stored in `localStorage`
- User role is stored in `localStorage`

Example:

```js
localStorage.setItem("token", response.token);
localStorage.setItem("role", response.user.role);
This enables:

Role-based routing

Protected dashboards

UI control by role

🧭 Role-Based Flow (Future Ready)
After Login
Admin → Admin Dashboard

Manager → Manager Dashboard

User → User Dashboard

Register Access
Only Admin / Manager can access /register

Route will be protected using role-based guards

❗ Backend Contract (Must Be Confirmed)
Frontend expects backend to confirm:

Endpoints

POST /api/login

POST /api/register

Request Body

Login: { email OR username, password }

Register: { name, email, password }

Login Success Response

{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "role": "admin"
  }
}
Error Response

{
  "message": "Invalid credentials"
}
CORS

Must allow frontend origin (e.g. http://localhost:5173)

🚀 Current Project Status
✅ Auth UI complete
✅ Auth page architecture finalized
✅ authService.js created
✅ Ready for real backend connection
✅ Role-based system planned correctly

❌ Protected routes not implemented yet
❌ Dashboards not implemented yet

🔜 Next Planned Steps
Confirm backend API contract

Adjust authService.js if needed

Implement role-based protected routes

Add logout functionality

Build dashboards (Admin / Manager / User)

🧠 Key Design Decisions (Important)
Login is universal

Register is restricted

Frontend does not depend on backend availability

API contract drives development

UI and logic are clearly separated

```
