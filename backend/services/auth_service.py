from models import User, Role, Company
from extensions import db
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from services.audit_service import log_event

def register_user(data):
    if not data:
        return {"error": "Invalid request body"}, 400

    # Extract data FIRST
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role_name = data.get('role')
    company_id = data.get('company_id')

    # Validate required fields
    if not all([username, email, password, role_name]):
        return {"error": "Missing required fields"}, 400

    # Check existing user
    if User.query.filter(
        (User.username == username) | (User.email == email)
    ).first():
        return {"error": "User already exists"}, 400

    # Validate role
    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return {"error": "Invalid role specified"}, 400

    # Company validation
    if role.name in ['Company Manager', 'Employee'] and not company_id:
        return {"error": "Company ID required for this role"}, 400

    if role.name == 'Admin':
        company_id = None  # Admins don't belong to a company

    # Password validation
    if len(password) < 5:
        return {"error": "Password too short"}, 400

    # Create user
    new_user = User(
        username=username,
        email=email,
        role_id=role.id,
        company_id=company_id
    )
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return {"message": "User registered successfully"}, 201

def login_user(data):
    if not data:
        log_event("LOGIN_FAILED", "Login attempt with empty request body")
        return {"error": "Invalid request body"}, 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        log_event("LOGIN_FAILED", f"Login attempt with missing credentials (email: {email})")
        return {"error": "Email and password required"}, 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        log_event("LOGIN_FAILED", f"Invalid credentials for email: {email}")
        return {"error": "Invalid credentials"}, 401

    # --------------------------------------------------
    # 🔐 Company-level account restrictions
    # --------------------------------------------------

    if user.company_id is not None:

        if not user.company:
            log_event("LOGIN_BLOCKED", f"User {email} attempted login but company not found")
            return {"error": "Company not found"}, 403

        if not user.company.is_active:
            log_event(
                "LOGIN_BLOCKED",
                f"Login blocked for {email} (Company suspended: {user.company.name})"
            )
            return {"error": "Company is suspended. Contact admin."}, 403

        if user.role.name == "Company Manager":
            if not user.is_verified:
                log_event(
                    "LOGIN_BLOCKED",
                    f"Unverified manager login attempt: {email}"
                )
                return {"error": "Email not verified. Please verify OTP."}, 403

    # --------------------------------------------------
    # 🔐 Successful Login
    # --------------------------------------------------

    access_token = create_access_token(
        identity=user.email,
        additional_claims={
            "user_id": user.id,
            "role": user.role.name,
            "company_id": user.company_id
        }
    )

    log_event(
        "LOGIN_SUCCESS",
        f"User {email} logged in successfully (Role: {user.role.name})"
    )

    return {
        "token": access_token,
        "role": user.role.name
    }, 200
