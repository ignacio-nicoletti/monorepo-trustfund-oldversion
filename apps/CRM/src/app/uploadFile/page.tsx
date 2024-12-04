// pages/upload-test.js
"use client";
import { useState } from "react";

export default function UploadTest() {
  const [folderUrl, setFolderUrl] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [warrantorName, setWarrantorName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!folderUrl || !file) {
      alert("Please fill in the folder URL and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("folderUrl", folderUrl);
    formData.append("documentType", documentType);
    formData.append("warrantorName", warrantorName);
    formData.append("folderName", folderName);
    formData.append("file", file);

    try {
      const res = await fetch("/api/uploadToDrive", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setResponse(result);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      //@ts-ignore
      setResponse({ error: "Error uploading file" });
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "lavenderblush" }}>
      <h1>Upload to Google Drive</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
        }}
      >
        <label>
          Folder URL:
          <input
            type="text"
            value={folderUrl}
            onChange={(e) => setFolderUrl(e.target.value)}
            required
          />
        </label>
        <label>
          Document Type:
          <input
            type="text"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          />
        </label>
        <label>
          Warrantor Name (no se manda si se carga doc de garantia):
          <input
            type="text"
            value={warrantorName}
            onChange={(e) => setWarrantorName(e.target.value)}
          />
        </label>
        <label>
          Folder Name (siempre nombre del solicitante):
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </label>
        <label>
          File:
          <input
            type="file"
            // @ts-ignore 
            onChange={(e) => setFile(e?.target?.files[0])}
            required
          />
        </label>
        <button type="submit" style={{ backgroundColor: "red" }}>
          Upload File
        </button>
      </form>
      {response && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
