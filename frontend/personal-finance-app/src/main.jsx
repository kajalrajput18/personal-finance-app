import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import  AuthProvider  from "./context/AuthContext";
import  BudgetProvider  from "./context/BudgetContext";
import ExpensesProvider from "./context/ExpenseContext";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BudgetProvider>
          <ExpensesProvider>
          <App />
          </ExpensesProvider>
        </BudgetProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
