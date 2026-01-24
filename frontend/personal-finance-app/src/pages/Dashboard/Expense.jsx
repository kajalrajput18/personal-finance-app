import React, { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
  });

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  //  Fetch expenses
  const fetchExpenses = async () => {
    const data = await apiRequest(
      `/expenses?month=${month}&year=${year}`
    );
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  //  Add expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiRequest("/expenses", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
      }),
    });

    setForm({ title: "", amount: "", category: "" });
    fetchExpenses();
  };

  //  Delete expense
  const deleteExpense = async (id) => {
    await apiRequest(`/expenses/${id}`, {
      method: "DELETE",
    });
    fetchExpenses();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Expenses</h1>

      {/* Add Expense */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-6"
      >
        <input
          placeholder="Title"
          className="border p-2"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />
        <input
          placeholder="Amount"
          type="number"
          className="border p-2"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />
        <input
          placeholder="Category"
          className="border p-2"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />
        <button className="bg-blue-600 text-white px-4">
          Add
        </button>
      </form>

      {/* Expense List */}
      <ul className="space-y-2">
        {expenses.map((exp) => (
          <li
            key={exp._id}
            className="flex justify-between border p-3"
          >
            <div>
              <p className="font-medium">{exp.title}</p>
              <p className="text-sm text-gray-500">
                ₹{exp.amount} • {exp.category}
              </p>
            </div>

            <button
              onClick={() => deleteExpense(exp._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expense;
