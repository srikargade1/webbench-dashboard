import React, { useState, useEffect } from "react";
import "../styles/TaskTable.css";

export default function TaskTable() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ site: "", category: "", difficulty: "", evaluation_result: "" });
  const [meta, setMeta] = useState({ site: [], category: [], difficulty: [], evaluation_result: [] });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const tasksPerPage = 100;

  useEffect(() => {
    fetch("http://localhost:5000/meta")
      .then(res => res.json())
      .then(setMeta)
      .catch(err => console.error("Meta load failed", err));
  }, []);

  useEffect(() => {
    const query = Object.entries(filters)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v.toLowerCase())}`)
      .join("&");

    fetch(`http://localhost:5000/tasks${query ? `?${query}` : ""}`)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setCurrentPage(1); // reset on filter change
      })
      .catch(() => setError("Error loading tasks."));
  }, [filters]);

  const startIdx = (currentPage - 1) * tasksPerPage;
  const endIdx = startIdx + tasksPerPage;
  const paginatedTasks = tasks.slice(startIdx, endIdx);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <div className="task-table-wrapper">
      <div className="task-filters">
        {Object.keys(filters).map((key) => (
          <select
            key={key}
            value={filters[key]}
            onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
          >
            <option value="">{key.charAt(0).toUpperCase() + key.slice(1)}</option>
            {meta[key].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        ))}
      </div>

      <div className="task-summary">
        <div className="metric">Total Tasks: {tasks.length}</div>
        <div className="metric success">Showing: {paginatedTasks.length}</div>
      </div>

      {error && <div className="error">{error}</div>}

      <table className="task-table">
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Site</th>
            <th>Category</th>
            <th>Difficulty</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTasks.map(task => (
            <tr key={task.task_id} onClick={() => setSelectedTask(task)} style={{ cursor: "pointer" }}>
              <td>{task.task_id}</td>
              <td>{task.site}</td>
              <td><span className="badge badge-category">{task.category}</span></td>
              <td>
                <span className={`badge ${task.difficulty === "easy" ? "badge-easy" : "badge-hard"}`}>{task.difficulty}</span>
              </td>
              <td>
                <span className={`badge ${task.evaluation_result === "success" ? "badge-success" : "badge-failure"}`}>{task.evaluation_result}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={page === currentPage ? "active" : ""}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {selectedTask && (
        <div className="task-details-panel styled">
          <div className="panel-header">
            <h3>Task Details</h3>
            <button onClick={() => setSelectedTask(null)} className="close-btn">×</button>
          </div>
          <div className="panel-body">
            {Object.entries(selectedTask).map(([key, value]) => (
              <div className="detail-row" key={key}>
                <span className="detail-key">{key}:</span>
                <span className="detail-value">{typeof value === "object" ? JSON.stringify(value, null, 2) : value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
