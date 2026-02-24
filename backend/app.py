from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from extensions import db, jwt, migrate

# 🔹 Blueprints
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.company_routes import company_bp
from routes.employee_routes import employee_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # --------------------------------------------------
    # Enable CORS (Frontend Integration)
    # --------------------------------------------------
    # Allow all origins (DEV MODE)
    CORS(app, supports_credentials=True)

    # If you want strict origin (recommended later):
    # CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # --------------------------------------------------
    # Initialize Extensions
    # --------------------------------------------------
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # --------------------------------------------------
    # Register Blueprints
    # --------------------------------------------------
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(company_bp)
    app.register_blueprint(employee_bp)

    # --------------------------------------------------
    # JWT Error Handlers
    # --------------------------------------------------
    @jwt.unauthorized_loader
    def unauthorized_callback(reason):
        return jsonify({
            "jwt_error": "missing_or_invalid_token",
            "reason": reason
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(reason):
        return jsonify({
            "jwt_error": "invalid_token",
            "reason": reason
        }), 422

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "jwt_error": "token_expired"
        }), 401

    @jwt.needs_fresh_token_loader
    def fresh_token_required(jwt_header, jwt_payload):
        return jsonify({
            "jwt_error": "fresh_token_required"
        }), 401

    return app


# --------------------------------------------------
# Run App (Development Only)
# --------------------------------------------------
if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        db.create_all()

    app.run(debug=True, port=5000)