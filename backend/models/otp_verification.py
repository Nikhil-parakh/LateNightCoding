from extensions import db
from datetime import datetime

class OTPVerification(db.Model):
    __tablename__ = "otp_verifications"

    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(120), nullable=False, index=True)

    # 🔐 OTP
    otp_hash = db.Column(db.String(256), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)

    # 🧠 TEMP REGISTRATION DATA
    company_name = db.Column(db.String(100), nullable=False)
    industry = db.Column(db.String(100), nullable=False)
    manager_name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def is_expired(self):
        return datetime.utcnow() > self.expires_at

