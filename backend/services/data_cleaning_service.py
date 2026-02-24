import os
import pandas as pd
import re
from datetime import datetime
from extensions import db
from models import SalesData, UploadedFile
from sqlalchemy.exc import IntegrityError


# =====================================================
# CLEANING HELPERS (UNCHANGED)
# =====================================================

def clean_amount(value):
    if pd.isna(value):
        return None

    value = str(value)
    value = re.sub(r"[^\d.]", "", value)
    try:
        return float(value)
    except ValueError:
        return None


def clean_sale_date(value):
    if pd.isna(value):
        return None

    value = str(value).strip()

    try:
        parsed = pd.to_datetime(value, errors="coerce", dayfirst=True)
        return None if pd.isna(parsed) else parsed
    except Exception:
        return None


# =====================================================
# PHASE 2️⃣ – CLEAN CSV
# =====================================================

def clean_sales_csv(file_path, column_mapping):

    df = pd.read_csv(file_path)
    rows_before = len(df)

    # Rename
    rename_dict = {
        actual: logical
        for logical, actual in column_mapping.items()
        if actual in df.columns
    }
    df = df.rename(columns=rename_dict)

    # Normalize order_id
    df["order_id"] = df["order_id"].astype(str).str.strip()
    df["order_id"] = df["order_id"].str.replace(r"\.0$", "", regex=True)

    # Ensure optional columns exist
    optional_columns = [
        "product_name",
        "category",
        "sales_channel",
        "state",
        "city"
    ]

    for col in optional_columns:
        if col not in df.columns:
            df[col] = None

    # Drop missing order_id
    df = df.dropna(subset=["order_id"])

    # Deduplicate inside file
    before_duplicates = len(df)
    df = df.drop_duplicates(subset=["order_id"])
    duplicates_removed = before_duplicates - len(df)

    # Clean numeric/date
    df["unit_price"] = df["unit_price"].apply(clean_amount)
    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")
    df["order_date"] = df["order_date"].apply(clean_sale_date)

    if "total_amount" in df.columns:
        df["total_amount"] = pd.to_numeric(df["total_amount"], errors="coerce")
    else:
        df["total_amount"] = None

    # Recovery logic
    def recover_numeric(row):
        qty = row["quantity"]
        price = row["unit_price"]
        total = row["total_amount"]

        if pd.isna(qty) and pd.notna(price) and pd.notna(total) and price > 0:
            row["quantity"] = total / price

        if pd.isna(price) and pd.notna(qty) and pd.notna(total) and qty > 0:
            row["unit_price"] = total / qty

        if pd.notna(row["quantity"]) and pd.notna(row["unit_price"]):
            row["total_amount"] = row["quantity"] * row["unit_price"]

        return row

    df = df.apply(recover_numeric, axis=1)

    # String normalization
    string_columns = [
        "payment_mode",
        "product_name",
        "category",
        "sales_channel",
        "state",
        "city"
    ]

    for col in string_columns:
        if col in df.columns:
            df[col] = df[col].fillna("Unknown")
            df[col] = df[col].replace("", "Unknown")

    # Validation
    before_invalid = len(df)

    df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")
    df["unit_price"] = pd.to_numeric(df["unit_price"], errors="coerce")

    df = df[~(
        df["quantity"].isna() &
        df["unit_price"].isna()
    )]

    df = df[df["quantity"].notna()]
    df = df[df["unit_price"].notna()]
    df = df[df["quantity"] > 0]
    df = df[df["unit_price"] > 0]
    df = df[df["order_date"].notna()]
    df = df[df["product_id"].notna()]
    df = df[df["order_date"] <= datetime.utcnow()]

    invalid_rows_removed = before_invalid - len(df)

    stats = {
        "rows_before": rows_before,
        "rows_after": len(df),
        "duplicates_removed": duplicates_removed,
        "invalid_rows_removed": invalid_rows_removed
    }

    return df, stats


# =====================================================
# PHASE 3️⃣ – STORE + SAVE CLEANED CSV
# =====================================================

