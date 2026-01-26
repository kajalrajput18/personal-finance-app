import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
        window.location.reload(); // Refresh to load user context
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm mt-6 text-gray-600">
            New here?{" "}
            <span
              className="text-blue-600 cursor-pointer font-semibold hover:text-blue-800 transition"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
