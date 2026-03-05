import re

# ----------------------------------------
# INTENT KEYWORDS
# ----------------------------------------

INTENT_KEYWORDS = {
    "revenue": ["revenue", "earnings", "income"],
    "orders": ["orders", "transactions", "sales count"],
    "top_products": ["top product", "best product", "top selling"],
    "state_sales": ["sales by state", "state wise sales"],
    "payment_mode": ["payment mode", "payment method", "payment distribution"]
}


# ----------------------------------------
# PREPROCESS QUERY
# ----------------------------------------

def preprocess_query(query: str) -> str:
    query = query.lower()
    query = re.sub(r"[^\w\s]", "", query)
    query = query.strip()
    return query


# ----------------------------------------
# DETECT INTENT
# ----------------------------------------

def detect_intent(query: str):

    for intent, keywords in INTENT_KEYWORDS.items():
        for word in keywords:
            if word in query:
                return intent

    return None


# ----------------------------------------
# EXTRACT ENTITIES
# ----------------------------------------

def extract_entities(query: str):

    entities = {}

    # Detect year
    year_match = re.search(r"\b(20\d{2})\b", query)
    if year_match:
        entities["year"] = int(year_match.group())

    # Detect top N
    top_match = re.search(r"top\s+(\d+)", query)
    if top_match:
        entities["limit"] = int(top_match.group(1))
    else:
        entities["limit"] = 5

    return entities