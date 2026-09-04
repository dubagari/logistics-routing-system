import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAppSelector } from "../redux/hooks";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Deliveries from "../pages/deliveries/Deliveries";
import AdminLayout from "../layouts/AdminLayout";
import Drivers from "../pages/drivers/Drivers";
import Customers from "../pages/customers/Customers";
import Tracking from "../pages/Tracking/Tracking";
import DeliveryDetails from "../pages/deliveries/DeliveryDetails";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/deliveries" element={<Deliveries />} />

          <Route path="/deliveries/:id" element={<DeliveryDetails />} />

          <Route path="/drivers" element={<Drivers />} />

          <Route path="/customers" element={<Customers />} />

          <Route path="/tracking" element={<Tracking />} />

          <Route path="/profile" element={<div>Profile</div>} />


        </Route>

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;