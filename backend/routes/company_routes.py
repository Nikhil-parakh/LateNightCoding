from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime, timedelta
import random, hashlib

from werkzeug.security import generate_password_hash   # ✅ FIX
from extensions import db
from models import Company, User, Role, OTPVerification, SalesData, UploadedFile
from utils.decorators import role_required

company_bp = Blueprint('company', __name__, url_prefix='/company')

# # COMPANY DASHBOARD
# @company_bp.route('/dashboard', methods=['GET'])
# @jwt_required()
# @role_required(['Company Manager', 'Employee'])
# def dashboard():
#     claims = get_jwt()
#     company_id = claims.get('company_id')

#     company = Company.query.get(company_id)
#     if not company:
#         return jsonify({"error": "Company not found"}), 404

#     sales = SalesData.query.filter_by(company_id=company_id).all()
#     total_revenue = sum(s.amount for s in sales)

#     recent_files = (
#         UploadedFile.query
#         .filter_by(company_id=company_id)
#         .order_by(UploadedFile.uploaded_at.desc())
#         .limit(5)
#         .all()
#     )

#     return jsonify({
#         "company": company.name,
#         "total_revenue": total_revenue,
#         "sales_count": len(sales),
#         "recent_uploads": [f.to_dict() for f in recent_files]
#     }), 200

# COMPANY DASHBOARD (MANAGER DASHBOARD)
@company_bp.route('/dashboard', methods=['GET'])
@jwt_required()
@role_required(['Company Manager'])
def dashboard():

    claims = get_jwt()
    company_id = claims.get('company_id')

    company = Company.query.get(company_id)
    if not company:
        return jsonify({"error": "Company not found"}), 404

    # -----------------------------
    # SECTION 1 — Company Overview
    # -----------------------------

    # Total Employees (exclude manager)
    employee_role = Role.query.filter_by(name="Employee").first()

    total_employees = User.query.filter_by(
        company_id=company_id,
        role_id=employee_role.id
    ).count()

    # Total Uploads
    total_uploads = UploadedFile.query.filter_by(
        company_id=company_id
    ).count()

    # Total Cleaned Files
    total_cleaned_files = UploadedFile.query.filter(
        UploadedFile.company_id == company_id,
        UploadedFile.cleaned_file_path.isnot(None)
    ).count()

    # Total Rows Stored
    total_rows_stored = SalesData.query.filter_by(
        company_id=company_id
    ).count()

    # Total Revenue
    total_revenue = db.session.query(
        db.func.coalesce(db.func.sum(SalesData.total_amount), 0)
    ).filter(
        SalesData.company_id == company_id
    ).scalar()

    # Last Upload Date
    last_upload = db.session.query(
        db.func.max(UploadedFile.uploaded_at)
    ).filter(
        UploadedFile.company_id == company_id
    ).scalar()

    # -----------------------------
    # SECTION 2 — Employee Activity
    # -----------------------------

    employee_activity = (
        db.session.query(
            User.id,
            User.username,
            db.func.count(UploadedFile.id).label("upload_count")
        )
        .join(UploadedFile, UploadedFile.uploaded_by == User.id, isouter=True)
        .filter(User.company_id == company_id)
        .filter(User.role_id == employee_role.id)
        .group_by(User.id)
        .all()
    )

    employee_activity_data = [
        {
            "employee_id": e.id,
            "employee_name": e.username,
            "upload_count": e.upload_count
        }
        for e in employee_activity
    ]

    # -----------------------------
    # Final Response
    # -----------------------------

    return jsonify({
        "company_overview": {
            "company_name": company.name,
            "industry": company.industry,
            "total_employees": total_employees,
            "total_uploads": total_uploads,
            "total_cleaned_files": total_cleaned_files,
            "total_rows_stored": total_rows_stored,
            "total_revenue": float(total_revenue),
            "last_upload_date": last_upload
        },
        "employee_activity": employee_activity_data
    }), 200


