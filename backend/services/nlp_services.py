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

    # ----------------------------------------
    # PREPROCESS + NLP
    # ----------------------------------------
    query = preprocess_query(query)

    intent = detect_intent(query)

    if not intent:
        return "I can only answer questions related to your sales data."

    entities = extract_entities(query)

    # DEBUG (optional but useful)
    print("Query:", query)
    print("Intent:", intent)
    print("Entities:", entities)

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
    # APPLY FILTERS (YEAR / MONTH)
    # ----------------------------------------

    if "year" in entities:
        base_query = base_query.filter(
            extract("year", SalesData.order_date) == entities["year"]
        )

    if "month" in entities:
        base_query = base_query.filter(
            extract("month", SalesData.order_date) == entities["month"]
        )

    # ----------------------------------------
    # INTENT HANDLERS
    # ----------------------------------------

    # ✅ 1. REVENUE (FIXED)
    if intent == "revenue":

        total_revenue = base_query.with_entities(
            func.coalesce(func.sum(SalesData.total_amount), 0)
        ).scalar()

        if "year" in entities:
            return f"Total revenue in {entities['year']} is {int(total_revenue)}."

        return f"Total revenue is {int(total_revenue)}."



    # ✅ 2. ORDERS
    elif intent == "orders":

        total_orders = base_query.count()

        return f"Total number of orders is {total_orders}."



    # ✅ 3. TOP PRODUCTS (IMPROVED)
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
            return "No product data available."

        response = f"Top {limit} products:\n"
        for r in results:
            response += f"{r[0]} → {int(r[1])}\n"

        return response



    # ✅ 4. SALES BY LOCATION (CITY / STATE)
    elif intent == "sales_by_location":

        if "city" in query:
            field = SalesData.city
            label = "city"
        else:
            field = SalesData.state
            label = "state"

        results = (
            base_query.with_entities(
                field,
                func.sum(SalesData.total_amount)
            )
            .filter(
                field.isnot(None),
                field != "Unknown"
            )
            .group_by(field)
            .order_by(func.sum(SalesData.total_amount).desc())
            .all()
        )

        if not results:
            return f"No {label} sales data available."

        top = results[0]

        return f"Highest sales {label} is {top[0]} with revenue {int(top[1])}."



    # ✅ 5. PAYMENT MODE
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



    # ✅ 6. ONLINE vs OFFLINE SALES
    elif intent == "sales_channel":

        results = (
            base_query.with_entities(
                SalesData.channel,
                func.sum(SalesData.total_amount)
            )
            .group_by(SalesData.channel)
            .all()
        )

        if not results:
            return "No channel data available."

        response = "Sales by channel:\n"
        for r in results:
            response += f"{r[0]}: {int(r[1])}\n"

        return response


    # ----------------------------------------
    # FALLBACK
    # ----------------------------------------

    return "Sorry, I couldn't understand your query. Try asking about revenue, products, or sales insights."