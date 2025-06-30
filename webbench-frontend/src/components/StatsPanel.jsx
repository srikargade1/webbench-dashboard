import React, { useEffect, useState } from "react";
import "../styles/TaskTable.css"; // reuse styles

function StatsPanel() {
  const [siteStats, setSiteStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [difficultyStats, setDifficultyStats] = useState([]);
  const [error, setError] = useState("");
  const [expandedSection, setExpandedSection] = useState("all");
  const [currentPage, setCurrentPage] = useState({ site: 1, category: 1, difficulty: 1 });
  const [sortConfig, setSortConfig] = useState({});
  const statsPerPage = 15;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const siteRes = await fetch("https://webbench-backend.onrender.com/stats/site");
        const categoryRes = await fetch("https://webbench-backend.onrender.com/stats/category");
        const difficultyRes = await fetch("https://webbench-backend.onrender.com/stats/difficulty");

        if (!siteRes.ok || !categoryRes.ok || !difficultyRes.ok) {
          throw new Error("Failed to fetch one or more stats.");
        }

        setSiteStats(await siteRes.json());
        setCategoryStats(await categoryRes.json());
        setDifficultyStats(await difficultyRes.json());
      } catch {
        setError("Failed to load stats. Make sure a CSV is uploaded.");
      }
    };

    fetchStats();
  }, []);

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const expandAll = () => setExpandedSection("all");
  const collapseAll = () => setExpandedSection(null);

  const handleSort = (sectionKey, columnKey) => {
    setSortConfig((prev) => {
      const direction =
        prev.sectionKey === sectionKey && prev.columnKey === columnKey && prev.direction === "asc"
          ? "desc"
          : "asc";
      return { sectionKey, columnKey, direction };
    });
  };

  const applySorting = (data, sectionKey) => {
    if (sortConfig.sectionKey !== sectionKey) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortConfig.columnKey];
      const valB = b[sortConfig.columnKey];
      return sortConfig.direction === "asc"
        ? valA - valB
        : valB - valA;
    });
  };

  const exportCSV = (data, filename) => {
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const renderTable = (title, data, keys, sectionKey) => {
    const sortedData = applySorting(data, sectionKey);
    const start = (currentPage[sectionKey] - 1) * statsPerPage;
    const pageData = sortedData.slice(start, start + statsPerPage);
    const totalPages = Math.ceil(data.length / statsPerPage);

    return (
      <div className="stats-table-wrapper">
        <div className="stats-table-header">
          <h3>{title}</h3>
          <button onClick={() => exportCSV(data, `${sectionKey}_stats.csv`)}>Export CSV</button>
        </div>
        <table className="task-table">
          <thead>
            <tr>
              {keys.map((k) => (
                <th key={k} onClick={() => handleSort(sectionKey, k)} style={{ cursor: "pointer" }}>
                  {k}{" "}
                  {sortConfig.sectionKey === sectionKey && sortConfig.columnKey === k
                    ? sortConfig.direction === "asc" ? "▲" : "▼"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr key={i}>
                {keys.map((k) => (
                  <td key={k}>
                    {k === "success_rate" ? (
                      <span className={`badge ${
                        row[k] >= 90 ? "badge-success"
                        : row[k] >= 50 ? "badge-warning"
                        : "badge-failure"
                      }`}>{row[k]}</span>
                    ) : row[k]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={page === currentPage[sectionKey] ? "active" : ""}
              onClick={() => setCurrentPage({ ...currentPage, [sectionKey]: page })}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="stats-panel">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="stats-controls">
        <button className="action-btn" onClick={expandAll}>Expand All</button>
        <button className="action-btn" onClick={collapseAll}>Collapse All</button>
      </div>


      <div className="stats-toggle">
        <button onClick={() => toggleSection("site")}>
          {expandedSection === "site" || expandedSection === "all" ? "Hide Site Stats ▲" : "Show Site Stats ▼"}
        </button>
        {(expandedSection === "site" || expandedSection === "all") &&
          renderTable("Site Stats", siteStats, ["site", "success", "failure", "total_tasks", "success_rate"], "site")}
      </div>

      <div className="stats-toggle">
        <button onClick={() => toggleSection("category")}>
          {expandedSection === "category" || expandedSection === "all" ? "Hide Category Stats ▲" : "Show Category Stats ▼"}
        </button>
        {(expandedSection === "category" || expandedSection === "all") &&
          renderTable("Category Stats", categoryStats, ["category", "num_successes", "total_tasks", "success_rate"], "category")}
      </div>

      <div className="stats-toggle">
        <button onClick={() => toggleSection("difficulty")}>
          {expandedSection === "difficulty" || expandedSection === "all" ? "Hide Difficulty Stats ▲" : "Show Difficulty Stats ▼"}
        </button>
        {(expandedSection === "difficulty" || expandedSection === "all") &&
          renderTable("Difficulty Stats", difficultyStats, ["difficulty", "num_successes", "total_tasks", "success_rate"], "difficulty")}
      </div>
    </div>
  );
}

export default StatsPanel;

