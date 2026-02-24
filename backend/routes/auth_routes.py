from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.auth_service import register_user, login_user
from models import User

# --------------------------------------------------
# Blueprint (ACTUAL API ROUTES)
# --------------------------------------------------
auth_bp = Blueprint('auth', __name__)

# --------------------------------------------------
# ACTUAL ROUTES
# --------------------------------------------------

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    response, status = register_user(data)
    return jsonify(response), status


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    response, status = login_user(data)
    return jsonify(response), status


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    email = get_jwt_identity()     # email string
    claims = get_jwt()

    user = User.query.filter_by(email=email).first()
    if not user:
        return {"error": "User not found"}, 404

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": claims.get("role"),
        "company_id": claims.get("company_id")
    }, 200
