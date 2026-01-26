import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import useBudget from "../../hooks/useBudget";

const BudgetChart = () => {
  const { budgets, loading } = useBudget();

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Budget Summary</h3>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          Loading budget data...
        </div>
      </div>
    );
  }

  if (!budgets || budgets.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Budget Summary</h3>
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No budget set for this month
        </div>
      </div>
    );
  }

  const chartData = budgets.map((budget) => ({
    category: budget.category,
    limit: budget.limit || 0,
    spent: budget.spent || 0,
    remaining: Math.max(0, (budget.limit || 0) - (budget.spent || 0)),
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-4 text-lg">Budget Summary by Category</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="category"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip
            formatter={(value, name) => [
              `₹${value.toLocaleString()}`,
              name === "limit"
                ? "Budget Limit"
                : name === "spent"
                ? "Spent"
                : "Remaining",
            ]}
          />
          <Legend />
          <Bar dataKey="limit" fill="#3b82f6" name="Budget Limit" />
          <Bar dataKey="spent" fill="#ef4444" name="Spent" />
          <Bar dataKey="remaining" fill="#22c55e" name="Remaining" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;
