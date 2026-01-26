import React, { useEffect, useState } from "react";
import { apiRequest, API_PATHS } from "../../utils/api";
import useBudget from "../../hooks/useBudget";

const Budget = () => {
  const { fetchBudgets } = useBudget();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: "",
    limit: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Fetch budgets
  const loadBudgets = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(
        `${API_PATHS.BUDGET}?month=${currentMonth}&year=${currentYear}`
      );
      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  // Add or update budget
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category || !form.limit) {
      alert("Please fill in category and limit");
      return;
    }

    try {
      await apiRequest(API_PATHS.BUDGET, {
        method: "POST",
        body: JSON.stringify({
          category: form.category,
          limit: Number(form.limit),
          month: Number(form.month),
          year: Number(form.year),
        }),
      });

      setForm({
        category: "",
        limit: "",
        month: currentMonth,
        year: currentYear,
      });
      loadBudgets();
      // Refresh context
      if (fetchBudgets) {
        fetchBudgets(currentMonth, currentYear);
      }
    } catch (error) {
      console.error("Error setting budget:", error);
      alert("Failed to set budget. Please try again.");
    }
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 90) return "text-orange-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Budget Management</h1>

      {/* Add/Update Budget */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Category *"
            className="border p-2 rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            placeholder="Budget Limit (₹) *"
            type="number"
            step="0.01"
            className="border p-2 rounded"
            value={form.limit}
            onChange={(e) => setForm({ ...form, limit: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Month"
            min="1"
            max="12"
            className="border p-2 rounded"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
          />
          <input
            type="number"
            placeholder="Year"
            min="2020"
            max="2100"
            className="border p-2 rounded"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
        >
          Set Budget
        </button>
      </form>

      {/* Budget List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No budgets set for this month
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="font-semibold text-lg">
              Budgets for {new Date(currentYear, currentMonth - 1).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>
          <ul className="divide-y">
            {budgets.map((budget) => (
              <li
                key={budget.category}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-lg">{budget.category}</p>
                      <span
                        className={`font-semibold ${getPercentageColor(
                          budget.percentageUsed || 0
                        )}`}
                      >
                        {budget.percentageUsed || 0}% Used
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Budget Limit</p>
                        <p className="font-semibold">₹{budget.limit?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Spent</p>
                        <p className="font-semibold text-red-600">
                          ₹{budget.spent?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Remaining</p>
                        <p
                          className={`font-semibold ${
                            (budget.remaining || 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ₹{budget.remaining?.toLocaleString() || 0}
                        </p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (budget.percentageUsed || 0) >= 100
                              ? "bg-red-600"
                              : (budget.percentageUsed || 0) >= 90
                              ? "bg-orange-600"
                              : (budget.percentageUsed || 0) >= 70
                              ? "bg-yellow-600"
                              : "bg-green-600"
                          }`}
                          style={{
                            width: `${Math.min(budget.percentageUsed || 0, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Budget;
