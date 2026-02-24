from flask import Blueprint, jsonify, request
from extensions import db
from sqlalchemy import func, asc, desc
from models import Company, User, SalesData, UploadedFile, Role
from utils.decorators import admin_required
from models import AuditLog
from services.audit_service import log_event

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# ==========================================================
# 🧪 PUBLIC TEST ROUTE (No Authentication Required)
# ==========================================================
@admin_bp.route("/public-test", methods=["GET"])
def public_test():
    return jsonify({
        "status": "Backend is running successfully 🚀",
        "message": "No authentication required for this route."
    }), 200

# ==========================================================
# 1️⃣ PLATFORM OVERVIEW DASHBOARD
# ==========================================================
@admin_bp.route('/home', methods=['GET'])
@admin_required
def dashboard():
    """
    Admin Home Dashboard
    Platform level real-time statistics
    """
    try:
        total_registered_companies = Company.query.count()

        total_active_companies = Company.query.filter_by(
            is_active=True
        ).count()

        total_suspended_companies = Company.query.filter_by(
            is_active=False
        ).count()

        total_users = User.query.count()

        total_files_uploaded = UploadedFile.query.count()

        total_cleaned_files_generated = UploadedFile.query.filter(
            UploadedFile.cleaned_file_path.isnot(None)
        ).count()

        total_rows_stored = SalesData.query.count()

        return jsonify({
            "platform_overview": {
                "total_registered_companies": total_registered_companies,
                "total_active_companies": total_active_companies,
                "total_suspended_companies": total_suspended_companies,
                "total_users_in_system": total_users,
                "total_files_uploaded": total_files_uploaded,
                "total_rows_stored": total_rows_stored,
                "total_cleaned_files_generated": total_cleaned_files_generated
            }
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to load dashboard",
            "details": str(e)
        }), 500

# ==========================================================
# 2️⃣ COMPANY MANAGEMENT - LIST COMPANIES
# ==========================================================
@admin_bp.route('/companies', methods=['GET'])
@admin_required
def get_companies():

    try:
        # ----------------------------
        # Pagination (Safe Defaults)
        # ----------------------------
        page = request.args.get('page', default=1, type=int)
        limit = request.args.get('limit', default=2, type=int)

        if page < 1:
            page = 1

        if limit < 1 or limit > 100:
            limit = 10  # safety cap

        offset = (page - 1) * limit

        # ----------------------------
        # Optional Query Params
        # ----------------------------
        search = request.args.get('search', type=str)
        status = request.args.get('status', type=str)
        sort_by = request.args.get('sort_by', default='registration_date')
        order = request.args.get('order', default='desc')

        # ----------------------------
        # Base Query (NO ROLE JOIN)
        # ----------------------------
        base_query = db.session.query(
            Company.id.label("company_id"),
            Company.name.label("company_name"),
            Company.industry,
            Company.created_at.label("registration_date"),
            Company.is_active,
            func.count(func.distinct(UploadedFile.id)).label("uploads"),
            func.count(func.distinct(SalesData.id)).label("data_volume")
        ).outerjoin(
            UploadedFile,
            UploadedFile.company_id == Company.id
        ).outerjoin(
            SalesData,
            SalesData.company_id == Company.id
        ).group_by(
            Company.id
        )

        # ----------------------------
        # Search
        # ----------------------------
        if search:
            search_pattern = f"%{search}%"
            base_query = base_query.filter(
                Company.name.ilike(search_pattern) |
                Company.industry.ilike(search_pattern)
            )

        # ----------------------------
        # Status Filter
        # ----------------------------
        if status:
            if status.lower() == "active":
                base_query = base_query.filter(Company.is_active.is_(True))
            elif status.lower() == "suspended":
                base_query = base_query.filter(Company.is_active.is_(False))

        # ----------------------------
        # Total Records (SAFE COUNT)
        # Count companies separately (important)
        # ----------------------------
        count_query = db.session.query(func.count(Company.id))

        if search:
            count_query = count_query.filter(
                Company.name.ilike(search_pattern) |
                Company.industry.ilike(search_pattern)
            )

        if status:
            if status.lower() == "active":
                count_query = count_query.filter(Company.is_active.is_(True))
            elif status.lower() == "suspended":
                count_query = count_query.filter(Company.is_active.is_(False))

        total_records = count_query.scalar()
        total_pages = (total_records + limit - 1) // limit

        # ----------------------------
        # Sorting (Whitelist Only)
        # ----------------------------
        sort_fields = {
            "registration_date": Company.created_at,
            "uploads": func.count(func.distinct(UploadedFile.id)),
            "data_volume": func.count(func.distinct(SalesData.id))
        }

        sort_column = sort_fields.get(sort_by, Company.created_at)

        if order.lower() == "asc":
            base_query = base_query.order_by(asc(sort_column))
        else:
            base_query = base_query.order_by(desc(sort_column))

        # ----------------------------
        # Apply Pagination
        # ----------------------------
        companies = base_query.offset(offset).limit(limit).all()

        # ----------------------------
        # Format Response
        # ----------------------------
        company_list = []

        for c in companies:
            company_list.append({
                "company_id": c.company_id,
                "company_name": c.company_name,
                "industry": c.industry,
                "registration_date": c.registration_date,
                "uploads": c.uploads,
                "data_volume": c.data_volume,
                "status": "Active" if c.is_active else "Suspended"
            })

        return jsonify({
            "companies": company_list,
            "pagination": {
                "current_page": page,
                "per_page": limit,
                "total_records": total_records,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1
            }
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to fetch companies",
            "details": str(e)
        }), 500

# ==========================================================
# 3️⃣ SUSPEND COMPANY
# ==========================================================
@admin_bp.route('/company/<int:company_id>/suspend', methods=['PATCH'])
@admin_required
def suspend_company(company_id):
    try:
        company = Company.query.get(company_id)

        if not company:
            return jsonify({"error": "Company not found"}), 404

        if not company.is_active:
            return jsonify({"message": "Company already suspended"}), 200

        company.is_active = False
        db.session.commit()

        log_event(
            "SUSPEND",
            f"Admin suspended company {company.name}"
        )

        return jsonify({
            "message": "Company suspended successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to suspend company",
            "details": str(e)
        }), 500

# ==========================================================
# 4️⃣ RECOVER COMPANY
# ==========================================================
@admin_bp.route('/company/<int:company_id>/recover', methods=['PATCH'])
@admin_required
def recover_company(company_id):
    try:
        company = Company.query.get(company_id)

        if not company:
            return jsonify({"error": "Company not found"}), 404

        if company.is_active:
            return jsonify({"message": "Company already active"}), 200

        company.is_active = True
        db.session.commit()

        log_event(
            "RECOVER",
            f"Admin recovered company {company.name}"
        )

        return jsonify({
            "message": "Company recovered successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to recover company",
            "details": str(e)
        }), 500

# ==========================================================
# 5️⃣ AUDIT LOGS – LAST 15 ACTIVITIES
# ==========================================================
@admin_bp.route('/audit-logs', methods=['GET'])
@admin_required
def get_audit_logs():
    try:
        logs = (
            AuditLog.query
            .order_by(AuditLog.created_at.desc())
            .limit(15)
            .all()
        )

        log_list = []

        for log in logs:
            log_list.append({
                "event_type": log.event_type,
                "message": log.message,
                "created_at": log.created_at
            })

        return jsonify({
            "logs": log_list
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to fetch audit logs",
            "details": str(e)
        }), 500
