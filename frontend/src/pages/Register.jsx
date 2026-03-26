import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      await registerUser(form);

      setVariant("success");
      setMsg("Registered Successfully ✅ Now Login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
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
        <div className="auth-title">Register</div>
        <div className="auth-subtitle">
          Create account to get recommendations 🎥✨
        </div>

        {msg && <Alert variant={variant}>{msg}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="auth-label">Name</Form.Label>
            <Form.Control
              className="auth-input"
              type="text"
              placeholder="Enter name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

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
            {loading ? "Registering..." : "Register"}
          </Button>

          <div className="auth-footer">
            Already have account?{" "}
            <span className="auth-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </div>
        </Form>
      </Card>
    </div>
  );
}


