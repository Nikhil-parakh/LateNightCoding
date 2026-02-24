import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app
from extensions import db
from models import UploadedFile
from services.sales_service import process_sales_file
from utils.validators import allowed_file

def save_and_process_file(file, user_id, company_id):
    if not file or file.filename == '':
        return {"error": "No file selected"}, 400

    if not allowed_file(file.filename):
        return {"error": "Invalid file type. Only CSV and Excel allowed"}, 400

    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)

    try:
        # 1. Save Physical File
        file.save(file_path)

        # 2. Save Metadata to DB
        new_file = UploadedFile(
            filename=filename,
            file_path=file_path,
            uploaded_by=user_id,
            company_id=company_id
        )
        db.session.add(new_file)
        db.session.commit()

        # 3. Process Data
        success, message = process_sales_file(file_path, new_file.id, company_id)
        
        if not success:
            os.remove(file_path)
            return {"message": "File upload failed", "details": message}, 400

        return {"message": "File uploaded and processed successfully"}, 201

    except Exception as e:
        return {"error": str(e)}, 500
    