import { useEffect, useState } from "react";
import AnalyticsCard from "../../components/dashboard/AnalyticsCard";
import IncomeChart from "../../components/charts/IncomeChart";
import ExpenseChart from "../../components/charts/ExpenseChart";
import BudgetChart from "../../components/charts/BudgetChart";
import BudgetAlert from "../../components/alerts/BudgetAlert";
import { useExpenses } from "../../hooks/useExpenses";
import useBudget from "../../hooks/useBudget";
import { apiRequest, API_PATHS } from "../../utils/api";

const Home = () => {
  const { expenses, loading: expensesLoading } = useExpenses();
  const { budgets, loading: budgetsLoading } = useBudget();
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeLoading, setIncomeLoading] = useState(true);

  useEffect(() => {
    const fetchTotalIncome = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIncomeLoading(false);
        return;
      }

      try {
        setIncomeLoading(true);
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const incomeData = await apiRequest(
          `${API_PATHS.INCOME}?month=${month}&year=${year}`
        );
        const total = Array.isArray(incomeData)
          ? incomeData.reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
          : 0;
        setTotalIncome(total);
      } catch (error) {
        // Don't log 401 errors - they're handled by apiRequest
        if (!error.message?.includes("Not authorized")) {
          console.error("Error fetching income:", error);
        }
        setTotalIncome(0);
      } finally {
        setIncomeLoading(false);
      }
    };
    fetchTotalIncome();
  }, []);

  // Calculate totals safely
  const totalExpense = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalBudget = budgets.reduce((sum, b) => sum + (Number(b.limit) || 0), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (Number(b.spent) || 0), 0);
  const remaining = totalBudget - totalSpent;
  const savings = totalIncome - totalExpense;
  
  // Calculate budget utilization percentage
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const loading = expensesLoading || budgetsLoading || incomeLoading;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Income"
          value={`₹${totalIncome.toLocaleString()}`}
          icon="💰"
          color="green"
        />
        <AnalyticsCard
          title="Total Expense"
          value={`₹${totalExpense.toLocaleString()}`}
          icon="💸"
          color="red"
        />
        <AnalyticsCard
          title="Savings"
          value={`₹${savings.toLocaleString()}`}
          icon="💵"
          color={savings >= 0 ? "green" : "red"}
        />
        <AnalyticsCard
          title="Budget Remaining"
          value={`₹${remaining.toLocaleString()}`}
          icon="📊"
          color={remaining >= 0 ? "blue" : "red"}
          subtitle={totalBudget > 0 ? `${budgetUtilization.toFixed(1)}% used` : "No budget set"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseChart />
        <IncomeChart />
      </div>

      {/* Budget Summary */}
      <BudgetChart />

      {/* Alerts */}
      <BudgetAlert budgets={budgets} />
    </div>
  );
};

export default Home;
