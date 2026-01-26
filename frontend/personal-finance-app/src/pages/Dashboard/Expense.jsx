import React, { useEffect, useState } from "react";
import { apiRequest, API_PATHS } from "../../utils/api";
import { useExpenses } from "../../hooks/useExpenses";
import VoiceInput from "../../components/common/VoiceInput";

const Expense = () => {
  const { fetchExpenses } = useExpenses();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  //  Fetch expenses
  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(
        `${API_PATHS.EXPENSES}?month=${month}&year=${year}`
      );
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  //  Add expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount) {
      alert("Please fill in title and amount");
      return;
    }

    try {
      await apiRequest(API_PATHS.EXPENSES, {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          amount: Number(form.amount),
          category: form.category || "Other",
          date: form.date || new Date().toISOString().split("T")[0],
        }),
      });

      setForm({ title: "", amount: "", category: "", date: "" });
      loadExpenses();
      // Refresh context
      if (fetchExpenses) {
        fetchExpenses(month, year);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  //  Delete expense
  const deleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      await apiRequest(`${API_PATHS.EXPENSES}/${id}`, {
        method: "DELETE",
      });
      loadExpenses();
      // Refresh context
      if (fetchExpenses) {
        fetchExpenses(month, year);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };

  const handleVoiceSuccess = () => {
    loadExpenses();
    if (fetchExpenses) {
      fetchExpenses(month, year);
    }
    setShowVoiceInput(false);
  };

  const handleVoiceError = (error) => {
    alert(error || "Failed to add expense via voice");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <button
          onClick={() => setShowVoiceInput(!showVoiceInput)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
        >
          <span>🎤</span>
          <span>{showVoiceInput ? "Hide" : "Add via Voice"}</span>
        </button>
      </div>

      {/* Voice Input */}
      {showVoiceInput && (
        <div className="mb-6">
          <VoiceInput onSuccess={handleVoiceSuccess} onError={handleVoiceError} />
        </div>
      )}

      {/* Add Expense */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Title *"
            className="border p-2 rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
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
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Expense
        </button>
      </form>

      {/* Expense List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No expenses for this month
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y">
            {expenses.map((exp) => (
              <li
                key={exp._id}
                className="flex justify-between items-center p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-lg">{exp.title}</p>
                  <p className="text-sm text-gray-500">
                    ₹{exp.amount?.toLocaleString()} • {exp.category || "Other"}
                    {exp.date && ` • ${new Date(exp.date).toLocaleDateString()}`}
                  </p>
                </div>

                <button
                  onClick={() => deleteExpense(exp._id)}
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

export default Expense;
