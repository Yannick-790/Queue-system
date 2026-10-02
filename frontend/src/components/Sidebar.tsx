import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Sidebar() {

  const { user } = useAuth();
  const location = useLocation();

  // =========================================================
  // ORGANIZATION SETUP STATUS
  // =========================================================

  const [setupCompleted, setSetupCompleted] =
    useState<boolean | null>(null);


  // =========================================================
  // CHECK SETUP STATUS
  // =========================================================

  useEffect(() => {

    async function loadSetupStatus() {

      try {

        // Only ADMIN and MANAGER use organization setup
        if (
          user?.role !== "ADMIN" &&
          user?.role !== "MANAGER"
        ) {
          return;
        }


        const response = await api.get(
          "/company/setup-status"
        );


        /*
         * Supports both possible backend response formats:
         *
         * {
         *   data: {
         *     setupCompleted: true
         *   }
         * }
         *
         * OR
         *
         * {
         *   setupCompleted: true
         * }
         */

        const completed =
          response.data?.data?.setupCompleted ??
          response.data?.setupCompleted ??
          false;


        setSetupCompleted(completed);


      } catch (error) {

        console.error(
          "Failed to load organization setup status:",
          error
        );


        /*
         * If the backend request fails,
         * don't show the organization as completed.
         */
        setSetupCompleted(false);

      }

    }


    if (user) {
      loadSetupStatus();
    }

  }, [user]);


  // =========================================================
  // AUTH CHECK
  // =========================================================

  if (!user) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-circle">Q</div>
        <h2>QueueFlow</h2>
      </div>

      <div className="sidebar-user">
        <h4>Loading user...</h4>
      </div>
    </aside>
  );
}


  // =========================================================
  // ACTIVE MENU
  // =========================================================

  function active(path: string) {

    return location.pathname === path
      ? "active"
      : "";

  }


  // =========================================================
  // SIDEBAR
  // =========================================================

  return (

    <aside className="sidebar">


      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="sidebar-logo">

        <div className="logo-circle">
          Q
        </div>

        <h2>
          QueueFlow
        </h2>

      </div>



      {/* =====================================================
          USER PROFILE
      ===================================================== */}

      <div className="sidebar-user">

        <h4>
          {user.name || "User"}
        </h4>

        <span>
          {user.role}
        </span>

      </div>



      {/* =====================================================
          MENU
      ===================================================== */}

      <h3>
        Menu
      </h3>


      <div className="sidebar-menu">


        {/* ===================================================
            ADMIN
        =================================================== */}

        {(user.role === "ADMIN" ||
          user.role === "MANAGER") && (

          <>


            {/* =================================================
                DASHBOARD
            ================================================= */}

            <Link
              className={active("/admin")}
              to="/admin"
            >
              📊 Dashboard
            </Link>



            {/* =================================================
                COMPANY
            ================================================= */}

            <Link
              className={active("/admin/company")}
              to="/admin/company"
            >
              🏢 Company
            </Link>



            {/* =================================================
                SETUP ORGANIZATION

                Status comes from:
                GET /company/setup-status
            ================================================= */}

            {setupCompleted === null ? (

              /*
               * Backend is still checking.
               * Keep the menu stable instead of showing
               * the wrong setup status.
               */

              <div className="sidebar-setup-loading">

                <span className="sidebar-spinner"></span>

                Checking setup...

              </div>

            ) : (

              <Link
                to="/setup"
                className={active("/setup")}
              >

                {setupCompleted
                  ? "✓ Organization Setup"
                  : "⚙️ Setup Organization"}

              </Link>

            )}



            {/* =================================================
                EMPLOYEES
            ================================================= */}

            <Link
              className={active("/admin/employees")}
              to="/admin/employees"
            >
              👥 Employees
            </Link>



            {/* =================================================
                DESKS
            ================================================= */}

            <Link
              className={active("/admin/desks")}
              to="/admin/desks"
            >
              🖥️ Desks
            </Link>


            {/* =================================================
    CARDS
================================================= */}

<Link
  className={active("/admin/cards")}
  to="/admin/cards"
>
  💳 Cards
</Link>



            {/* =================================================
                REPORTS
            ================================================= */}

            <Link
              className={active("/admin/reports")}
              to="/admin/reports"
            >
              📈 Reports
            </Link>


          </>

        )}



        {/* ===================================================
            SECURITY
        =================================================== */}

        {user.role === "SECURITY" && (

          <>


            {/* DASHBOARD */}

            <Link
              className={active("/security")}
              to="/security"
            >
              📊 Dashboard
            </Link>



            {/* GIVE CARD */}

            <Link
              className={active("/security/give-card")}
              to="/security/give-card"
            >
              🎫 Give Card
            </Link>



            {/* CREATE TICKET */}

            <Link
              className={active("/security/create-ticket")}
              to="/security/create-ticket"
            >
              📝 Create Ticket
            </Link>



            {/* RETURN CARD */}

            <Link
              className={active("/security/return-card")}
              to="/security/return-card"
            >
              🔄 Return Card
            </Link>


          </>

        )}



        {/* ===================================================
            EMPLOYEE
        =================================================== */}

        {user.role === "EMPLOYEE" && (

  <>

    {/* =================================================
        DESK DASHBOARD
    ================================================= */}

    <Link
      className={active("/desk")}
      to="/desk"
    >
      🖥️ Desk Dashboard
    </Link>


    {/* =================================================
        DESK DISPLAY
    ================================================= */}

    <Link
      className={active("/desk-display")}
      to="/desk-display"
    >
      📺 Desk Display
    </Link>

  </>

)}



        {/* ===================================================
            PUBLIC DISPLAY
        =================================================== */}

        <Link
          className={active(
            `/display/${user.companyId}`
          )}
          to={`/display/${user.companyId}`}
        >

          📺 Public Display

        </Link>



      </div>



      {/* =====================================================
          SMALL LOADING ANIMATION
      ===================================================== */}

      <div className="menu-loader">

        <span></span>
        <span></span>
        <span></span>

      </div>


    </aside>

  );

}