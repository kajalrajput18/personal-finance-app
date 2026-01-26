import { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { apiRequest, API_PATHS } from "../utils/api";

const useBudget = () => {
  const { budgets, setBudgets, fetchBudgets, loading } = useContext(BudgetContext);

  // Fetch budget status (limit vs spent + alerts)
  const fetchBudgetStatus = async (month, year) => {
    const data = await apiRequest(
      `${API_PATHS.BUDGET}?month=${month}&year=${year}`
    );
    setBudgets(Array.isArray(data) ? data : []);
    return data;
  };

  // Set or update budget
  const setBudget = async (payload) => {
    return apiRequest(API_PATHS.BUDGET, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  return {
    budgets,
    fetchBudgetStatus,
    setBudget,
    fetchBudgets,
    loading,
  };
};

export default useBudget;
