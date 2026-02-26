from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from werkzeug.utils import secure_filename

import os
import uuid
import pandas as pd
from datetime import datetime
from sqlalchemy import func

from extensions import db

# Models
from models import (
    Company,
    User,
    Role,
    UploadedFile,
    ColumnMapping,
    SalesData
)

# Utilities
from utils.validators import allowed_file
from utils.decorators import role_required
from utils.column_mapping import auto_map_optional_columns

# Services
from services.data_cleaning_service import clean_and_store_sales_data

employee_bp = Blueprint("employee", __name__, url_prefix="/employee")


# ==========================================================
# CONFIG – REQUIRED & OPTIONAL LOGICAL COLUMNS
# ==========================================================

REQUIRED_LOGICAL_COLUMNS = [
    "order_id",
    "order_date",
    "product_id",
    "quantity",
    "unit_price",
    "payment_mode"
]

OPTIONAL_LOGICAL_COLUMNS = [
    "product_name",
    "category",
    "sales_channel",
    "state",
    "city"
]


# ==========================================================
# 👤 EMPLOYEE DASHBOARD
# ==========================================================
@employee_bp.route("/dashboard", methods=["GET"])
@jwt_required()
@role_required(["Employee"])
def employee_dashboard():

    try:
        claims = get_jwt()
        employee_id = claims.get("user_id")
        company_id = claims.get("company_id")

        # --------------------------------------------------
        # Company + Manager Details
        # --------------------------------------------------

        company = Company.query.get(company_id)
        if not company:
            return jsonify({"error": "Company not found"}), 404

        manager_role = Role.query.filter_by(name="Company Manager").first()

        manager = User.query.filter_by(
            company_id=company_id,
            role_id=manager_role.id
        ).first()

        # --------------------------------------------------
        # Employee Files
        # --------------------------------------------------

        employee_files = UploadedFile.query.filter_by(
            uploaded_by=employee_id
        ).all()

        file_ids = [f.id for f in employee_files]

        total_uploads = len(employee_files)

        total_cleaned_files = UploadedFile.query.filter(
            UploadedFile.uploaded_by == employee_id,
            UploadedFile.cleaned_file_path.isnot(None)
        ).count()

        # --------------------------------------------------
        # Sales Data (Only Employee Files)
        # --------------------------------------------------

        total_rows_inserted = 0
        total_revenue_generated = 0

        if file_ids:
            total_rows_inserted = SalesData.query.filter(
                SalesData.file_id.in_(file_ids)
            ).count()

            total_revenue_generated = db.session.query(
                db.func.coalesce(db.func.sum(SalesData.total_amount), 0)
            ).filter(
                SalesData.file_id.in_(file_ids)
            ).scalar()

        # --------------------------------------------------
        # Last Upload Date
        # --------------------------------------------------

        last_upload = db.session.query(
            db.func.max(UploadedFile.uploaded_at)
        ).filter(
            UploadedFile.uploaded_by == employee_id
        ).scalar()

        # --------------------------------------------------
        # Final Response
        # --------------------------------------------------

        return jsonify({
            "employee_overview": {
                "company_name": company.name,
                "manager_name": manager.username if manager else None,
                "manager_email": manager.email if manager else None,

                "total_uploads": total_uploads,
                "total_cleaned_files": total_cleaned_files,
                "total_rows_inserted": total_rows_inserted,
                "total_revenue_generated": float(total_revenue_generated),
                "last_upload_date": last_upload
            }
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to load employee dashboard",
            "details": str(e)
        }), 500
    
