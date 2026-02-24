# File Tree: SDP2

**Generated:** 2/24/2026, 7:32:38 PM
**Root Path:** `c:\Users\Administrator\Desktop\try1\SDP2`

```
└── 📁 projectsdp
    ├── 📁 .github
    │   └── 📁 appmod
    │       └── 📁 appcat
    ├── 📁 Frontend
    │   ├── 📁 public
    │   │   └── 🖼️ vite.svg
    │   ├── 📁 src
    │   │   ├── 📁 assets
    │   │   │   ├── 🖼️ loginimage.png
    │   │   │   └── 🖼️ react.svg
    │   │   ├── 📁 components
    │   │   │   ├── 📁 admin
    │   │   │   │   ├── 📄 AdminSidebar.jsx
    │   │   │   │   ├── 📄 AdminStatCard.jsx
    │   │   │   │   └── 📄 AdminTopbar.jsx
    │   │   │   ├── 📁 auth
    │   │   │   │   ├── 📄 LoginForm.jsx
    │   │   │   │   ├── 📄 OtpVerify.jsx
    │   │   │   │   └── 📄 RegisterForm.jsx
    │   │   │   ├── 📁 common
    │   │   │   │   ├── 📄 Button.jsx
    │   │   │   │   ├── 📄 ErrorMessage.jsx
    │   │   │   │   ├── 📄 Input.jsx
    │   │   │   │   └── 📄 Loader.jsx
    │   │   │   ├── 📁 dashboard
    │   │   │   │   ├── 📄 ManagerSidebar.jsx
    │   │   │   │   ├── 📄 ManagerStatCard.jsx
    │   │   │   │   ├── 📄 ManagerTopbar.jsx
    │   │   │   │   └── 📄 MonthlyRevenueChart.jsx
    │   │   │   └── 📄 Navbar.jsx
    │   │   ├── 📁 layouts
    │   │   │   ├── 📄 AuthLayout.jsx
    │   │   │   └── 📄 MainLayout.jsx
    │   │   ├── 📁 mock
    │   │   │   └── 📄 mockBackend.js
    │   │   ├── 📁 pages
    │   │   │   ├── 📁 Dashboard
    │   │   │   │   ├── 📄 AdminDashboard.jsx
    │   │   │   │   ├── 📄 DashboardPage.jsx
    │   │   │   │   ├── 📄 ManagerDashboard.jsx
    │   │   │   │   └── 📄 UserDashboard.jsx
    │   │   │   ├── 📁 Login
    │   │   │   │   ├── 📄 LoginPage.jsx
    │   │   │   │   └── 🐍 app.py
    │   │   │   ├── 📁 Register
    │   │   │   │   └── 📄 RegisterPage.jsx
    │   │   │   ├── 📁 Test
    │   │   │   │   └── 📄 TestConnection.jsx
    │   │   │   └── 📁 Unauthorized
    │   │   │       └── 📄 Unauthorized.jsx
    │   │   ├── 📁 routes
    │   │   │   ├── 📄 AppRoutes.jsx
    │   │   │   ├── 📄 ProtectedRoute.jsx
    │   │   │   └── 📄 RoleProtectedRoute.jsx
    │   │   ├── 📁 services
    │   │   │   ├── 📄 apiClient.js
    │   │   │   └── 📄 authService.js
    │   │   ├── 📁 styles
    │   │   │   └── 🎨 dashboard.css
    │   │   ├── 🎨 App.css
    │   │   ├── 📄 App.jsx
    │   │   ├── 🎨 index.css
    │   │   └── 📄 main.jsx
    │   ├── ⚙️ .gitignore
    │   ├── 📝 README.md
    │   ├── 📄 eslint.config.js
    │   ├── 🌐 index.html
    │   ├── ⚙️ package-lock.json
    │   ├── ⚙️ package.json
    │   └── 📄 vite.config.js
    ├── 📁 Java
    │   ├── ☕ CodeConsolidator.class
    │   ├── ☕ CodeConsolidator.java
    │   ├── 📄 Codes.txt
    │   ├── ☕ one.class
    │   ├── ☕ one.java
    │   ├── ☕ three.java
    │   └── ☕ two.java
    ├── 📁 backend
    │   ├── 📁 migrations
    │   │   ├── 📁 versions
    │   │   │   └── 🐍 09b47522413f_initial_tables.py
    │   │   ├── 📄 README
    │   │   ├── ⚙️ alembic.ini
    │   │   ├── 🐍 env.py
    │   │   └── 📄 script.py.mako
    │   ├── 📁 models
    │   │   ├── 📄 Codes.txt
    │   │   ├── 🐍 __init__.py
    │   │   ├── 🐍 audit_logs.py
    │   │   ├── 🐍 column_mapping.py
    │   │   ├── 🐍 company.py
    │   │   ├── 🐍 magic.py
    │   │   ├── 🐍 otp_verification.py
    │   │   ├── 🐍 role.py
    │   │   ├── 🐍 sales_data.py
    │   │   ├── 🐍 uploaded_file.py
    │   │   └── 🐍 user.py
    │   ├── 📁 routes
    │   │   ├── 📄 Codes.txt
    │   │   ├── 🐍 __init__.py
    │   │   ├── 🐍 admin_routes.py
    │   │   ├── 🐍 auth_routes.py
    │   │   ├── 🐍 company_routes.py
    │   │   ├── 🐍 employee_routes.py
    │   │   ├── 🐍 magic.py
    │   │   └── 🐍 upload_routes.py
    │   ├── 📁 services
    │   │   ├── 📄 Codes.txt
    │   │   ├── 🐍 audit_service.py
    │   │   ├── 🐍 auth_service.py
    │   │   ├── 🐍 data_cleaning_service.py
    │   │   ├── 🐍 file_service.py
    │   │   ├── 🐍 magic.py
    │   │   ├── 🐍 sales_service.py
    │   │   └── 📄 services_codes.txt
    │   ├── 📁 uploads
    │   │   ├── 📁 cleaned_files
    │   │   │   ├── 📄 cleaned_1.csv
    │   │   │   ├── 📄 cleaned_2.csv
    │   │   │   ├── 📄 cleaned_4.csv
    │   │   │   └── 📄 cleaned_5.csv
    │   │   └── 📁 raw_files
    │   │       ├── 📄 1feed75ff6ff4181af15b2e56d313926_test2.csv
    │   │       ├── 📄 76a13bf27dbc43edbf1a576e00a1a308_test2.csv
    │   │       ├── 📄 796f7c11e8c24e4eaf7addc3de5ff30d_test2.csv
    │   │       ├── 📄 ae0b8ea9decd491b9d55e9497757d5f8_test2.csv
    │   │       └── 📄 bbcb6a2b7f1748a5802f07e162e6a913_test2.csv
    │   ├── 📁 utils
    │   │   ├── 📄 Codes.txt
    │   │   ├── 🐍 column_mapping.py
    │   │   ├── 🐍 decorators.py
    │   │   ├── 🐍 jwt_utils.py
    │   │   ├── 🐍 magic.py
    │   │   └── 🐍 validators.py
    │   ├── 🐍 app.py
    │   ├── 📄 codes.txt
    │   ├── 🐍 config.py
    │   ├── 🐍 extensions.py
    │   ├── 📝 file_Structure.md
    │   ├── 📄 requirements.txt
    │   └── 🐍 seed.py
    └── 📄 Project API's.txt
```

---

_Generated by FileTree Pro Extension_
