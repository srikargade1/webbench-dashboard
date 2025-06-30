import React, { useState } from "react";
import FileUpload from "./FileUpload";
import "../styles/UploadPanel.css";
import { useUpload } from "../contexts/UploadContext"; // 👈

export default function UploadPanel() {
  const [taskCount, setTaskCount] = useState(null);
  const { setUploadSuccess } = useUpload(); // 👈

  return (
    <div className="upload-panel">
      <div className="upload-card">
        <div className="upload-dropzone">
          <div className="upload-icon">☁️</div>
          <h3>Upload WebBench Results</h3>
          <p>Drag and drop your CSV file here, or click to browse</p>
          <FileUpload
            onUploadSuccess={(count) => {
              setUploadSuccess(true);
              setTaskCount(count);
            }}
          />
        </div>

        {taskCount !== null && (
          <div className="upload-success-banner">
            <p className="upload-success-title">✅ File uploaded successfully!</p>
            <p className="upload-success-subtitle">
              {taskCount.toLocaleString()} tasks loaded • Ready for analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
