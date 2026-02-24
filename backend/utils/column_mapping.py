import re

# ==========================================================
# OPTIONAL COLUMN ALIASES (SYSTEM TRUSTED ONLY)
# ==========================================================

COLUMN_ALIASES = {

    "product_name": [
        "product", "product_name", "productname", "item", "item_name", "itemname", "sku_name", 
        "product_title", "producttitle", "item_title", "itemtitle"
    ],

    "category": [
        "category",
        "product_category",
        "productcategory",
        "item_category",
        "itemcategory",
        "type",
        "product_type",
        "producttype",
        "segment",
        "classification",
        "group"
    ],

    "sales_channel": [
        "sales_channel",
        "saleschannel",
        "channel",
        "order_channel",
        "orderchannel",
        "source",
        "order_source",
        "ordersource",
        "platform",
        "purchase_mode",
        "purchasemode"
    ],

    "state": [
        "state",
        "region",
        "province",
        "state_name",
        "statename",
        "delivery_state",
        "shipping_state",
        "billing_state",
        "location_state",
        "territory"
    ],

    "city": [
        "city",
        "town",
        "city_name",
        "cityname",
        "delivery_city",
        "shipping_city",
        "billing_city",
        "location_city",
        "municipality",
        "place"
    ]
}


# HELPER – NORMALIZE COLUMN NAMES
def normalize_column_name(col_name: str) -> str:
    """
    Normalize column name for comparison:
    - lowercase
    - remove spaces, underscores, hyphens
    """
    col_name = col_name.lower().strip()
    col_name = re.sub(r"[\s_\-]", "", col_name)
    return col_name

# ==========================================================
# AUTO-MAP OPTIONAL COLUMNS
# ==========================================================
def auto_map_optional_columns(detected_columns, optional_columns):
    """
    System-level auto mapping for OPTIONAL columns only.

    Args:
        detected_columns (list): CSV header names
        optional_columns (list): logical optional columns

    Returns:
        dict: { logical_column: actual_csv_column }
    """

    auto_mapping = {}

    # Pre-normalize detected columns
    normalized_detected = {
        normalize_column_name(col): col
        for col in detected_columns
    }

    for logical_col in optional_columns:
        aliases = COLUMN_ALIASES.get(logical_col, [])

        for alias in aliases:
            normalized_alias = normalize_column_name(alias)

            if normalized_alias in normalized_detected:
                auto_mapping[logical_col] = normalized_detected[normalized_alias]
                break  # stop after first confident match

    return auto_mapping
