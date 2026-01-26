import React, { useEffect, useState } from "react";
import { apiRequest, API_PATHS } from "../../utils/api";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    source: "",
    amount: "",
    category: "",
    date: "",
  });

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  //  Fetch income
  const fetchIncome = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(
        `${API_PATHS.INCOME}?month=${month}&year=${year}`
      );
      setIncomes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching income:", error);
      setIncomes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  //  Add income
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.source || !form.amount) {
      alert("Please fill in source and amount");
      return;
    }

    try {
      await apiRequest(API_PATHS.INCOME, {
        method: "POST",
        body: JSON.stringify({
          source: form.source,
          amount: Number(form.amount),
          category: form.category || "Other",
          date: form.date || new Date().toISOString().split("T")[0],
        }),
      });

      setForm({ source: "", amount: "", category: "", date: "" });
      fetchIncome();
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Failed to add income. Please try again.");
    }
  };

  //  Delete income
  const deleteIncome = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) {
      return;
    }

    try {
      await apiRequest(`${API_PATHS.INCOME}/${id}`, {
        method: "DELETE",
      });
      fetchIncome();
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Income</h1>

      {/* Add Income */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Source *"
            className="border p-2 rounded"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            required
          />

          <input
            placeholder="Amount *"
            type="number"
            step="0.01"
            className="border p-2 rounded"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          <input
            placeholder="Category"
            className="border p-2 rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input
            type="date"
            className="border p-2 rounded"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Add Income
        </button>
      </form>

      {/* Income List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : incomes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No income records for this month
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y">
            {incomes.map((inc) => (
              <li
                key={inc._id}
                className="flex justify-between items-center p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-lg">{inc.source}</p>
                  <p className="text-sm text-gray-500">
                    ₹{inc.amount?.toLocaleString()} • {inc.category || "Other"}
                    {inc.date && ` • ${new Date(inc.date).toLocaleDateString()}`}
                  </p>
                </div>

                <button
                  onClick={() => deleteIncome(inc._id)}
                  className="text-red-600 hover:text-red-800 px-4 py-2 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Income;
