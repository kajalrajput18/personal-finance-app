const API_BASE = "http://localhost:5000/api";
export const API_PATHS = {
  EXPENSES: "/expenses",
  INCOME: "/income",
  BUDGET: "/budgets",
  DASHBOARD: "/dashboard",
  AI: "/ai",
};

export const apiRequest = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
    });

    if (!res.ok) {
      // Handle 401 Unauthorized - token expired or invalid
      if (res.status === 401) {
        localStorage.removeItem("token");
        // Only redirect if we're not already on login/signup page
        if (!window.location.pathname.includes("/login") && 
            !window.location.pathname.includes("/signup")) {
          window.location.href = "/login";
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Not authorized, no token");
      }

      // Handle 404 - endpoint not found
      if (res.status === 404) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Endpoint not found: ${url}`);
      }

      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Don't log errors for /auth/me if token doesn't exist (expected behavior)
    if (!url.includes("/auth/me") || error.message !== "Not authorized, no token") {
      console.error("API request failed:", error);
    }
    throw error;
  }
};
