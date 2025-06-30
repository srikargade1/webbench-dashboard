import React, { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import TaskExplorer from "./components/TaskExplorer";
import ChartPanel from "./components/ChartPanel";
import StatsPanel from "./components/StatsPanel";
import "./styles/main.css";
import { useUpload } from "./contexts/UploadContext";

export default function App() {
  const [tab, setTab] = useState("upload");
  const { uploadSuccess } = useUpload();

  const handleTabClick = (targetTab) => {
    if (!uploadSuccess && targetTab !== "upload") return;
    setTab(targetTab);
  };

  return (
    <div className="webbench-container">
      <header className="header">
        <h1>WebBench Companion</h1>
        <div className="subheader">Dashboard & Analysis Tool</div>
      </header>

      <nav className="tabs">
        {["upload", "explorer", "charts", "stats"].map((t) => (
          <button
            key={t}
            className={`tab ${tab === t ? "active" : ""} ${
              !uploadSuccess && t !== "upload" ? "disabled-tab" : ""
            }`}
            onClick={() => handleTabClick(t)}
          >
            {t === "upload"
              ? "Upload Data"
              : t === "explorer"
              ? "Task Explorer"
              : t === "charts"
              ? "Charts"
              : "Stats"}
          </button>
        ))}
      </nav>

      {tab === "upload" && <UploadPanel />}
      {tab === "explorer" && <TaskExplorer />}
      {tab === "charts" && <ChartPanel />}
      {tab === "stats" && <StatsPanel />}
    </div>
  );
}
