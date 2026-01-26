import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { apiRequest, API_PATHS } from "../../utils/api";

const IncomeChart = () => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncome = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const data = await apiRequest(
          `${API_PATHS.INCOME}?month=${month}&year=${year}`
        );
        setIncome(Array.isArray(data) ? data : []);
      } catch (error) {
        // Don't log 401 errors - they're handled by apiRequest
        if (!error.message?.includes("Not authorized")) {
          console.error("Error fetching income:", error);
        }
        setIncome([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Income Overview</h3>
        <div className="flex items-center justify-center h-[250px] text-gray-500">
          Loading income data...
        </div>
      </div>
    );
  }

  if (income.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Income Overview</h3>
        <div className="flex items-center justify-center h-[250px] text-gray-500">
          No income data for this month
        </div>
      </div>
    );
  }

  const chartData = income.map((item) => ({
    source: item.source || "Unknown",
    amount: item.amount || 0,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{payload[0].payload.source}</p>
          <p className="text-sm text-green-600">
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-4 text-lg">Income Overview</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="source"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="amount" fill="#22c55e" name="Amount (₹)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
