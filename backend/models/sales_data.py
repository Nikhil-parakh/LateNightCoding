from extensions import db
from datetime import datetime


class SalesData(db.Model):
    __tablename__ = 'sales_data'

    # 🔐 Unique per company (Prevents duplicate uploads)
    __table_args__ = (
        db.UniqueConstraint(
            'order_id',
            'company_id',
            name='unique_order_per_company'
        ),
    )

    # ---------------------------------------------------
    # System / Primary Keys
    # ---------------------------------------------------
    id = db.Column(db.Integer, primary_key=True)

    # ---------------------------------------------------
    # REQUIRED CSV BUSINESS FIELDS
    # ---------------------------------------------------
    order_id = db.Column(db.String(100), nullable=False)
    order_date = db.Column(db.DateTime, nullable=False)

    product_id = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)

    payment_mode = db.Column(db.String(50), nullable=False)

    # ---------------------------------------------------
    # DERIVED / OPTIONAL FIELDS
    # ---------------------------------------------------
    total_amount = db.Column(db.Float, nullable=False)

    product_name = db.Column(db.String(100))
    category = db.Column(db.String(100))

    sales_channel = db.Column(db.String(50))
    state = db.Column(db.String(100))
    city = db.Column(db.String(100))

    # ---------------------------------------------------
    # SYSTEM METADATA (INTERNAL)
    # ---------------------------------------------------
    file_id = db.Column(
        db.Integer,
        db.ForeignKey('uploaded_files.id'),
        nullable=False
    )

    company_id = db.Column(
        db.Integer,
        db.ForeignKey('companies.id'),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # ---------------------------------------------------
    # Relationships
    # ---------------------------------------------------
    source_file = db.relationship(
        'UploadedFile',
        back_populates='sales_data'
    )

    company = db.relationship(
        'Company',
        back_populates='sales'
    )

    # ---------------------------------------------------
    # Serializer
    # ---------------------------------------------------
    def to_dict(self):
        return {
            "order_id": self.order_id,
            "order_date": self.order_date.isoformat(),
            "product_id": self.product_id,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "total_amount": self.total_amount,
            "payment_mode": self.payment_mode,
            "sales_channel": self.sales_channel,
            "state": self.state,
            "city": self.city
        }