def clean_and_store_sales_data(
    file_path,
    company_id,
    uploaded_file_id,
    column_mapping
):
    try:
        cleaned_df, stats = clean_sales_csv(
            file_path=file_path,
            column_mapping=column_mapping
        )

        # 🔥 SAVE CLEANED CSV (NEW)
        cleaned_dir = os.path.join("uploads", "cleaned_files")
        os.makedirs(cleaned_dir, exist_ok=True)

        cleaned_filename = f"cleaned_{uploaded_file_id}.csv"
        cleaned_path = os.path.join(cleaned_dir, cleaned_filename)

        cleaned_df.to_csv(cleaned_path, index=False)

        # Update UploadedFile with cleaned path
        uploaded_file = UploadedFile.query.get(uploaded_file_id)
        if uploaded_file:
            uploaded_file.cleaned_file_path = cleaned_path
            db.session.commit()

        # Insert into DB safely
        cleaned_df = cleaned_df.where(pd.notna(cleaned_df), None)

        inserted = 0

        for _, row in cleaned_df.iterrows():
            try:
                sale = SalesData(
                    order_id=str(row["order_id"]),
                    order_date=row["order_date"],
                    product_id=str(row["product_id"]),
                    quantity=int(row["quantity"]),
                    unit_price=float(row["unit_price"]),
                    total_amount=float(row["total_amount"]),
                    payment_mode=row["payment_mode"],
                    product_name=row.get("product_name"),
                    category=row.get("category"),
                    sales_channel=row.get("sales_channel"),
                    state=row.get("state"),
                    city=row.get("city"),
                    company_id=company_id,
                    file_id=uploaded_file_id
                )

                db.session.add(sale)
                db.session.commit()
                inserted += 1

            except IntegrityError:
                db.session.rollback()
                continue

        stats["new_rows_inserted"] = inserted
        stats["cleaned_csv_path"] = cleaned_path

        return {
            "message": "CSV cleaned, stored & cleaned file saved successfully",
            "stats": stats
        }, 201

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500


# ----- last change made for CSV generation.


# import pandas as pd
# import re
# from datetime import datetime
# from extensions import db
# from models import SalesData
# from sqlalchemy.exc import IntegrityError


# # =====================================================
# # CLEANING HELPERS (UNCHANGED)
# # =====================================================

# def clean_amount(value):
#     if pd.isna(value):
#         return None

#     value = str(value)
#     value = re.sub(r"[^\d.]", "", value)
#     try:
#         return float(value)
#     except ValueError:
#         return None


# def clean_sale_date(value):
#     if pd.isna(value):
#         return None

#     value = str(value).strip()

#     try:
#         parsed = pd.to_datetime(value, errors="coerce", dayfirst=True)
#         return None if pd.isna(parsed) else parsed
#     except Exception:
#         return None


# # =====================================================
# # PHASE 2️⃣ – CLEAN CSV USING FINAL COLUMN MAPPING
# # =====================================================

# def clean_sales_csv(file_path, column_mapping):

#     df = pd.read_csv(file_path)
#     rows_before = len(df)

#     # ----------------------------------
#     # 1️⃣ Rename ACTUAL → LOGICAL columns
#     # ----------------------------------
#     rename_dict = {
#         actual: logical
#         for logical, actual in column_mapping.items()
#         if actual in df.columns
#     }
#     df = df.rename(columns=rename_dict)

#     # ----------------------------------
#     # 🔥 CRITICAL FIX: Normalize order_id
#     # ----------------------------------
#     df["order_id"] = df["order_id"].astype(str).str.strip()
#     df["order_id"] = df["order_id"].str.replace(r"\.0$", "", regex=True)

#     # ----------------------------------
#     # 2️⃣ Ensure optional columns exist
#     # ----------------------------------
#     optional_columns = [
#         "product_name",
#         "category",
#         "sales_channel",
#         "state",
#         "city"
#     ]

#     for col in optional_columns:
#         if col not in df.columns:
#             df[col] = None

#     # ----------------------------------
#     # 3️⃣ Drop rows without order_id
#     # ----------------------------------
#     df = df.dropna(subset=["order_id"])

#     # ----------------------------------
#     # 4️⃣ Deduplication inside file only
#     # ----------------------------------
#     before_duplicates = len(df)
#     df = df.drop_duplicates(subset=["order_id"])
#     duplicates_removed = before_duplicates - len(df)

