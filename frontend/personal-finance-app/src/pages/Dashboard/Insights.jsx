import React, { useEffect, useState } from "react";
import { useExpenses } from "../../hooks/useExpenses";
import useBudget from "../../hooks/useBudget";
import ExpenseChart from "../../components/charts/ExpenseChart";
import IncomeChart from "../../components/charts/IncomeChart";
import BudgetChart from "../../components/charts/BudgetChart";
import BudgetAlert from "../../components/alerts/BudgetAlert";
import { apiRequest, API_PATHS } from "../../utils/api";

const Insights = () => {
  const { expenses, loading: expensesLoading, fetchExpenses } = useExpenses();
  const { budgets, loading: budgetsLoading, fetchBudgets } = useBudget();
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    const fetchAIInsights = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAiLoading(false);
        return;
      }

      try {
        setAiLoading(true);
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const data = await apiRequest(
          `${API_PATHS.AI}/budget-suggestions?month=${month}&year=${year}`
        );
        setAiInsights(data);
      } catch (error) {
        // Don't log 401 errors - they're handled by apiRequest
        if (!error.message?.includes("Not authorized")) {
          console.error("Error fetching AI insights:", error);
        }
      } finally {
        setAiLoading(false);
      }
    };

    fetchAIInsights();
  }, [expenses, budgets]);

  const loading = expensesLoading || budgetsLoading || aiLoading;

  if (loading && !aiInsights) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading AI insights...</div>
      </div>
    );
  }

  // Calculate insights - ensure expenses and budgets are arrays
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeBudgets = Array.isArray(budgets) ? budgets : [];
  
  const totalExpense = safeExpenses.reduce((sum, e) => sum + (Number(e?.amount) || 0), 0);
  const categoryExpenses = safeExpenses.reduce((acc, exp) => {
    if (!exp) return acc;
    const cat = exp.category || "Other";
    acc[cat] = (acc[cat] || 0) + (Number(exp.amount) || 0);
    return acc;
  }, {});

  const topCategory = Object.keys(categoryExpenses).length > 0
    ? Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1])[0]
    : null;

  const totalBudget = safeBudgets.reduce((sum, b) => sum + (Number(b?.limit) || 0), 0);
  const totalSpent = safeBudgets.reduce((sum, b) => sum + (Number(b?.spent) || 0), 0);
  const avgBudgetUsage =
    safeBudgets.length > 0
      ? safeBudgets.reduce((sum, b) => sum + (Number(b?.percentageUsed) || 0), 0) /
        safeBudgets.length
      : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI-Powered Financial Insights</h1>
        <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
          🤖 AI Powered
        </span>
      </div>

      {/* AI Spending Personality */}
      {aiInsights?.personality && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl shadow-lg border-2 border-purple-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎭</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">
                Your Spending Personality
              </h2>
              <p className="text-xl font-semibold text-purple-700 mb-2">
                {aiInsights.personality.type}
              </p>
              <p className="text-gray-700">{aiInsights.personality.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Budget Suggestions */}
      {aiInsights?.suggestions && aiInsights.suggestions.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>AI Budget Suggestions</span>
          </h2>
          <div className="space-y-3">
            {aiInsights.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  suggestion.type === "success"
                    ? "bg-green-50 border-green-500 text-green-800"
                    : suggestion.type === "warning"
                    ? "bg-yellow-50 border-yellow-500 text-yellow-800"
                    : "bg-blue-50 border-blue-500 text-blue-800"
                }`}
              >
                <p className="font-medium">{suggestion.message}</p>
              </div>
            ))}
          </div>

          {/* Budget Breakdown */}
          {aiInsights.recommended && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Recommended Needs</p>
                <p className="text-xl font-bold">
                  ₹{aiInsights.recommended.needs?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Actual: ₹{aiInsights.actual.needsSpent?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Recommended Wants</p>
                <p className="text-xl font-bold">
                  ₹{aiInsights.recommended.wants?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Actual: ₹{aiInsights.actual.wantsSpent?.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Savings Target</p>
                <p className="text-xl font-bold text-green-600">
                  ₹{aiInsights.recommended.savings?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Rate: {aiInsights.actual.savingsRate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Tips */}
      {aiInsights?.tips && aiInsights.tips.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>✨</span>
            <span>Personalized Tips</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.tips.map((tip, index) => (
              <div
                key={index}
                className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500"
              >
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500 mb-2">Top Spending Category</h3>
          <p className="text-2xl font-bold">
            {topCategory ? topCategory[0] : "N/A"}
          </p>
          {topCategory && (
            <p className="text-sm text-gray-600 mt-1">
              ₹{topCategory[1].toLocaleString()}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500 mb-2">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ₹{totalExpense.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {safeExpenses.length} transactions
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500 mb-2">Average Budget Usage</h3>
          <p className="text-2xl font-bold">
            {avgBudgetUsage.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {safeBudgets.length} categories tracked
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseChart />
        <IncomeChart />
      </div>

      {/* Budget Summary */}
      <BudgetChart />

      {/* Alerts */}
      <BudgetAlert budgets={safeBudgets} />

      {/* Category Breakdown */}
      {Object.keys(categoryExpenses).length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(categoryExpenses)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => {
                const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{category}</span>
                      <span className="text-gray-600">
                        ₹{amount.toLocaleString()} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
