from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask_jwt_extended.exceptions import NoAuthorizationError
from jwt import ExpiredSignatureError, InvalidTokenError


def role_required(allowed_roles):
    """
    Restricts access based on user roles.
    allowed_roles: list of allowed roles
    """

    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):

            # 🔐 Verify JWT first
            try:
                verify_jwt_in_request()
            except (NoAuthorizationError, ExpiredSignatureError, InvalidTokenError):
                return jsonify({
                    "error": "Authentication required"
                }), 401

            claims = get_jwt()
            user_role = claims.get("role")

            if not user_role:
                return jsonify({
                    "error": "Invalid token: role missing"
                }), 401

            if user_role not in allowed_roles:
                return jsonify({
                    "error": "Access forbidden"
                }), 403

            # 🚀 Let actual route errors propagate
            return fn(*args, **kwargs)

        return decorator

    return wrapper


def admin_required(fn):
    return role_required(["Admin"])(fn)
