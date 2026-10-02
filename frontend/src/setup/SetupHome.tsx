import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/setup.css";

interface SetupStatus {
  setupCompleted: boolean;
  company: boolean;
  buildings: number;
  departments: number;
  services: number;
}

export default function SetupHome() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SetupStatus | null>(null);

  useEffect(() => {
    loadSetupStatus();
  }, []);

  async function loadSetupStatus() {
    try {
      setLoading(true);

      const response = await api.get("/company/setup-status");

      const data =
        response.data?.data ??
        response.data;

      setStatus({
        setupCompleted:
          data?.setupCompleted === true,

        company:
          data?.company === true,

        buildings:
          data?.buildings ?? 0,

        departments:
          data?.departments ?? 0,

        services:
          data?.services ?? 0,
      });
    } catch (error) {
      console.error(
        "Failed to load setup status:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="setup-status-loading">
        <div className="setup-spinner"></div>

        <p>
          Checking organization setup...
        </p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="setup-status-page">
        <div className="setup-status-card">
          <h1>
            Organization Setup
          </h1>

          <p>
            We could not load your organization setup.
          </p>

          <button
            className="primary-btn"
            onClick={loadSetupStatus}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!status.setupCompleted) {
    return (
      <div className="setup-status-page">
        <div className="setup-status-card">

          <div className="setup-status-icon incomplete">
            ⚙️
          </div>

          <h1>
            Organization Setup
          </h1>

          <p className="setup-status-description">
            Your organization has not finished setup yet.
            Complete the remaining steps before using
            QueueFlow.
          </p>

          <div className="setup-progress-list">

            <div className="setup-progress-item">
              <span>
                {status.company ? "✓" : "○"}
              </span>

              <div>
                <strong>
                  Company
                </strong>

                <small>
                  Company information
                </small>
              </div>
            </div>

            <div className="setup-progress-item">
              <span>
                {status.buildings > 0
                  ? "✓"
                  : "○"}
              </span>

              <div>
                <strong>
                  Buildings
                </strong>

                <small>
                  {status.buildings} configured
                </small>
              </div>
            </div>

            <div className="setup-progress-item">
              <span>
                {status.departments > 0
                  ? "✓"
                  : "○"}
              </span>

              <div>
                <strong>
                  Departments
                </strong>

                <small>
                  {status.departments} configured
                </small>
              </div>
            </div>

            <div className="setup-progress-item">
              <span>
                {status.services > 0
                  ? "✓"
                  : "○"}
              </span>

              <div>
                <strong>
                  Services
                </strong>

                <small>
                  {status.services} configured
                </small>
              </div>
            </div>

            <div className="setup-progress-item">
              <span>
                ○
              </span>

              <div>
                <strong>
                  Queue Flow
                </strong>

                <small>
                  Complete flow configuration
                </small>
              </div>
            </div>

          </div>

          <div className="setup-status-actions">

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/setup/company")
              }
            >
              Continue Setup
            </button>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="setup-status-page">

      <div className="setup-status-card completed">

        <div className="setup-status-icon complete">
          ✓
        </div>

        <h1>
          Organization Setup Complete
        </h1>

        <p className="setup-status-description">
          Your organization is fully configured and
          ready to use QueueFlow.
        </p>

        <div className="setup-ready-banner">
          <span className="ready-dot"></span>

          <div>
            <strong>
              System Ready
            </strong>

            <p>
              Your company, departments, services and
              queue flow have been configured.
            </p>
          </div>
        </div>

        <div className="setup-summary">

          <div className="setup-summary-item">
            <span className="summary-icon">
              ✓
            </span>

            <div>
              <strong>
                Company
              </strong>

              <small>
                Configured
              </small>
            </div>
          </div>

          <div className="setup-summary-item">
            <span className="summary-icon">
              ✓
            </span>

            <div>
              <strong>
                Buildings
              </strong>

              <small>
                {status.buildings} configured
              </small>
            </div>
          </div>

          <div className="setup-summary-item">
            <span className="summary-icon">
              ✓
            </span>

            <div>
              <strong>
                Departments
              </strong>

              <small>
                {status.departments} configured
              </small>
            </div>
          </div>

          <div className="setup-summary-item">
            <span className="summary-icon">
              ✓
            </span>

            <div>
              <strong>
                Services
              </strong>

              <small>
                {status.services} configured
              </small>
            </div>
          </div>

          <div className="setup-summary-item">
            <span className="summary-icon">
              ✓
            </span>

            <div>
              <strong>
                Queue Flow
              </strong>

              <small>
                Configured
              </small>
            </div>
          </div>

        </div>

        <div className="setup-update-warning">
          <strong>
            Need to change something?
          </strong>

          <p>
            You can update your organization configuration.
            Existing data will remain in the system.
          </p>
        </div>

        <div className="setup-status-actions">

          <button
            className="secondary-btn"
            onClick={() =>
              navigate("/admin")
            }
          >
            Back to Dashboard
          </button>

          <button
            className="primary-btn"
            onClick={() =>
              navigate("/setup/company")
            }
          >
            Update Organization
          </button>

        </div>

      </div>

    </div>
  );
}