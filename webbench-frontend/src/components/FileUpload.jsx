import React from "react";

export default function FileUpload({ onUploadSuccess }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        onUploadSuccess(result.count); // pass count to parent
      } else {
        alert(result.error || "Upload failed.");
      }
    } catch (err) {
      alert("Network error. Make sure Flask server is running.");
    }
  };

  return (
    <label className="upload-button">
      Choose File
      <input type="file" accept=".csv" onChange={handleFileChange} hidden />
    </label>
  );
}
