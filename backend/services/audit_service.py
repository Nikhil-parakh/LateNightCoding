from extensions import db
from models import AuditLog

def log_event(event_type, message):
    log = AuditLog(
        event_type=event_type,
        message=message
    )
    db.session.add(log)
    db.session.commit()
