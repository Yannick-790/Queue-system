import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "../styles/layout.css";

export default function EmployeeLayout() {

  return (

    <div className="app-layout">

      <Sidebar />

      <div className="main-content">

        <Navbar />

        <main className="page-container">

          <Outlet />

        </main>

      </div>

    </div>

  );

}