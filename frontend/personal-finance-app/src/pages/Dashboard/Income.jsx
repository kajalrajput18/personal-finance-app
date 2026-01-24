import React, { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [form, setForm] = useState({
    source: "",
    amount: "",
    category: "",
  });

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  //  Fetch income
  const fetchIncome = async () => {
   const data = await apiRequest(
      `/income?month=${month}&year=${year}`
    );
    setIncomes(data);
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  //  Add income
  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiRequest("/income", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        category: form.category,
      }),
    });

    setForm({ source: "", amount: "", category: "" });
    fetchIncome();
  };

  //  Delete income
  const deleteIncome = async (id) => {
    await apiRequest(`/income/${id}`, {
      method: "DELETE",
    });
    fetchIncome();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Income</h1>

      {/* Add Income */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mb-6"
      >
        <input
          placeholder="Source"
          className="border p-2"
          value={form.source}
          onChange={(e) =>
            setForm({ ...form, source: e.target.value })
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

        <button className="bg-green-600 text-white px-4">
          Add
        </button>
      </form>

      {/* Income List */}
      <ul className="space-y-2">
        {incomes.map((inc) => (
          <li
            key={inc._id}
            className="flex justify-between border p-3"
          >
            <div>
              <p className="font-medium">{inc.source}</p>
              <p className="text-sm text-gray-500">
                ₹{inc.amount} • {inc.category}
              </p>
            </div>

            <button
              onClick={() => deleteIncome(inc._id)}
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

export default Income;