# STEP 1: REGISTER COMPANY (SEND OTP)
@company_bp.route('/register-company', methods=['POST'])
def register_company():
    data = request.get_json()

    company_name = data.get('company_name')
    industry = data.get('industry')
    manager_name = data.get('manager_name')
    email = data.get('email')
    password = data.get('password')

    if not all([company_name, industry, manager_name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    if Company.query.filter_by(name=company_name).first():
        return jsonify({"error": "Company already exists"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    otp = str(random.randint(100000, 999999))
    otp_hash = hashlib.sha256(otp.encode()).hexdigest()

    otp_entry = OTPVerification(
        email=email,
        otp_hash=otp_hash,
        expires_at=datetime.utcnow() + timedelta(minutes=5),
        company_name=company_name,
        industry=industry,
        manager_name=manager_name,
        password_hash=generate_password_hash(password)  # ✅ FIX
    )

    print(f"🔐 OTP for {email}: {otp}")

    db.session.add(otp_entry)
    db.session.commit()

    return jsonify({"message": "OTP sent to email"}), 200


# STEP 2: VERIFY OTP & CREATE COMPANY + MANAGER
@company_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')

    if not email or not otp:
        return jsonify({"error": "Email and OTP required"}), 400

    otp_entry = (
        OTPVerification.query
        .filter_by(email=email)
        .order_by(OTPVerification.created_at.desc())
        .first()
    )

    if not otp_entry or otp_entry.is_expired():
        return jsonify({"error": "OTP not found or expired"}), 400

    if hashlib.sha256(otp.encode()).hexdigest() != otp_entry.otp_hash:
        return jsonify({"error": "Invalid OTP"}), 400

    company = Company(
        name=otp_entry.company_name,
        industry=otp_entry.industry,
        is_active=True,
        verified_at=datetime.utcnow()
    )

    db.session.add(company)
    db.session.flush()

    manager_role = Role.query.filter_by(name="Company Manager").first()

    manager = User(
        username=otp_entry.manager_name,
        email=email,
        password_hash=otp_entry.password_hash,  # ✅ already correct now
        role_id=manager_role.id,
        company_id=company.id,
        is_verified=True
    )

    db.session.add(manager)
    db.session.delete(otp_entry)
    db.session.commit()

    return jsonify({
        "message": "Company registered & verified successfully",
        "company_id": company.id
    }), 201


# EMPLOYEE MANAGEMENT (NO CHANGES NEEDED)
@company_bp.route('/employees', methods=['POST'])
@jwt_required()
@role_required(['Company Manager'])
def add_employee():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([username, email, password]):
        return jsonify({"error": "All fields required"}), 400

    claims = get_jwt()
    company_id = claims.get('company_id')

    if User.query.filter(
        (User.username == username) | (User.email == email)
    ).first():
        return jsonify({"error": "Employee already exists"}), 400

    employee_role = Role.query.filter_by(name="Employee").first()

    employee = User(
        username=username,
        email=email,
        role_id=employee_role.id,
        company_id=company_id,
        is_verified=True
    )
    employee.set_password(password)

    db.session.add(employee)
    db.session.commit()

    return jsonify({"message": "Employee added", "employee": employee.to_dict()}), 201

# ✅ LIST EMPLOYEES (ADDED)
@company_bp.route('/employees', methods=['GET'])
@jwt_required()
@role_required(['Company Manager'])
def list_employees():
    claims = get_jwt()
    company_id = claims.get('company_id')

    employee_role = Role.query.filter_by(name="Employee").first()

    employees = User.query.filter_by(
        company_id=company_id,
        role_id=employee_role.id
    ).order_by(User.created_at.desc()).all()

    return jsonify({
        "count": len(employees),
        "employees": [
            {
                "id": e.id,
                "username": e.username,
                "email": e.email,
                "created_at": e.created_at.isoformat()
            }
            for e in employees
        ]
    }), 200



# ✅ REMOVE EMPLOYEE (ADDED)
@company_bp.route('/employees/<int:employee_id>', methods=['DELETE'])
@jwt_required()
@role_required(['Company Manager'])
def remove_employee(employee_id):
    claims = get_jwt()
    company_id = claims.get('company_id')

    employee = User.query.get(employee_id)

    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    if employee.company_id != company_id:
        return jsonify({"error": "Employee does not belong to your company"}), 403

    if employee.role.name != "Employee":
        return jsonify({"error": "Only employees can be removed"}), 403

    db.session.delete(employee)
    db.session.commit()

    return jsonify({"message": "Employee removed successfully"}), 200