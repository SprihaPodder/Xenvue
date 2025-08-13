import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://10.67.2.205:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Signup successful! Redirecting to login...");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setMessage(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      setMessage("Network error – Is the backend running?");
    }
    setLoading(false);
  };

  // Colors depending on theme
  const pageBg = isDark ? "linear-gradient(135deg, #04070cff, #161b74ff)" : "linear-gradient(135deg, #dbeafe, #fef9c3)";
  const textColor = isDark ? "#e0e7ff" : "#1e293b";
  const cardBg = isDark ? "#1e293b" : "#fff";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pageBg,
        color: textColor,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        flexDirection: "column"
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
            color: isDark ? "#0f172a" : "white",
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

      {/* Main content area with two columns */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          gap: 56,
          maxWidth: 1200,
          margin: "0 auto",
          boxSizing: "border-box",
          minHeight: 0
        }}
      >
        {/* Left side: Large logo card */}
        <div
          style={{
          width: 320,
          height: 320,
          background: cardBg,
          borderRadius: 32,
          boxShadow: isDark
            ? "0 10px 32px #facc1520"
            : "0 10px 32px #94a3b825",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 0,
          flexDirection: "column",
          padding: "24px",
          boxSizing: "border-box",
          textAlign: "center",
        }}
        >
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: 900,
            color: isDark ? "#facc15" : "#2563eb",
            letterSpacing: "-0.07em",
            margin: 0,
          }}>
            Xenvue
          </h1>
          <p style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            color: isDark ? "#e0e7ff" : "#64748b",
            marginTop: "12px",
            maxWidth: "280px",
          }}>
           Turning datasets into compelling narratives.
          </p>
        </div>


        {/* Right side: Signup form card */}
        <div
          style={{
            flex: 1,
            maxWidth: 480,
            background: cardBg,
            borderRadius: 18,
            padding: "48px 36px",
            boxShadow: isDark
              ? "0 8px 24px #facc1510"
              : "0 8px 24px rgba(0,0,0,0.08)",
            boxSizing: "border-box"
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: isDark ? "#facc15" : "#2563eb",
              marginBottom: 24,
              textAlign: "center",
              letterSpacing: "-0.04em"
            }}
          >
            Create an Account
          </h2>
          {message && (
            <p
              style={{
                color: message.startsWith("✅") ? "#38d39f" : "#f43f5e",
                marginBottom: 16,
                textAlign: "center",
                fontWeight: 600
              }}
            >
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit} autoComplete="off">
            <label style={labelStyle}>
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle(isDark)}
                autoComplete="off"
              />
            </label>
            <label style={labelStyle}>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle(isDark)}
                autoComplete="off"
              />
            </label>
            <label style={labelStyle}>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle(isDark)}
                autoComplete="new-password"
              />
            </label>
            <label style={labelStyle}>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={inputStyle(isDark)}
                autoComplete="off"
              />
            </label>
            <button type="submit" disabled={loading} style={buttonStyle(isDark, loading)}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <p
            style={{
              marginTop: 20,
              textAlign: "center",
              color: isDark ? "#cbd5e1" : "#475569"
            }}
          >
            Already have an account?{" "}
            <span
              style={{ color: isDark ? "#facc15" : "#2563eb", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 14,
  fontWeight: 600,
  fontSize: 15
};

const inputStyle = (isDark: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "12px",
  marginTop: 7,
  marginBottom: 14,
  borderRadius: 6,
  border: `1.6px solid ${isDark ? "#475569" : "#d1d5db"}`,
  outline: "none",
  backgroundColor: isDark ? "#334155" : "white",
  color: isDark ? "#e2e7ff" : "black",
  fontSize: 16,
  boxSizing: "border-box",
  transition: "border-color 0.3s"
});

const buttonStyle = (isDark: boolean, loading: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "14px 0",
  backgroundColor: loading
    ? (isDark ? "#a16207" : "#60a5fa")
    : (isDark ? "#facc15" : "#2563eb"),
  color: loading
    ? (isDark ? "#fbbf24" : "#dbeafe")
    : (isDark ? "#1e293b" : "white"),
  fontWeight: 700,
  fontSize: "1.07rem",
  borderRadius: 8,
  border: "none",
  cursor: loading ? "not-allowed" : "pointer",
  marginTop: 4,
  marginBottom: 2,
  boxShadow: isDark
    ? "0 4px 14px #facc1540"
    : "0 4px 14px #2563eb25"
});

export default SignupPage;


