import GiveCard from "./GiveCard";
import ReturnCard from "./ReturnCard";
import CreateTicket from "./CreateTicket";
import "../../styles/SecurityDashboard.css";

export default function SecurityDashboard() {
  return (
    <div className="security-dashboard">

      {/* HEADER */}
      <header className="security-header">

        <div className="security-header-content">

          <div>
            <span className="security-eyebrow">
              SECURITY OPERATIONS
            </span>

            <h1>
              Security Dashboard
            </h1>

            <p>
              Manage customer cards, create queue tickets,
              and process returned cards.
            </p>
          </div>

          <div className="security-status">
            <span className="security-status-dot" />
            <div>
              <strong>Security Desk</strong>
              <span>Operational</span>
            </div>
          </div>

        </div>

      </header>


      {/* QUICK OVERVIEW */}
      <section className="security-overview">

        <div className="security-stat-card">

          <div className="security-stat-icon blue">
            CARD
          </div>

          <div>
            <span>Card Management</span>
            <strong>Issue & Return</strong>
          </div>

        </div>


        <div className="security-stat-card">

          <div className="security-stat-icon purple">
            TKT
          </div>

          <div>
            <span>Queue Management</span>
            <strong>Create Tickets</strong>
          </div>

        </div>


        <div className="security-stat-card">

          <div className="security-stat-icon green">
            LIVE
          </div>

          <div>
            <span>Security Desk</span>
            <strong>Operational</strong>
          </div>

        </div>

      </section>


      {/* MAIN OPERATIONS */}
      <main className="security-content">

        {/* GIVE CARD */}
        <section className="security-panel">

          <div className="security-panel-header">

            <div>
              <span className="security-section-label">
                CARD MANAGEMENT
              </span>

              <h2>
                Issue Card
              </h2>

              <p>
                Give an available queue card to a customer.
              </p>
            </div>

            <div className="panel-number">
              01
            </div>

          </div>

          <div className="security-panel-body">
            <GiveCard />
          </div>

        </section>


        {/* CREATE TICKET */}
        <section className="security-panel">

          <div className="security-panel-header">

            <div>
              <span className="security-section-label">
                QUEUE MANAGEMENT
              </span>

              <h2>
                Create Customer Ticket
              </h2>

              <p>
                Assign a service and place a customer into
                the waiting queue.
              </p>
            </div>

            <div className="panel-number">
              02
            </div>

          </div>

          <div className="security-panel-body">
            <CreateTicket />
          </div>

        </section>


        {/* RETURN CARD */}
        <section className="security-panel">

          <div className="security-panel-header">

            <div>
              <span className="security-section-label">
                CARD RETURN
              </span>

              <h2>
                Return Card
              </h2>

              <p>
                Process cards returned by customers after
                completing their visit.
              </p>
            </div>

            <div className="panel-number">
              03
            </div>

          </div>

          <div className="security-panel-body">
            <ReturnCard />
          </div>

        </section>

      </main>

    </div>
  );
}