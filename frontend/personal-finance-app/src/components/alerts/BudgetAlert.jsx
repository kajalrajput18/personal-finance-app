const BudgetAlert = ({ budgets }) => {
  if (!budgets || budgets.length === 0) return null;

  const exceededBudgets = budgets.filter((budget) => budget.alert === true);
  const warningBudgets = budgets.filter(
    (budget) =>
      !budget.alert &&
      budget.percentageUsed >= 70 &&
      budget.percentageUsed < 100
  );

  if (exceededBudgets.length === 0 && warningBudgets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {exceededBudgets.length > 0 && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <div>
              <p className="font-semibold">Budget Limit Exceeded!</p>
              <ul className="mt-1 text-sm list-disc list-inside">
                {exceededBudgets.map((budget) => (
                  <li key={budget.category}>
                    {budget.category}: Spent ₹{budget.spent?.toLocaleString()}{" "}
                    of ₹{budget.limit?.toLocaleString()} (
                    {budget.percentageUsed}% used)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {warningBudgets.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <div className="flex items-center">
            <span className="text-xl mr-2">⚡</span>
            <div>
              <p className="font-semibold">Budget Warning</p>
              <ul className="mt-1 text-sm list-disc list-inside">
                {warningBudgets.map((budget) => (
                  <li key={budget.category}>
                    {budget.category}: {budget.percentageUsed}% used (₹
                    {budget.spent?.toLocaleString()} of ₹
                    {budget.limit?.toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetAlert;
