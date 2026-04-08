import re

# ----------------------------------------
# INTENT KEYWORDS (EXPANDED + CLEANED)
# ----------------------------------------

INTENT_KEYWORDS = {
    "revenue": [
        "revenue", "income", "earnings", "total sales", "total revenue"
    ],

    "orders": [
        "orders", "transactions", "order count", "number of orders"
    ],

    "top_products": [
        "top product", "top products", "best product",
        "highest selling", "most sold", "top selling",
        "best selling", "top items"
    ],

    "sales_by_location": [
        "state sales", "city sales", "location sales",
        "sales by state", "sales by city",
        "state wise sales", "city wise sales"
    ],

    "payment_mode": [
        "payment mode", "payment method", "payment type",
        "how people pay", "payment distribution"
    ],

    "sales_channel": [
        "online vs offline", "online sales", "offline sales",
        "channel sales", "sales channel"
    ]
}


# ----------------------------------------
# PREPROCESS QUERY
# ----------------------------------------

def preprocess_query(query: str) -> str:
    query = query.lower()
    query = re.sub(r"[^\w\s]", " ", query)  # replace punctuation with space
    query = re.sub(r"\s+", " ", query)      # remove extra spaces
    return query.strip()


# ----------------------------------------
# DETECT INTENT (SMART SCORING)
# ----------------------------------------

def detect_intent(query: str):

    tokens = query.split()

    scores = {intent: 0 for intent in INTENT_KEYWORDS}

    for intent, keywords in INTENT_KEYWORDS.items():
        for keyword in keywords:
            keyword_tokens = keyword.split()

            # Strong match (exact phrase)
            if keyword in query:
                scores[intent] += 3

            # Medium match (all tokens present)
            elif all(token in tokens for token in keyword_tokens):
                scores[intent] += 2

            # Weak match (any token match)
            elif any(token in tokens for token in keyword_tokens):
                scores[intent] += 1

    # Priority order (specific → general)
    priority = [
        "top_products",
        "sales_by_location",
        "sales_channel",
        "payment_mode",
        "orders",
        "revenue"
    ]

    best_intent = None
    best_score = 0

    for intent in priority:
        if scores[intent] > best_score:
            best_score = scores[intent]
            best_intent = intent

    return best_intent if best_score > 0 else None


# ----------------------------------------
# EXTRACT ENTITIES (IMPROVED)
# ----------------------------------------

def extract_entities(query: str):

    entities = {}

    # ----------------------------------------
    # YEAR
    # ----------------------------------------
    year_match = re.search(r"\b(20\d{2})\b", query)
    if year_match:
        entities["year"] = int(year_match.group())

    # ----------------------------------------
    # MONTH (TEXT)
    # ----------------------------------------
    months = {
        "january": 1, "february": 2, "march": 3,
        "april": 4, "may": 5, "june": 6,
        "july": 7, "august": 8, "september": 9,
        "october": 10, "november": 11, "december": 12
    }

    for word, num in months.items():
        if word in query:
            entities["month"] = num

    # ----------------------------------------
    # RELATIVE TIME (basic support)
    # ----------------------------------------
    if "this year" in query:
        entities["relative_year"] = "this_year"

    if "last year" in query:
        entities["relative_year"] = "last_year"

    if "this month" in query:
        entities["relative_month"] = "this_month"

    if "last month" in query:
        entities["relative_month"] = "last_month"

    # ----------------------------------------
    # TOP N (top5, top 5)
    # ----------------------------------------
    top_match = re.search(r"top\s*(\d+)", query)
    if top_match:
        entities["limit"] = int(top_match.group(1))
    else:
        entities["limit"] = 5

    # ----------------------------------------
    # CHANNEL
    # ----------------------------------------
    if "online" in query and "offline" in query:
        entities["channel"] = "both"
    elif "online" in query:
        entities["channel"] = "online"
    elif "offline" in query:
        entities["channel"] = "offline"

    return entities