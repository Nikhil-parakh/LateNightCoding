from sqlalchemy import func, extract

from models import SalesData, UploadedFile
from extensions import db

from utils.nlp_utils import (
    preprocess_query,
    detect_intent,
    extract_entities
)


# -----------------------------------------------------
# MAIN NLP PROCESSOR
# -----------------------------------------------------

def process_nlp_query(query: str, employee_id: int):

    query = preprocess_query(query)

    intent = detect_intent(query)

    if not intent:
        return "I can only answer questions related to your sales data."

    entities = extract_entities(query)

    # ----------------------------------------
    # Get employee files
    # ----------------------------------------

    employee_files = UploadedFile.query.filter_by(
        uploaded_by=employee_id
    ).all()

    if not employee_files:
        return "No uploaded data found."

    file_ids = [f.id for f in employee_files]

    base_query = SalesData.query.filter(
        SalesData.file_id.in_(file_ids)
    )

    # ----------------------------------------
    # Apply year filter
    # ----------------------------------------

    if "year" in entities:
        base_query = base_query.filter(
            extract("year", SalesData.order_date) == entities["year"]
        )

    # ----------------------------------------
    # INTENT HANDLERS
    # ----------------------------------------

    if intent == "revenue":

        total_revenue = db.session.query(
            func.coalesce(func.sum(SalesData.total_amount), 0)
        ).filter(
            SalesData.file_id.in_(file_ids)
        ).scalar()

        if "year" in entities:
            return f"Total revenue in {entities['year']} is {int(total_revenue)}."

        return f"Total revenue is {int(total_revenue)}."



    elif intent == "orders":

        total_orders = base_query.count()

        return f"Total number of orders is {total_orders}."



    elif intent == "top_products":

        limit = entities.get("limit", 5)

        results = (
            base_query.with_entities(
                SalesData.product_name,
                func.sum(SalesData.total_amount)
            )
            .filter(
                SalesData.product_name.isnot(None),
                SalesData.product_name != "Unknown"
            )
            .group_by(SalesData.product_name)
            .order_by(func.sum(SalesData.total_amount).desc())
            .limit(limit)
            .all()
        )

        if not results:
            return "No product sales data available."

        top_product = results[0]

        return f"Top product is {top_product[0]} with revenue {int(top_product[1])}."



    elif intent == "state_sales":

        results = (
            base_query.with_entities(
                SalesData.state,
                func.sum(SalesData.total_amount)
            )
            .filter(
                SalesData.state.isnot(None),
                SalesData.state != "Unknown"
            )
            .group_by(SalesData.state)
            .order_by(func.sum(SalesData.total_amount).desc())
            .all()
        )

        if not results:
            return "No state sales data available."

        top_state = results[0]

        return f"Highest sales state is {top_state[0]} with revenue {int(top_state[1])}."



    elif intent == "payment_mode":

        results = (
            base_query.with_entities(
                SalesData.payment_mode,
                func.count(SalesData.order_id)
            )
            .group_by(SalesData.payment_mode)
            .order_by(func.count(SalesData.order_id).desc())
            .all()
        )

        if not results:
            return "No payment data available."

        mode = results[0]

        return f"Most used payment mode is {mode[0]} with {mode[1]} transactions."
    
    return "I can only answer questions related to your sales data."