# ==========================================================
# PHASE 1️⃣ – UPLOAD & DETECT COLUMNS
# ==========================================================
@employee_bp.route("/upload", methods=["POST"])
@jwt_required()
@role_required(["Employee"])
def upload_file():

    if "file" not in request.files:
        return jsonify({"error": "File is required"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Only CSV allowed"}), 400

    claims = get_jwt()
    user_id = claims.get("user_id")
    company_id = claims.get("company_id")

    if not company_id:
        return jsonify({"error": "Employee not linked to company"}), 400

    # 🔥 NEW: Check if company is active
    company = Company.query.get(company_id)
    if not company or not company.is_active:
        return jsonify({
            "error": "Company is suspended. Uploads are blocked."
        }), 403

    # ---------------------------
    # Save file
    # ---------------------------
    original_filename = secure_filename(file.filename)
    ext = original_filename.rsplit(".", 1)[1].lower()

    unique_filename = f"{uuid.uuid4().hex}_{original_filename}"

    base_upload_dir = current_app.config.get("UPLOAD_FOLDER", "uploads")

    upload_dir = os.path.join(base_upload_dir, "raw_files")
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, unique_filename)
    file.save(file_path)

    uploaded_file = UploadedFile(
        filename=original_filename,
        file_path=file_path,
        file_type=ext,
        uploaded_by=user_id,
        company_id=company_id
    )

    db.session.add(uploaded_file)
    db.session.commit()

    # ---------------------------
    # Detect CSV headers
    # ---------------------------
    try:
        df = pd.read_csv(file_path, nrows=0)
        detected_columns = list(df.columns)
    except Exception as e:
        return jsonify({
            "error": "Failed to read CSV",
            "details": str(e)
        }), 400

    # ======================================================
    # 🔥 CHECK IF MAPPING EXISTS FOR COMPANY
    # ======================================================

    saved_mapping_obj = ColumnMapping.query.filter_by(
        company_id=company_id
    ).first()

    if saved_mapping_obj:
        saved_mapping = saved_mapping_obj.mapping_json

        if all(
            actual_col in detected_columns
            for actual_col in saved_mapping.values()
        ):
            result, status = clean_and_store_sales_data(
                file_path=file_path,
                company_id=company_id,
                uploaded_file_id=uploaded_file.id,
                column_mapping=saved_mapping
            )

            if status == 201:
                return jsonify({
                    "message": "File auto-processed using saved mapping",
                    "cleaning_report": result
                }), 201

    system_optional_mapping = auto_map_optional_columns(
        detected_columns=detected_columns,
        optional_columns=OPTIONAL_LOGICAL_COLUMNS
    )

    return jsonify({
        "message": "Column mapping required",
        "uploaded_file_id": uploaded_file.id,
        "detected_columns": detected_columns,
        "required_columns": REQUIRED_LOGICAL_COLUMNS,
        "optional_columns": OPTIONAL_LOGICAL_COLUMNS,
        "system_optional_mapping": system_optional_mapping
    }), 200


# ==========================================================
# PHASE 2️⃣ – USER MAPPING + CLEANING + SAVE TEMPLATE
# ==========================================================
@employee_bp.route("/map-columns", methods=["POST"])
@jwt_required()
@role_required(["Employee"])
def map_columns_and_process():

    data = request.get_json()

    uploaded_file_id = data.get("uploaded_file_id")
    required_mapping = data.get("required_mapping")
    optional_mapping = data.get("optional_mapping", {})
    system_optional_mapping = data.get("system_optional_mapping", {})

    if not uploaded_file_id or not required_mapping:
        return jsonify({
            "error": "uploaded_file_id and required_mapping are mandatory"
        }), 400

    uploaded_file = UploadedFile.query.get(uploaded_file_id)

    if not uploaded_file:
        return jsonify({"error": "Uploaded file not found"}), 404

    if uploaded_file.file_type != "csv":
        return jsonify({"error": "Column mapping only allowed for CSV"}), 400

    claims = get_jwt()
    company_id = claims.get("company_id")

    # 🔥 NEW: Check if company is active
    company = Company.query.get(company_id)
    if not company or not company.is_active:
        return jsonify({
            "error": "Company is suspended. Operation not allowed."
        }), 403

    missing_required = [
        col for col in REQUIRED_LOGICAL_COLUMNS
        if col not in required_mapping or not required_mapping[col]
    ]

    if missing_required:
        return jsonify({
            "error": "Required columns must be mapped by user",
            "missing_required_columns": missing_required
        }), 400

    final_column_mapping = {
        **system_optional_mapping,
        **optional_mapping,
        **required_mapping
    }

    result, status = clean_and_store_sales_data(
        file_path=uploaded_file.file_path,
        company_id=company_id,
        uploaded_file_id=uploaded_file.id,
        column_mapping=final_column_mapping
    )

    if status != 201:
        return jsonify({
            "message": "CSV uploaded but cleaning failed",
            "error": result
        }), status

    existing_mapping = ColumnMapping.query.filter_by(
        company_id=company_id
    ).first()

    if existing_mapping:
        existing_mapping.mapping_json = final_column_mapping
    else:
        new_mapping = ColumnMapping(
            company_id=company_id,
            mapping_json=final_column_mapping
        )
        db.session.add(new_mapping)

    db.session.commit()

    return jsonify({
        "message": "CSV cleaned, stored & mapping saved successfully",
        "cleaning_report": result
    }), 201

# ==========================================================
# 📊 AVAILABLE CHARTS (STRICT VALIDATION)
# ==========================================================
@employee_bp.route("/available-charts", methods=["GET"])
@jwt_required()
@role_required(["Employee"])
def get_available_charts():
    try:
        claims = get_jwt()
        employee_id = claims.get("user_id")

        # Step 1: Get employee file IDs
        employee_files = UploadedFile.query.filter_by(
            uploaded_by=employee_id
        ).all()

        if not employee_files:
            return jsonify({
                "available_charts": [],
                "message": "No uploaded files found."
            }), 200

        file_ids = [f.id for f in employee_files]

        # Step 2: Base query for employee sales data
        base_query = SalesData.query.filter(
            SalesData.file_id.in_(file_ids)
        )

        total_rows = base_query.count()

        if total_rows == 0:
            return jsonify({
                "available_charts": [],
                "message": "No cleaned data available."
            }), 200

        available_charts = []

        # --------------------------------------------------
        # 1️⃣ Revenue Over Time (always possible)
        # --------------------------------------------------
        available_charts.append("revenue_over_time")

        # --------------------------------------------------
        # 2️⃣ Sales Volume Over Time (always possible)
        # --------------------------------------------------
        available_charts.append("sales_volume_over_time")

        # --------------------------------------------------
        # 3️⃣ Online vs Offline (validate sales_channel)
        # --------------------------------------------------
        valid_channel_count = base_query.filter(
            SalesData.sales_channel.isnot(None),
            SalesData.sales_channel != "Unknown"
        ).count()

        if valid_channel_count > 0:
            available_charts.append("online_vs_offline")

        # --------------------------------------------------
        # 4️⃣ Top 10 Products (validate product_name)
        # --------------------------------------------------
        valid_product_count = base_query.filter(
            SalesData.product_name.isnot(None),
            SalesData.product_name != "Unknown"
        ).count()

        if valid_product_count > 0:
            available_charts.append("top_10_products")

        # --------------------------------------------------
        # 5️⃣ Sales by State (validate state)
        # --------------------------------------------------
        valid_state_count = base_query.filter(
            SalesData.state.isnot(None),
            SalesData.state != "Unknown"
        ).count()

        if valid_state_count > 0:
            available_charts.append("sales_by_state")

        # --------------------------------------------------
        # 6️⃣ Category Performance (validate category)
        # --------------------------------------------------
        valid_category_count = base_query.filter(
            SalesData.category.isnot(None),
            SalesData.category != "Unknown"
        ).count()

        if valid_category_count > 0:
            available_charts.append("category_performance")

        # --------------------------------------------------
        # 7️⃣ Payment Mode Distribution (always possible)
        # --------------------------------------------------
        available_charts.append("payment_mode_distribution")

        return jsonify({
            "available_charts": available_charts
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to determine available charts",
            "details": str(e)
        }), 500
    

# ==========================================================
# 📊 GENERATE CHART DATA
# ==========================================================
@employee_bp.route("/generate-charts", methods=["POST"])
@jwt_required()
@role_required(["Employee"])
def generate_charts():
    try:
        data = request.get_json()

        charts = data.get("charts", [])
        filter_data = data.get("filter", {})

        if not charts or len(charts) == 0:
            return jsonify({"error": "At least one chart required"}), 400

        if len(charts) > 3:
            return jsonify({"error": "Maximum 3 charts allowed"}), 400

        claims = get_jwt()
        employee_id = claims.get("user_id")

        # Get employee file IDs
        employee_files = UploadedFile.query.filter_by(
            uploaded_by=employee_id
        ).all()

        if not employee_files:
            return jsonify({"error": "No uploaded files found"}), 400

        file_ids = [f.id for f in employee_files]

        base_query = SalesData.query.filter(
            SalesData.file_id.in_(file_ids)
        )

        # -----------------------------
        # Apply Filters
        # -----------------------------
        filter_type = filter_data.get("type")

        if filter_type == "year":
            year = filter_data.get("year")
            base_query = base_query.filter(
                func.extract("year", SalesData.order_date) == year
            )

        elif filter_type == "month":
            year = filter_data.get("year")
            month = filter_data.get("month")
            base_query = base_query.filter(
                func.extract("year", SalesData.order_date) == year,
                func.extract("month", SalesData.order_date) == month
            )

        elif filter_type == "date_range":
            start_date = datetime.strptime(filter_data.get("start_date"), "%Y-%m-%d")
            end_date = datetime.strptime(filter_data.get("end_date"), "%Y-%m-%d")
            base_query = base_query.filter(
                SalesData.order_date.between(start_date, end_date)
            )

        response_data = {}

        # =====================================================
        # 1️⃣ Revenue Over Time
        # =====================================================
        if "revenue_over_time" in charts:
            results = (
                base_query.with_entities(
                    func.date_format(SalesData.order_date, "%Y-%m").label("month"),
                    func.sum(SalesData.total_amount)
                )
                .group_by("month")
                .order_by("month")
                .all()
            )

            labels = [r[0] for r in results]
            values = [float(r[1]) for r in results]

            response_data["revenue_over_time"] = {
                "labels": labels,
                "data": values
            }

        # =====================================================
        # 2️⃣ Sales Volume Over Time
        # =====================================================
        if "sales_volume_over_time" in charts:
            results = (
                base_query.with_entities(
                    func.date_format(SalesData.order_date, "%Y-%m").label("month"),
                    func.sum(SalesData.quantity)
                )
                .group_by("month")
                .order_by("month")
                .all()
            )

            labels = [r[0] for r in results]
            values = [int(r[1]) for r in results]

            response_data["sales_volume_over_time"] = {
                "labels": labels,
                "data": values
            }

        # =====================================================
        # 3️⃣ Online vs Offline (Timeline)
        # =====================================================
        if "online_vs_offline" in charts:
            results = (
                base_query.with_entities(
                    func.date_format(SalesData.order_date, "%Y-%m").label("month"),
                    SalesData.sales_channel,
                    func.sum(SalesData.total_amount)
                )
                .filter(
                    SalesData.sales_channel.isnot(None),
                    SalesData.sales_channel != "Unknown"
                )
                .group_by("month", SalesData.sales_channel)
                .order_by("month")
                .all()
            )

            data_map = {}

            for month, channel, value in results:
                if month not in data_map:
                    data_map[month] = {}
                data_map[month][channel] = float(value)

            labels = sorted(data_map.keys())

            online_data = [data_map[m].get("Online", 0) for m in labels]
            offline_data = [data_map[m].get("Offline", 0) for m in labels]

            response_data["online_vs_offline"] = {
                "labels": labels,
                "datasets": [
                    {"label": "Online", "data": online_data},
                    {"label": "Offline", "data": offline_data}
                ]
            }

        # =====================================================
        # 4️⃣ Top 10 Products
        # =====================================================
        if "top_10_products" in charts:
            results = (
                base_query.with_entities(
                    SalesData.product_name,
                    func.sum(SalesData.total_amount)
                )
                .filter(
                    SalesData.product_name.isnot(None),
                    SalesData.product_name != "Unknown"
                )
                .group_by(SalesData.product_name)
                .order_by(func.sum(SalesData.total_amount).desc())
                .limit(10)
                .all()
            )

            labels = [r[0] for r in results]
            values = [float(r[1]) for r in results]

            response_data["top_10_products"] = {
                "labels": labels,
                "data": values
            }

        # =====================================================
        # 5️⃣ Sales by State
        # =====================================================
        if "sales_by_state" in charts:
            results = (
                base_query.with_entities(
                    SalesData.state,
                    func.sum(SalesData.total_amount)
                )
                .filter(
                    SalesData.state.isnot(None),
                    SalesData.state != "Unknown"
                )
                .group_by(SalesData.state)
                .all()
            )

            labels = [r[0] for r in results]
            values = [float(r[1]) for r in results]

            response_data["sales_by_state"] = {
                "labels": labels,
                "data": values
            }

        # =====================================================
        # 6️⃣ Category Performance
        # =====================================================
        if "category_performance" in charts:
            results = (
                base_query.with_entities(
                    SalesData.category,
                    func.sum(SalesData.total_amount)
                )
                .filter(
                    SalesData.category.isnot(None),
                    SalesData.category != "Unknown"
                )
                .group_by(SalesData.category)
                .all()
            )

            labels = [r[0] for r in results]
            values = [float(r[1]) for r in results]

            response_data["category_performance"] = {
                "labels": labels,
                "data": values
            }

        # =====================================================
        # 7️⃣ Payment Mode Distribution
        # =====================================================
        if "payment_mode_distribution" in charts:
            results = (
                base_query.with_entities(
                    SalesData.payment_mode,
                    func.count(SalesData.order_id)
                )
                .group_by(SalesData.payment_mode)
                .all()
            )

            labels = [r[0] for r in results]
            values = [int(r[1]) for r in results]

            response_data["payment_mode_distribution"] = {
                "labels": labels,
                "data": values
            }

        return jsonify({
            "charts": response_data
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Chart generation failed",
            "details": str(e)
        }), 500