import React from "react";
import TaskTable from "./TaskTable";
import "../styles/TaskExplorer.css";
import "../styles/TaskTable.css";

export default function TaskExplorer() {
  return (
    <div className="task-explorer-container">
      <h1 className="task-explorer-heading">Task Explorer</h1>
      <p className="task-explorer-subtitle">
        Filter and explore browser automation benchmark results across websites, categories, and outcomes.
      </p>
      <div className="task-explorer-card">
        <TaskTable />
      </div>
    </div>
  );
}
