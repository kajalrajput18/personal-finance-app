import { createContext, useState, useEffect } from "react";
import { apiRequest, API_PATHS } from "../utils/api";

export const BudgetContext = createContext();

const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async (month, year) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setBudgets([]);
        setLoading(false);
        return;
      }
      const data = await apiRequest(
        `${API_PATHS.BUDGET}?month=${month}&year=${year}`
      );
      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      // Don't log 401 errors - they're handled by apiRequest
      if (!error.message?.includes("Not authorized")) {
        console.error("Error fetching budgets:", error);
      }
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    fetchBudgets(month, year);
  }, []);

  return (
    <BudgetContext.Provider value={{ budgets, setBudgets, fetchBudgets, loading }}>
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetProvider;
