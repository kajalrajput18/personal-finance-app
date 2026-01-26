import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import Budget from "./pages/Dashboard/Budget";
import Insights from "./pages/Dashboard/Insights";

import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={localStorage.getItem("token") ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/income"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Income />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/expense"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Expense />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Budget />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/insights"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Insights />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route
        path="/"
        element={
          localStorage.getItem("token") ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

export default App;
