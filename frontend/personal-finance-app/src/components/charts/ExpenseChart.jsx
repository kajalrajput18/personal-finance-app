import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useExpenses } from "../../hooks/useExpenses";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

const ExpenseChart = () => {
  const { expenses, loading } = useExpenses();

  // group expenses by category
  const data = Object.values(
    expenses.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = {
          name: curr.category,
          value: 0,
        };
      }
      acc[curr.category].value += Number(curr.amount) || 0;
      return acc;
    }, {})
  );

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Expense by Category</h3>
        <div className="flex items-center justify-center h-[250px] text-gray-500">
          Loading expenses...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Expense by Category</h3>
        <div className="flex items-center justify-center h-[250px] text-gray-500">
          No expenses yet
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-4 text-lg">Expense by Category</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={(entry) => `${entry.name}: ₹${entry.value.toLocaleString()}`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
