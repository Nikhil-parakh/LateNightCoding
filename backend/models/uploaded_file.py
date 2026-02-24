from extensions import db
from datetime import datetime

class UploadedFile(db.Model):
    __tablename__ = 'uploaded_files'

    id = db.Column(db.Integer, primary_key=True)

    filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(20), nullable=False)  # csv / pdf

    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)   
    cleaned_file_path = db.Column(db.String(255), nullable=True)
    
    # 🔥 THIS IS THE KEY FIX
    sales_data = db.relationship(
        'SalesData',
        back_populates='source_file',
        cascade='all, delete-orphan'
    )

    uploader = db.relationship('User', back_populates='uploaded_files')
    company = db.relationship('Company', back_populates='files')

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "file_type": self.file_type,
            "uploaded_at": self.uploaded_at.isoformat()
        }
