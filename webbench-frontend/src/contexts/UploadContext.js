// src/contexts/UploadContext.js
import React, { createContext, useContext, useState } from "react";

const UploadContext = createContext();

export function UploadProvider({ children }) {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  return (
    <UploadContext.Provider value={{ uploadSuccess, setUploadSuccess }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUpload() {
  return useContext(UploadContext);
}
