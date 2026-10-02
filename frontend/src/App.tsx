import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "./pages/Landing";



import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";
import SetupLayout from "./layouts/SetupLayout";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import OperationalDashboard from "./pages/admin/OperationalDashboard";
import Company from "./pages/admin/Company";
import Employees from "./pages/admin/Employees";
import Reports from "./pages/admin/Reports";
import Desks from "./pages/admin/Desks";
import SecurityDashboard from "./pages/security/SecurityDashboard";
import GiveCard from "./pages/security/GiveCard";
import CreateTicket from "./pages/security/CreateTicket";
import ReturnCard from "./pages/security/ReturnCard";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";

import DeskDashboard from "./pages/desk/DeskDashboard";

import PublicDisplay from "./pages/display/PublicDisplay";
import DeskDisplay from "./pages/desk-display/DeskDisplay";


import CompanySetup from "./setup/companySetup";
import BuildingSetup from "./setup/BuildingSetup";
import DepartmentSetup from "./setup/DepartmentSetup";
import ServiceSetup from "./setup/ServiceSetup";
import FlowSetup from "./setup/FlowSetup";

import Cards from "./pages/admin/cards";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


         <Route
          path="/register"
          element={<Register />}
        />

       <Route
         path="/verify-email/:token"
          element={<VerifyEmail />}
       />

       <Route
         path="/forgot-password"
          element={<ForgotPassword />}
       />

       <Route
         path="/reset-password/:token"
          element={<ResetPassword />}
       />

       {/* ================= COMPANY SETUP ================= */}
{/* ================= COMPANY SETUP ================= */}

<Route
  path="/setup"
  element={
    <ProtectedRoute roles={["ADMIN"]}>
      <SetupLayout />
    </ProtectedRoute>
  }
>
  {/* /setup */}
  <Route
    index
    element={<CompanySetup />}
  />

  {/* /setup/company */}
  <Route
    path="company"
    element={<CompanySetup />}
  />

  {/* /setup/buildings */}
  <Route
    path="buildings"
    element={<BuildingSetup />}
  />

  {/* /setup/departments */}
  <Route
    path="departments"
    element={<DepartmentSetup />}
  />

  {/* /setup/services */}
  <Route
    path="services"
    element={<ServiceSetup />}
  />

  {/* /setup/flow */}
  <Route
    path="flow"
    element={<FlowSetup />}
  />


  

</Route>
        

        

        

       

        {/* ================= ADMIN ================= */}

        <Route
  path="/admin"
  element={
    <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
      <AdminLayout />
    </ProtectedRoute>
  }
>

  <Route
    index
    element={<OperationalDashboard />}
  />

  <Route
  path="cards"
  element={
    <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
      <Cards />
    </ProtectedRoute>
  }
/>

  <Route
    path="dashboard"
    element={<Dashboard />}
  />

  <Route
    path="company"
    element={<Company />}
  />

  <Route
    path="employees"
    element={<Employees />}
  />

  <Route
    path="desks"
    element={<Desks />}
  />

  <Route
    path="reports"
    element={<Reports />}
  />

  <Route
    path="setup"
    element={<SetupLayout />}
  />

</Route>



        {/* ================= SECURITY ================= */}

        <Route
          path="/security"
          element={
            <ProtectedRoute roles={["SECURITY", "ADMIN"]}>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<SecurityDashboard />}
          />

          <Route
            path="give-card"
            element={<GiveCard />}
          />

          <Route
            path="create-ticket"
            element={<CreateTicket />}
          />

          <Route
            path="return-card"
            element={<ReturnCard />}
          />

        </Route>

        



       {/* ================= EMPLOYEE DESK ================= */}

<Route
  path="/desk"
  element={
    <ProtectedRoute roles={["EMPLOYEE", "ADMIN"]}>
      <EmployeeLayout />
    </ProtectedRoute>
  }
>
  <Route
    index
    element={<DeskDashboard />}
  />
</Route>


{/* ================= EMPLOYEE DESK DISPLAY ================= */}

<Route
  path="/desk-display"
  element={
    <ProtectedRoute roles={["EMPLOYEE", "ADMIN"]}>
      <EmployeeLayout />
    </ProtectedRoute>
  }
>
  <Route
    index
    element={<DeskDisplay />}
  />
</Route>


{/* ================= PUBLIC DISPLAY ================= */}

<Route
  path="/display/:companyId"
  element={<PublicDisplay />}
/>



        {/* ================= PUBLIC DISPLAY ================= */}

        <Route
          path="/display/:companyId"
          element={<PublicDisplay />}
        />

      </Routes>

    </BrowserRouter>

  );

}