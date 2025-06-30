# 🧪 WebBench Companion

**WebBench Companion** is an interactive dashboard to visualize and analyze WebBench agent benchmark results. It helps debug, compare, and understand agent performance across websites, categories, and difficulty levels with filters and rich visualizations.

---

## 🚀 Features

- 📤 Upload WebBench CSV files
- 🧹 Automatic data normalization (result flags, column names)
- 🔍 Filter tasks by site, category, difficulty, or result
- 📊 Success/failure stats by site, category, and category × difficulty
- 📈 Chart.js visualizations (bar, pie, line)
- 🧮 Multi-agent comparative analysis (planned)
- 💾 Export cleaned task data and summary stats
- 🌐 Fully containerized with Docker + deployed on Render

---

## 📁 Expected CSV Format

All uploaded CSVs must have the following columns (in order):

```

ID, site, category, difficulty, task\_description, task\_id, task\_output, task\_link, evaluation\_result, evaluation\_reason, result\_flag

```

These are automatically processed and cleaned by the backend before visualizing.

---

## ⚙️ Tech Stack

| Layer    | Tech                                |
|----------|-------------------------------------|
| Frontend | React, Chart.js, Fetch API          |
| Backend  | Flask, Pandas, Flask-CORS           |
| DevOps   | Docker, Render, GitHub Actions      |
| Data     | WebBench CSV format (as above)      |

---

## 📦 Project Structure

```

webbench-dashboard/
├── webbench-frontend/        # React app
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── webbench-backend/         # Flask API
│   ├── app.py
│   ├── processor.py
│   ├── requirements.txt
│   └── Dockerfile
├── render.yaml               # Render deployment config
└── README.md

````

---

## 🧪 Local Development

### 1. Backend (Flask)
```bash
cd webbench-backend
pip install -r requirements.txt
python app.py
````

Runs at: `http://localhost:5000`

### 2. Frontend (React)

```bash
cd webbench-frontend
npm install
npm start
```

Runs at: `http://localhost:3000`

Make sure the frontend is sending requests to the correct backend URL (`http://localhost:5000` in dev).

---

## 🚀 Deployment on Render

This project uses a single `render.yaml` to deploy both frontend and backend as Docker services.

**Steps to deploy:**

1. Push code to a public GitHub repo
2. Go to [Render](https://render.com)
3. Create a new "Blueprint" and connect your repo
4. Render will auto-detect `render.yaml` and deploy:

   * **webbench-frontend** (React + NGINX)
   * **webbench-backend** (Flask API)

Ensure that CORS is enabled in the backend and both services are correctly linked.

---

## 📸 Screenshots

*(Add screenshots of the UI, charts, or filters here)*

---

## 📄 License

MIT License.

Inspired by [WebBench](https://webbench.dev). This is an independent visualization tool.

```

Let me know if you want me to also generate a `requirements.txt`, add badges, or prep a version for GitHub pages.
```