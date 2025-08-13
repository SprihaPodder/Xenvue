import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface ReportPageProps {
  reportId: string;
}

interface Limitation {
  type: string;
  description: string;
}

const ReportPage: React.FC<ReportPageProps> = ({ reportId }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false); 

  useEffect(() => {
    axios
      .get(`http://44.229.227.142:5000/api/report/${reportId}`)
      .then((res) => setData(res.data))
      .catch(() =>
        setError("Loading report failed. (Invalid reportId or backend issue)")
      );
  }, [reportId]);

  if (error) return <div style={{ marginTop: 80, textAlign: "center", color: "red" }}>{error}</div>;
  if (!data) return <div style={{ marginTop: 80, textAlign: "center" }}>Loading report...</div>;

  const trendsData =
    data.trends?.labels?.map((label: string, idx: number) => ({
      label,
      value: data.trends.values[idx],
    })) || [];

  const demographicData =
    data.demographics?.labels?.map((label: string, idx: number) => ({
      label,
      value: data.demographics.values[idx],
    })) || [];

  const demographicColors = [
    "#2563eb", "#f59e42", "#10b981", "#a21caf", "#f43f5e", "#eab308"
  ];

  // Base styles depending on theme
  const pageBg = isDark ? "#1e293b" : "#f9fafb";
  const pageText = isDark ? "white" : "black";
  const cardBg = isDark ? "#334155" : "#ffffff";

  const sectionStyle: React.CSSProperties = {
    backgroundColor: cardBg,
    color: pageText,
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "24px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const headingStyle: React.CSSProperties = {
    borderBottom: `3px solid ${isDark ? "#93c5fd" : "#3b82f6"}`,
    paddingBottom: "6px",
    marginBottom: "16px",
    color: isDark ? "#93c5fd" : "#1e40af",
    fontWeight: "700",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  // Header button handlers
  const handleLogout = () => {
    navigate("/");
  };

  const handleDepartmentReports = () => {
    navigate("/department-reports");
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <div style={{ background: pageBg, minHeight: "100vh", color: pageText }}>
      {/* Header Bar */}
      <div style={{
        background: "#2563eb",
        color: "white",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: 700,
        fontSize: "1.2rem",
      }}>
        <div>Xenvue</div>
        <div>
          <button
            onClick={toggleTheme}
            style={{
              marginRight: 12,
              padding: "8px 16px",
              fontWeight: 600,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              backgroundColor: isDark ? "#070601ff" : "#0f172a",
              color: isDark ? "black" : "white",
            }}
          >
            {isDark ? "☀️" : "☾"}
          </button>
          <button
            onClick={handleDepartmentReports}
            style={{
              marginRight: 12,
              padding: "8px 16px",
              fontWeight: 600,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              backgroundColor: "white",
              color: "#2563eb",
            }}
          >
            Department Specific Reports
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              fontWeight: 600,
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              backgroundColor: "#f43f5e",
              color: "white",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Report content */}
      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 16px" }}>
        <h1 style={{ textAlign: "center", color: isDark ? "#93c5fd" : "#2563eb", marginBottom: "32px", fontWeight: "800" }}>
          Contextual Report Generated
        </h1>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Executive Summary</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.executive_summary || "No data."}
          </ReactMarkdown>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Data Limitations</h2>
          <ul style={{ paddingLeft: "20px", marginBottom: "12px" }}>
            {(data.limitations || []).map((lim: Limitation, idx: number) => (
              <li key={idx}>
                <strong>{lim.type}:</strong> {lim.description}
              </li>
            ))}
          </ul>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.limitationsNarrative || "No narrative."}
          </ReactMarkdown>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Bias Risks</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.bias_risks || "No data."}
          </ReactMarkdown>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Community Concerns</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.community_concerns || "No data."}
          </ReactMarkdown>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Statistical Methods</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.statistical_methods || "No data."}
          </ReactMarkdown>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Trends Visualization</h2>
          {trendsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#e2e8f0" : "#ccc"} />
                <XAxis dataKey="label" stroke={pageText} />
                <YAxis stroke={pageText} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No trends data.</p>
          )}
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Demographics Visualization</h2>
          {demographicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographicData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.label} (${entry.value})`}
                >
                  {demographicData.map((_: any, idx: number) => (
                    <Cell key={idx} fill={demographicColors[idx % demographicColors.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No demographics data.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReportPage;

