from extensions import db
from datetime import datetime
from sqlalchemy.dialects.mysql import JSON


class ColumnMapping(db.Model):
    __tablename__ = 'column_mappings'

    # ---------------------------------------------------
    # Primary Key
    # ---------------------------------------------------
    id = db.Column(db.Integer, primary_key=True)

    # ---------------------------------------------------
    # Foreign Key (One Mapping Per Company)
    # ---------------------------------------------------
    company_id = db.Column(
        db.Integer,
        db.ForeignKey('companies.id'),
        nullable=False,
        unique=True  # 🔥 Only one active mapping per company
    )

    # ---------------------------------------------------
    # Stored Mapping (Logical → Actual)
    # Example:
    # {
    #   "order_id": "order_no",
    #   "order_date": "order_dt",
    #   "product_id": "item_id",
    #   ...
    # }
    # ---------------------------------------------------
    mapping_json = db.Column(JSON, nullable=False)

    # ---------------------------------------------------
    # Metadata
    # ---------------------------------------------------
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # ---------------------------------------------------
    # Relationship
    # ---------------------------------------------------
    company = db.relationship(
        'Company',
        backref=db.backref('column_mapping', uselist=False)
    )

    # ---------------------------------------------------
    # Serializer
    # ---------------------------------------------------
    def to_dict(self):
        return {
            "id": self.id,
            "company_id": self.company_id,
            "mapping_json": self.mapping_json,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
