# processor.py
import pandas as pd

def clean_and_standardize(df):
    df.columns = [col.strip().lower() for col in df.columns]
    df["evaluation_result"] = df["evaluation_result"].str.strip().str.lower()
    df["result_flag"] = df["evaluation_result"].map({"success": 1, "failure": 0})
    return df

def compute_site_stats(df):
    stats = df.groupby("site")["evaluation_result"].value_counts().unstack(fill_value=0).reset_index()
    stats["total_tasks"] = stats.sum(axis=1, numeric_only=True)
    stats["success_rate"] = (stats.get("success", 0) / stats["total_tasks"] * 100).round(2)
    return stats.sort_values(by="success_rate", ascending=False)

def compute_category_stats(df):
    stats = df.groupby("category")["result_flag"].agg(["count", "sum"]).reset_index()
    stats["success_rate"] = (stats["sum"] / stats["count"] * 100).round(2)
    return stats.rename(columns={"count": "total_tasks", "sum": "num_successes"})

def compute_difficulty_stats(df):
    stats = df.groupby("difficulty")["result_flag"].agg(["count", "sum"]).reset_index()
    stats["success_rate"] = (stats["sum"] / stats["count"] * 100).round(2)
    return stats.rename(columns={"count": "total_tasks", "sum": "num_successes"})

def compute_fail_reasons(df):
    return df[df["result_flag"] == 0]["evaluation_reason"].value_counts().head(10).reset_index().rename(columns={"index": "reason", "evaluation_reason": "count"})

def compute_site_category_matrix(df):
    matrix = df.groupby(["site", "category"])["result_flag"].agg(["count", "sum"]).reset_index()
    matrix["success_rate"] = (matrix["sum"] / matrix["count"] * 100).round(2)
    return matrix.rename(columns={"count": "total_tasks", "sum": "num_successes"}).sort_values(by="success_rate", ascending=False)

def compute_category_difficulty_matrix(df):
    matrix = df.groupby(["category", "difficulty"])["result_flag"].agg(["count", "sum"]).reset_index()
    matrix["success_rate"] = (matrix["sum"] / matrix["count"] * 100).round(2)
    return matrix.rename(columns={"count": "total_tasks", "sum": "num_successes"})

def compute_top_failed_sites(df):
    stats = compute_site_stats(df)
    stats["failures"] = stats.get("failure", 0)
    return stats.sort_values(by="failures", ascending=False).head(10)

def compute_most_failed_categories(df):
    stats = df.groupby("category")["result_flag"].agg(["count", "sum"]).reset_index()
    stats["failures"] = stats["count"] - stats["sum"]
    stats["failure_rate"] = (stats["failures"] / stats["count"] * 100).round(2)
    return stats.sort_values(by="failure_rate", ascending=False)

def compute_most_failed_difficulties(df):
    stats = df.groupby("difficulty")["result_flag"].agg(["count", "sum"]).reset_index()
    stats["failures"] = stats["count"] - stats["sum"]
    stats["failure_rate"] = (stats["failures"] / stats["count"] * 100).round(2)
    return stats.sort_values(by="failure_rate", ascending=False)

def compute_top_failures_by_category(df):
    fail_patterns = (
        df[df["result_flag"] == 0]
        .groupby(["category", "evaluation_reason"])
        .size()
        .reset_index(name="count")
        .sort_values(by=["category", "count"], ascending=[True, False])
    )
    return fail_patterns.groupby("category").head(5).reset_index(drop=True)

def compute_meta_lists(df):
    return {
        "site": sorted(df["site"].dropna().unique().tolist()),
        "category": sorted(df["category"].dropna().unique().tolist()),
        "difficulty": sorted(df["difficulty"].dropna().unique().tolist()),
        "evaluation_result": sorted(df["evaluation_result"].dropna().unique().tolist())
    }

