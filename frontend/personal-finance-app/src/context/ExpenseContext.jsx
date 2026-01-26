import { createContext, useState, useEffect } from "react";
import { apiRequest, API_PATHS } from "../utils/api";

export const ExpenseContext = createContext();

const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async (month, year) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setExpenses([]);
        setLoading(false);
        return;
      }
      const currentMonth = month || new Date().getMonth() + 1;
      const currentYear = year || new Date().getFullYear();
      const data = await apiRequest(
        `${API_PATHS.EXPENSES}?month=${currentMonth}&year=${currentYear}`
      );
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      // Don't log 401 errors - they're handled by apiRequest
      if (!error.message?.includes("Not authorized")) {
        console.error("Error fetching expenses:", error);
      }
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <ExpenseContext.Provider value={{ expenses, fetchExpenses, loading }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseProvider;