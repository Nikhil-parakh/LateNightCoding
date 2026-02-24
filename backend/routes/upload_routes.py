# from flask import Blueprint, request, jsonify
# from flask_jwt_extended import get_jwt_identity, jwt_required
# from services.file_service import save_and_process_file
# from utils.decorators import role_required

# upload_bp = Blueprint('upload', __name__)

# # ==========================================================
# # ================= EXISTING ROUTE =========================
# # ==========================================================

# @upload_bp.route('/upload', methods=['POST'])
# @jwt_required()
# @role_required(['Company Manager'])  # Only Managers can upload
# def upload_file():
#     """
#     Upload CSV / PDF file and process it
#     """
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400

#     file = request.files['file']
#     identity = get_jwt_identity()

#     response, status = save_and_process_file(
#         file,
#         user_id=identity['id'],
#         company_id=identity['company_id']
#     )

#     return jsonify(response), status