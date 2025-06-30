import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import React, { useEffect, useState } from "react";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

function ChartPanel() {
  const [siteStats, setSiteStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [overallCounts, setOverallCounts] = useState({ success: 0, failure: 0 });
  const [matrixStats, setMatrixStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:5000/stats/site");
      const catRes = await fetch("http://localhost:5000/stats/category");
      const matrixRes = await fetch("http://localhost:5000/stats/category-difficulty");
      const tasksRes = await fetch("http://localhost:5000/tasks");

      const siteData = await res.json();
      const categoryData = await catRes.json();
      const matrixData = await matrixRes.json();
      const allTasks = await tasksRes.json();

      const counts = {
        success: allTasks.filter((t) => t.evaluation_result === "success").length,
        failure: allTasks.filter((t) => t.evaluation_result === "failure").length,
      };

      setSiteStats(siteData.slice(0, 10));
      setCategoryStats(categoryData);
      setMatrixStats(matrixData);
      setOverallCounts(counts);
    };

    fetchData();
  }, []);

  const difficulties = ["easy", "medium", "hard"];
  const categories = [...new Set(matrixStats.map((r) => r.category))];

  const datasets = difficulties.map((diff) => ({
    label: diff,
    data: categories.map((cat) => {
      const row = matrixStats.find((r) => r.category === cat && r.difficulty === diff);
      return row ? row.success_rate : 0;
    }),
    backgroundColor:
      diff === "easy"
        ? "rgba(75,192,192,0.6)"
        : diff === "medium"
        ? "rgba(255,205,86,0.6)"
        : "rgba(255,99,132,0.6)",
  }));

  const heatmapData = {
    labels: categories,
    datasets,
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <h3>Success Rate by Site (Top 10)</h3>
      <Bar data={{
        labels: siteStats.map((s) => s.site),
        datasets: [
          {
            label: "Success Rate (%)",
            data: siteStats.map((s) => s.success_rate),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      }} />

      <div style={{ width: "600px", height: "600px", marginBottom: "100px" }}>
            <h3>Overall Result Distribution</h3>
                <Pie
                    data={{
                    labels: ["Success", "Failure"],
                    datasets: [
                    {
                        label: "Results",
                        data: [overallCounts.success, overallCounts.failure],
                        backgroundColor: ["#36a2eb", "#ff6384"],
                    },
                    ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                        legend: { position: "bottom" },
                        },
                    }}
                />
    </div>


     <div style={{ width: "1200px", height: "600px", marginTop: "100px" }}>
  <h3>Success Rate by Category</h3>
  <Line
    data={{
      labels: categoryStats.map((c) => c.category),
      datasets: [
        {
          label: "Success Rate (%)",
          data: categoryStats.map((c) => c.success_rate),
          borderColor: "rgba(153, 102, 255, 0.8)",
          fill: false,
        },
      ],
    }}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    }}
  />
</div>


      <h3 style={{ marginTop: "100px" }}>Success Rate Heatmap (Category × Difficulty)</h3>
      <Bar data={heatmapData} options={{ indexAxis: "y" }} />
    </div>
  );
}

export default ChartPanel;
