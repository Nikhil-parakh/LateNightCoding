import pandas as pd
from models import SalesData
from extensions import db

def process_sales_file(file_path, file_id, company_id):
    """
    Parses CSV/Excel and populates sales_data table.
    Assumes columns: Product, Amount, Date
    """
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        # Basic normalization
        df.columns = [c.lower() for c in df.columns]
        # Validation: Check if required columns exist
        required_cols = {'product', 'amount'}
        if not required_cols.issubset(df.columns):
            return False, "Missing columns. Required: Product, Amount"

        sale_date = row.get('date')
        sales_entries = []
        for _, row in df.iterrows():
            sale = SalesData(
                product_name=row.get('product', 'Unknown'),
                amount=row.get('amount', 0.0),
                sale_date=pd.to_datetime(sale_date, errors='coerce'),
                file_id=file_id,
                company_id=company_id
                # Date handling can be added here
            )
            sales_entries.append(sale)

        db.session.bulk_save_objects(sales_entries)
        db.session.commit()
        return True, "Data processed successfully"

    except Exception as e:
        return False, str(e)