import { useEffect, useState } from "react";
import api from "../../services/api";

import "../../styles/operational-dashboard.css";

import StatCard from "../../components/StatCard";

import EmployeeStatusPanel from "../../components/EmployeeStatusPanel";
import CardStatusPanel from "../../components/CardStatusPanel";
import DeskStatusPanel from "../../components/DeskStatusPanel";
import ActivityPanel from "../../components/ActivityPanel";
import NotificationPanel from "../../components/NotificationPanel";

import DashboardLoader from "../../components/dashboard/DashboardLoader";

interface Company {
  id: string;
  name: string;
  industry?: string;
  routingMode?: string;
}

export default function OperationalDashboard() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    loadCompany();

    const clock = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(clock);
  }, []);

  async function loadCompany() {
    try {
      const res = await api.get("/company");

      setCompany(res.data.data || res.data);
    } catch (error) {
      console.error("Failed to load company:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <div className="admin-dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="dashboard-header">

        <div className="dashboard-brand">

          <h1>
            {company?.name || "Organization"}
          </h1>

          <p>
            {company?.industry || "Customer Flow Management"}
          </p>

        </div>

        <div className="admin-badge">
          ADMIN
        </div>

        <div className="dashboard-clock">

          <strong>
            {time.toLocaleTimeString()}
          </strong>

          <span>
            {time.toLocaleDateString()}
          </span>

        </div>

      </section>


      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <section className="company-panel system-ready">

        <div className="system-status-icon">
          ✓
        </div>

        <div>

          <h2>
            System Ready
          </h2>

          <p>
            Queue engine is running.
            Employees can serve customers.
          </p>

        </div>

      </section>


      {/* =====================================================
          MAIN KPI CARDS
      ===================================================== */}

      <section className="dashboard-grid">

        <StatCard
          title="Waiting Customers"
          value="0"
          icon="⏳"
        />

        <StatCard
          title="Serving Now"
          value="0"
          icon="▶"
        />

        <StatCard
          title="Completed Today"
          value="0"
          icon="✓"
        />

        <StatCard
          title="Employees Online"
          value="0"
          icon="👥"
        />

      </section>


      {/* =====================================================
          CARD / DESK KPI CARDS
      ===================================================== */}

      <section className="dashboard-grid">

        <StatCard
          title="Available Cards"
          value="0"
          icon="💳"
        />

        <StatCard
          title="Return Pending"
          value="0"
          icon="↩"
        />

        <StatCard
          title="Active Desks"
          value="0"
          icon="🖥"
        />

        <StatCard
          title="Lost Cards"
          value="0"
          icon="⚠"
        />

      </section>


      {/* =====================================================
          LIVE QUEUE
      ===================================================== */}

      <section className="dashboard-panel live-queue-panel">

        <div className="panel-header">

          <div>

            <h2>
              Live Queue
            </h2>

            <p>
              Real-time customer queue overview
            </p>

          </div>

          <span className="live-indicator">
            LIVE
          </span>

        </div>


        <div className="queue-status">

          <div className="queue-stat">

            <span>
              Routing Mode
            </span>

            <strong>
              {company?.routingMode || "-"}
            </strong>

          </div>


          <div className="queue-stat">

            <span>
              Customers Waiting
            </span>

            <strong>
              0
            </strong>

          </div>


          <div className="queue-stat">

            <span>
              Average Waiting
            </span>

            <strong>
              0 minutes
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          EMPLOYEE STATUS
      ===================================================== */}

      <section className="dashboard-section">

        <EmployeeStatusPanel />

      </section>


      {/* =====================================================
          CARD STATUS
      ===================================================== */}

      <section className="dashboard-section">

        <CardStatusPanel />

      </section>


      {/* =====================================================
          DESK STATUS
      ===================================================== */}

      <section className="dashboard-section">

        <DeskStatusPanel />

      </section>


      {/* =====================================================
          ACTIVITY + NOTIFICATIONS
      ===================================================== */}

      <section className="dashboard-grid dashboard-bottom-grid">

        <ActivityPanel />

        <NotificationPanel />

      </section>

    </div>
  );
}