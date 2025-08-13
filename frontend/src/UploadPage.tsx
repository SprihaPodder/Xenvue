import React, { useRef, useState } from "react";

interface UploadPageProps {
  onReportReady: (reportId: string) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onReportReady }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Handle file drop (drag-and-drop)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError("");
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Click to trigger file input
  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  // Handle input file change (browse)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError("");
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a CSV or Excel file.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://10.67.2.205:5000/api/generate-report", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.reportId) {
        onReportReady(data.reportId);
      } else {
        setError(data.error || "Report creation failed");
      }
    } catch {
      setError("Network error — is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 75% 30%, #dbeafe 0, #fef9c3 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "18px",
          boxShadow: "0 8px 32px rgba(44,78,145,0.13)",
          padding: "40px",
          width: "100%",
          maxWidth: 480,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#2563eb",
            marginBottom: "8px",
            letterSpacing: "-1px",
          }}
        >
          Upload Data
        </h2>
        <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "1.07em" }}>
          Upload a <strong>CSV</strong> or <strong>Excel</strong> file to generate a beautiful contextual report.
        </p>

        {/* Drag and Drop Upload Box */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          style={{
            border: dragActive
              ? "2.5px solid #2563eb"
              : "2px dashed #93c5fd",
            borderRadius: "12px",
            padding: "36px 0 32px 0",
            background: dragActive ? "#eff6ff" : "#f8fafc",
            color: "#2563eb",
            fontWeight: 500,
            fontSize: "1.15em",
            cursor: "pointer",
            marginBottom: 18,
            transition: "all 0.18s",
            outline: "none",
            position: "relative",
            boxShadow: dragActive
              ? "0 4px 18px 0 rgba(37,99,235,.10)"
              : "none",
          }}
        >
          {file ? (
            <div>
              <span role="img" aria-label="file" style={{ fontSize: 32 }}>
                📄
              </span>
              <div style={{ marginTop: 8, color: "#334155" }}>
                {file.name}
              </div>
              <span style={{ color: "#94a3b8", fontSize: 12 }}>Click to change file</span>
            </div>
          ) : (
            <div style={{ opacity: dragActive ? 0.8 : 1 }}>
              <svg
                width="42" height="42" viewBox="0 0 56 56"
                style={{ marginBottom: 8, color: "#2563eb" }}
              >
                <rect width="56" height="56" rx="14" fill="#dbeafe" />
                <path
                  d="M28 13v22M28 13l-8 8M28 13l8 8"
                  stroke="#2563eb"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                Drag &amp; drop your data file here<br />
                or <span style={{ textDecoration: "underline" }}>click to browse</span>
              </span>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            style={{ display: "none" }}
            onChange={handleFileChange}
            tabIndex={-1}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          style={{
            marginTop: 12,
            width: "100%",
            padding: "14px 0",
            background: "#2563eb",
            color: "white",
            fontSize: "1.08em",
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            boxShadow: "0 2px 8px 0 #bae6fd66",
            cursor: loading || !file ? "not-allowed" : "pointer",
            opacity: loading || !file ? 0.71 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {loading ? (
            <span>
              <span className="animated-dots">Generating</span>
              <span style={{ fontSize: 18, marginLeft: 5 }}>⏳</span>
            </span>
          ) : "Generate Report"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 18, fontSize: "1em" }}>{error}</p>
        )}

        <p style={{ marginTop: 18, color: "#64748b", fontSize: "0.97em" }}>
          Accepted formats: <b>.csv, .xlsx, .xls</b>
        </p>
      </div>
    </div>
  );
};

export default UploadPage;


