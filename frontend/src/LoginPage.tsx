import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isDark, setIsDark] = useState(false); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://10.67.2.205:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Welcome ${data.name}! Redirecting...`);
        setTimeout(() => {
          navigate("/upload");
        }, 1000);
      } else {
        setMessage(data.error || "Login failed. Please try again.");
      }
    } catch {
      setMessage("Network error – Is the backend running?");
    }
    setLoading(false);
  };

  // Theme colors
  const pageBg = isDark ? "linear-gradient(135deg, #04070cff, #161b74ff)" : "linear-gradient(135deg, #dbeafe, #fef9c3)";
  const textColor = isDark ? "#e0e7ff" : "#1e293b";
  const cardBg = isDark ? "#1e293b" : "#fff";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pageBg,
        color: textColor,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      {/* Top-right theme toggle */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          padding: "26px 44px 0 0"
        }}
      >
        <button
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light Mode" : "Dark Mode"}
          onClick={() => setIsDark(d => !d)}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: isDark ? "#4c4c48ff" : "#0f172a",
            color: isDark ? "rgba(15, 23, 42, 1)" : "white",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: isDark ? "0 2px 8px #facc1550" : "0 2px 8px #2563eb25"
          }}
        >
          {isDark ? "☀️" : "☾"}
        </button>
      </div>

      {/* Centered login card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}
      >
        <div
          style={{
            background: cardBg,
            padding: "40px",
            borderRadius: "16px",
            boxShadow: isDark
              ? "0 8px 24px rgba(250, 204, 21, 0.08)"
              : "0 8px 24px rgba(0,0,0,0.08)",
            width: "100%",
            maxWidth: 420
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color: isDark ? "#facc15" : "#2563eb",
              marginBottom: "20px",
              textAlign: "center"
            }}
          >
            Login
          </h2>
          {message && (
            <p
              style={{
                color: message.startsWith("✅") ? "#38d39f" : "#f43f5e",
                marginBottom: 12,
                textAlign: "center",
                fontWeight: 600
              }}
            >
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", marginBottom: 8 }}>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle(isDark)}
              />
            </label>
            <label style={{ display: "block", marginBottom: 8 }}>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle(isDark)}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              style={buttonStyle(isDark, loading)}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p style={{ marginTop: 18, textAlign: "center", color: isDark ? "#cbd5e1" : textColor }}>
            Don't have an account?{" "}
            <span
              style={{
                color: isDark ? "#facc15" : "#2563eb",
                cursor: "pointer",
                textDecoration: "underline"
              }}
              onClick={() => navigate("/")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Theme-aware input
const inputStyle = (isDark: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "10px",
  marginTop: "4px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: `1px solid ${isDark ? "#475569" : "#d1d5db"}`,
  outline: "none",
  background: isDark ? "#334155" : "white",
  color: isDark ? "#e0e7ff" : "black"
});

// Theme-aware button
const buttonStyle = (isDark: boolean, loading: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "12px",
  background: loading
    ? (isDark ? "#a16207" : "#60a5fa")
    : (isDark ? "#facc15" : "#2563eb"),
  color: loading
    ? (isDark ? "#fbbf24" : "#dbeafe")
    : (isDark ? "#1e293b" : "white"),
  fontWeight: 600,
  border: "none",
  borderRadius: "8px",
  cursor: loading ? "not-allowed" : "pointer",
  marginTop: "12px"
});

export default LoginPage;