#     # ----------------------------------
#     # 5️⃣ Clean numeric/date fields
#     # ----------------------------------
#     df["unit_price"] = df["unit_price"].apply(clean_amount)
#     df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")
#     df["order_date"] = df["order_date"].apply(clean_sale_date)

#     if "total_amount" in df.columns:
#         df["total_amount"] = pd.to_numeric(df["total_amount"], errors="coerce")
#     else:
#         df["total_amount"] = None

#     # ----------------------------------
#     # 6️⃣ Recovery Logic (UNCHANGED)
#     # ----------------------------------
#     def recover_numeric(row):
#         qty = row["quantity"]
#         price = row["unit_price"]
#         total = row["total_amount"]

#         if pd.isna(qty) and pd.notna(price) and pd.notna(total) and price > 0:
#             row["quantity"] = total / price

#         if pd.isna(price) and pd.notna(qty) and pd.notna(total) and qty > 0:
#             row["unit_price"] = total / qty

#         if pd.notna(row["quantity"]) and pd.notna(row["unit_price"]):
#             row["total_amount"] = row["quantity"] * row["unit_price"]

#         return row

#     df = df.apply(recover_numeric, axis=1)

#     # ----------------------------------
#     # 7️⃣ String fields → "Unknown"
#     # ----------------------------------
#     string_columns = [
#         "payment_mode",
#         "product_name",
#         "category",
#         "sales_channel",
#         "state",
#         "city"
#     ]

#     for col in string_columns:
#         if col in df.columns:
#             df[col] = df[col].fillna("Unknown")
#             df[col] = df[col].replace("", "Unknown")

#     # ----------------------------------
#     # 8️⃣ Validation (UNCHANGED)
#     # ----------------------------------
#     before_invalid = len(df)

#     df["quantity"] = pd.to_numeric(df["quantity"], errors="coerce")
#     df["unit_price"] = pd.to_numeric(df["unit_price"], errors="coerce")

#     df = df[~(
#         df["quantity"].isna() &
#         df["unit_price"].isna()
#     )]

#     df = df[df["quantity"].notna()]
#     df = df[df["unit_price"].notna()]
#     df = df[df["quantity"] > 0]
#     df = df[df["unit_price"] > 0]

#     df = df[df["order_date"].notna()]
#     df = df[df["product_id"].notna()]
#     df = df[df["order_date"] <= datetime.utcnow()]

#     invalid_rows_removed = before_invalid - len(df)

#     stats = {
#         "rows_before": rows_before,
#         "rows_after": len(df),
#         "duplicates_removed": duplicates_removed,
#         "invalid_rows_removed": invalid_rows_removed
#     }

#     return df, stats


# # =====================================================
# # PHASE 3️⃣ – STORE INTO DB (FIXED DUPLICATION)
# # =====================================================

# def clean_and_store_sales_data(
#     file_path,
#     company_id,
#     uploaded_file_id,
#     column_mapping
# ):
#     try:
#         cleaned_df, stats = clean_sales_csv(
#             file_path=file_path,
#             column_mapping=column_mapping
#         )

#         cleaned_df = cleaned_df.where(pd.notna(cleaned_df), None)

#         inserted = 0

#         for _, row in cleaned_df.iterrows():
#             try:
#                 sale = SalesData(
#                     order_id=str(row["order_id"]),
#                     order_date=row["order_date"],
#                     product_id=str(row["product_id"]),
#                     quantity=int(row["quantity"]),
#                     unit_price=float(row["unit_price"]),
#                     total_amount=float(row["total_amount"]),
#                     payment_mode=row["payment_mode"],
#                     product_name=row.get("product_name"),
#                     category=row.get("category"),
#                     sales_channel=row.get("sales_channel"),
#                     state=row.get("state"),
#                     city=row.get("city"),
#                     company_id=company_id,
#                     file_id=uploaded_file_id
#                 )

#                 db.session.add(sale)
#                 db.session.commit()
#                 inserted += 1

#             except IntegrityError:
#                 db.session.rollback()
#                 continue  # Skip duplicate silently

#         stats["new_rows_inserted"] = inserted

#         return {
#             "message": "CSV cleaned & stored successfully",
#             "stats": stats
#         }, 201

#     except Exception as e:
#         db.session.rollback()
#         return {"error": str(e)}, 500
