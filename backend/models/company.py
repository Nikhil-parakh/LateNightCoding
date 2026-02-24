from extensions import db
from datetime import datetime

class Company(db.Model):
    __tablename__ = 'companies'

    id = db.Column(db.Integer, primary_key=True)

    # Core details
    name = db.Column(db.String(100), unique=True, nullable=False)
    industry = db.Column(db.String(100), nullable=False)  # 🔹 NEW

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Verification & activation
    is_active = db.Column(db.Boolean, default=False, nullable=False)
    verified_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    users = db.relationship('User', back_populates='company')
    files = db.relationship('UploadedFile', back_populates='company')
    sales = db.relationship('SalesData', back_populates='company')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'industry': self.industry,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'verified_at': self.verified_at.isoformat() if self.verified_at else None
        }
