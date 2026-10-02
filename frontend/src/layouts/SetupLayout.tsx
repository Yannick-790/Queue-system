import { Outlet, NavLink } from "react-router-dom";

export default function SetupLayout() {

  return (

    <div className="min-h-screen bg-gray-100">

      <header className="bg-white shadow">

        <div className="max-w-7xl mx-auto px-6 py-4">

          <h1 className="text-2xl font-bold">
            Queue Management System Setup
          </h1>

          <p className="text-gray-500">
            Complete these steps to finish configuring your company.
          </p>

        </div>

      </header>

      <div className="max-w-7xl mx-auto p-6">

        <div className="grid grid-cols-12 gap-6">

          <aside className="col-span-3 bg-white rounded-xl shadow p-5">

            <h2 className="font-semibold mb-4">
              Setup Steps
            </h2>

            <nav className="flex flex-col gap-3">

              <NavLink to="/setup/company">
                1. Company
              </NavLink>

              <NavLink to="/setup/buildings">
                2. Buildings
              </NavLink>

              <NavLink to="/setup/departments">
                3. Departments
              </NavLink>

              <NavLink to="/setup/services">
                4. Services
              </NavLink>

              <NavLink to="/setup/flow">
                5. Queue Flow
              </NavLink>

            </nav>

          </aside>

          <main className="col-span-9 bg-white rounded-xl shadow p-8">

            <Outlet />

          </main>

        </div>

      </div>

    </div>

  );

}