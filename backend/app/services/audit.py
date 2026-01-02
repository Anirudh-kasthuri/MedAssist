from app.db.models import AuditLog

def log_action(db, user_id: int, action: str):
    log = AuditLog(
        user_id=user_id,
        action=action
    )
    db.add(log)
    db.commit()
