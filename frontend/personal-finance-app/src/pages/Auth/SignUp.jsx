import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      // auto login after signup
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
        window.location.reload(); // Refresh to load user context
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Start managing your finances today</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password (min 6 characters)"
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-blue-500 focus:outline-none transition"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm mt-6 text-gray-600">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer font-semibold hover:text-blue-800 transition"
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
