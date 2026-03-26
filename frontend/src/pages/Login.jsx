import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [variant, setVariant] = useState("danger");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const data = await loginUser(form);

      localStorage.setItem("user", JSON.stringify(data.user));
      setVariant("success");
      setMsg("Login Successful ✅");

      // Trigger state update in App.js
      if (props.onLoginSuccess) props.onLoginSuccess();

      navigate("/home");
    } catch (err) {
      const backendMsg =
        err?.response?.data?.message || err?.message || "Server Error";

      setVariant("danger");
      setMsg(backendMsg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-title">Login</div>
        <div className="auth-subtitle">
          Prime Video Personalized Recommendation Engine 🎬
        </div>

        {msg && <Alert variant={variant}>{msg}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="auth-label">Email</Form.Label>
            <Form.Control
              className="auth-input"
              type="email"
              placeholder="Enter email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="auth-label">Password</Form.Label>
            <Form.Control
              className="auth-input"
              type="password"
              placeholder="Enter password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="auth-footer">
            New user?{" "}
            <span className="auth-link" onClick={() => navigate("/register")}>
              Register
            </span>
          </div>
        </Form>
      </Card>
    </div>
  );
}


