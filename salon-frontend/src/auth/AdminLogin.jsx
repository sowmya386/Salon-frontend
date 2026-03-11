import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/auth.api";
import { setAuth } from "../utils/auth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Default salon name (sent automatically)
  const salonName = "Gl Salon";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Send email, password, and default salonName
      const res = await adminLogin({ email, password, salonName });

      // Store token + role
      setAuth(res.data.token, "ADMIN");

      // Redirect to admin dashboard
      navigate("/admin");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Optional: show salon name */}
        <div>
          <input
            type="text"
            value={salonName}
            readOnly
            style={{ backgroundColor: "#eee", border: "1px solid #ccc" }}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
