import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import PoolsPage from "../features/pools/PoolsPage";
import WorksPage from "../features/works/WorksPage";
import UsersPage from "../features/users/UsersPage";
import NotFoundPage from "../pages/NotFoundPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/work" element={<WorksPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["boss"]} />}>
          <Route element={<MainLayout />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/pools" element={<PoolsPage />} />
            <Route path="/work" element={<WorksPage />} />
          </Route>
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
