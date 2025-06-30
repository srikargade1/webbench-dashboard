# app.py
from flask import Flask, request, jsonify
import pandas as pd
from io import StringIO
from flask_cors import CORS

import cache
import processor

app = Flask(__name__)
CORS(app) 

@app.route("/upload", methods=["POST"])
def upload_csv():
    cache.df_cache = None
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    if not file.filename.endswith('.csv') or file.mimetype != "text/csv":
        return jsonify({"error": "Invalid file type. Please upload a CSV file."}), 400

    try:
        df = pd.read_csv(file)
        df = processor.clean_and_standardize(df)
        cache.df_cache = df
        return jsonify({"message": "CSV uploaded and processed", "count": len(df)})
    except Exception as e:
        return jsonify({"error": f"Failed to process file: {str(e)}"}), 500


@app.route("/tasks")
def get_tasks():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400

    result = df.copy()
    for key in ["site", "category", "difficulty", "evaluation_result"]:
        value = request.args.get(key)
        if value:
            value = value.strip().lower()
            result = result[result[key].astype(str).str.lower() == value.lower()]

    return jsonify(result.where(pd.notnull(result), None).to_dict(orient="records"))


@app.route("/task/<task_id>")
def get_task(task_id):
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400

    row = df[df["task_id"] == task_id]
    if row.empty:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(row.iloc[0].to_dict())

@app.route("/stats/site")
def stats_site():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_site_stats(df).to_dict(orient="records"))

@app.route("/stats/category")
def stats_category():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_category_stats(df).to_dict(orient="records"))

@app.route("/stats/difficulty")
def stats_difficulty():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_difficulty_stats(df).to_dict(orient="records"))

@app.route("/stats/failures")
def stats_failures():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_fail_reasons(df).to_dict(orient="records"))

@app.route("/stats/site-category")
def stats_site_category():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_site_category_matrix(df).to_dict(orient="records"))

@app.route("/stats/category-difficulty")
def stats_category_difficulty():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_category_difficulty_matrix(df).to_dict(orient="records"))

@app.route("/stats/failed-sites")
def stats_failed_sites():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_top_failed_sites(df).to_dict(orient="records"))

@app.route("/stats/most-failed-categories")
def stats_failed_categories():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_most_failed_categories(df).to_dict(orient="records"))

@app.route("/stats/most-failed-difficulties")
def stats_failed_difficulties():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_most_failed_difficulties(df).to_dict(orient="records"))

@app.route("/stats/top-failures-by-category")
def stats_top_failures_by_category():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_top_failures_by_category(df).to_dict(orient="records"))

@app.route("/meta")
def get_meta():
    df = cache.df_cache
    if df is None:
        return jsonify({"error": "No CSV uploaded yet"}), 400
    return jsonify(processor.compute_meta_lists(df))

if __name__ == "__main__":
    app.run(debug=True)
