from extensions import db
from datetime import datetime


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(db.Integer, primary_key=True)

    event_type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.Text, nullable=False)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    def __repr__(self):
        return f"<AuditLog {self.event_type} at {self.created_at}>"
