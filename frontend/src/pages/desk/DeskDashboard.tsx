import { useCallback, useEffect, useState } from "react";
import { QueueService } from "../../services/queue.service";
import { useAuth } from "../../context/AuthContext";
import "../../styles/DeskDashboard.css";

type QueueTicket = {
  ticketId: string;
  displayNumber: string;
  ticketNumber: string;
  cardNumber: string;
  priority: string;
  createdAt: string;
};

type CurrentCustomer = {
  sessionId: string;
  ticketId: string;
  displayNumber: string;
  ticketNumber: string;
  cardNumber: string;
  priority: string;
  status: string;
  startedAt: string;
};

type MyQueueResponse = {
  employee: {
    id: string;
    name: string;
    status: string;
  };
  desk: {
    id: string;
    name: string;
    status: string;
  };
  service: {
    id: string;
    name: string;
  };
  currentCustomer: CurrentCustomer | null;
  nextCustomer: QueueTicket | null;
  waitingCount: number;
  waitingQueue: QueueTicket[];
};

export default function DeskDashboard() {
  const { user } = useAuth();

  const [queue, setQueue] = useState<MyQueueResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // ============================================================
  // LOAD MY QUEUE
  // ============================================================

  const loadQueue = useCallback(async () => {
    try {
      setError("");

      const res = await QueueService.getMyQueue();

      setQueue(res.data.data);
    } catch (err: any) {
      console.error("Failed to load employee queue:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to load your queue."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // ============================================================
  // SERVICE TIMER
  // ============================================================

  useEffect(() => {
    if (!queue?.currentCustomer) {
      setElapsedSeconds(0);
      return;
    }

    const started = new Date(
      queue.currentCustomer.startedAt
    ).getTime();

    const updateTimer = () => {
      const now = Date.now();

      setElapsedSeconds(
        Math.max(
          0,
          Math.floor((now - started) / 1000)
        )
      );
    };

    updateTimer();

    const interval = window.setInterval(
      updateTimer,
      1000
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [queue?.currentCustomer]);

  // ============================================================
  // FORMAT TIMER
  // ============================================================

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  // ============================================================
  // CLEAR MESSAGES
  // ============================================================

  function clearMessages() {
    setError("");
    setMessage("");
  }

  // ============================================================
  // CALL NEXT
  // ============================================================

  async function callNext() {
    if (actionLoading) return;

    try {
      clearMessages();
      setActionLoading(true);

      await QueueService.callNext();

      setMessage("Next customer called.");

      await loadQueue();
    } catch (err: any) {
      console.error("Call next failed:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to call the next customer."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // ============================================================
  // COMPLETE
  // ============================================================

  async function completeService() {
    if (
      !queue?.currentCustomer ||
      actionLoading
    ) {
      return;
    }

    try {
      clearMessages();
      setActionLoading(true);

      await QueueService.complete(
        queue.currentCustomer.sessionId
      );

      setMessage("Customer service completed.");

      await loadQueue();
    } catch (err: any) {
      console.error("Complete failed:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to complete service."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // ============================================================
  // NO SHOW
  // ============================================================

  async function noShow() {
    if (
      !queue?.currentCustomer ||
      actionLoading
    ) {
      return;
    }

    try {
      clearMessages();
      setActionLoading(true);

      await QueueService.noShow(
        queue.currentCustomer.ticketId
      );

      setMessage("Customer marked as no-show.");

      await loadQueue();
    } catch (err: any) {
      console.error("No-show failed:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to mark customer as no-show."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // ============================================================
  // RECALL
  // ============================================================

  async function recall() {
    if (
      !queue?.currentCustomer ||
      actionLoading
    ) {
      return;
    }

    try {
      clearMessages();
      setActionLoading(true);

      await QueueService.recall();

      setMessage("Customer recalled.");

      await loadQueue();
    } catch (err: any) {
      console.error("Recall failed:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to recall customer."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // ============================================================
  // TRANSFER
  // ============================================================

  async function transfer() {
    if (
      !queue?.currentCustomer ||
      actionLoading
    ) {
      return;
    }

    const serviceId = window.prompt(
      "Enter destination service ID:"
    );

    if (!serviceId?.trim()) {
      return;
    }

    try {
      clearMessages();
      setActionLoading(true);

      await QueueService.transfer(
        queue.currentCustomer.ticketId,
        serviceId.trim()
      );

      setMessage("Customer transferred.");

      await loadQueue();
    } catch (err: any) {
      console.error("Transfer failed:", err);

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to transfer customer."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // ============================================================
  // DESK AVAILABLE
  // ============================================================

  async function setAvailable() {
    if (actionLoading) return;

    try {
      clearMessages();
      setActionLoading(true);

      await QueueService.setDeskAvailable();

      setMessage("Desk is now available.");

      await loadQueue();
    } catch (err: any) {
      console.error(
        "Set desk available failed:",
        err
      );

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to make desk available."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // ============================================================
  // DESK OFFLINE
  // ============================================================

  async function setOffline() {
    if (actionLoading) return;

    try {
      clearMessages();
      setActionLoading(true);

      await QueueService.setDeskOffline();

      setMessage("Desk is now offline.");

      await loadQueue();
    } catch (err: any) {
      console.error(
        "Set desk offline failed:",
        err
      );

      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Unable to take desk offline."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="desk-dashboard">
        <div className="desk-loading">
          Loading your desk...
        </div>
      </div>
    );
  }

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div className="desk-dashboard">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <header className="desk-dashboard-header">

        <div>
          <span className="desk-dashboard-label">
            EMPLOYEE DESK
          </span>

          <h1>Desk Dashboard</h1>

          <p>
            Manage your customers and service queue.
          </p>
        </div>

        <div className="desk-user">

          <strong>
            {queue?.employee.name ||
              user?.name ||
              "Employee"}
          </strong>

          <span>
            ● Online
          </span>

        </div>

      </header>

      {/* ======================================================
          MESSAGES
          ====================================================== */}

      {error && (
        <div className="desk-message desk-error">
          <strong>Error</strong>
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="desk-message desk-success">
          <strong>Success</strong>
          <span>{message}</span>
        </div>
      )}

      {/* ======================================================
          TOP STATUS
          ====================================================== */}

      <section className="desk-overview">

        <div className="desk-overview-card">

          <span className="overview-label">
            MY DESK
          </span>

          <strong>
            {queue?.desk.name || "Not assigned"}
          </strong>

          <span
            className={`desk-status status-${queue?.desk.status?.toLowerCase()}`}
          >
            ● {queue?.desk.status}
          </span>

        </div>

        <div className="desk-overview-card">

          <span className="overview-label">
            SERVICE
          </span>

          <strong>
            {queue?.service.name || "Not assigned"}
          </strong>

        </div>

        <div className="desk-overview-card">

          <span className="overview-label">
            WAITING
          </span>

          <strong className="waiting-number">
            {queue?.waitingCount ?? 0}
          </strong>

          <span>
            customers
          </span>

        </div>

      </section>

      {/* ======================================================
          DESK CONTROLS
          ====================================================== */}

      <section className="desk-controls">

        <button
          className="desk-control available"
          onClick={setAvailable}
          disabled={
            actionLoading ||
            !!queue?.currentCustomer
          }
        >
          GO AVAILABLE
        </button>

        <button
          className="desk-control offline"
          onClick={setOffline}
          disabled={
            actionLoading ||
            !!queue?.currentCustomer
          }
        >
          GO OFFLINE
        </button>

      </section>

      {/* ======================================================
          MAIN GRID
          ====================================================== */}

      <section className="desk-main-grid">

        {/* ====================================================
            CURRENT CUSTOMER
            ==================================================== */}

        <div className="current-customer-card">

          <div className="section-header">

            <div>
              <span className="section-label">
                CURRENT CUSTOMER
              </span>

              <h2>
                {queue?.currentCustomer
                  ? "Now Serving"
                  : "No Customer"}
              </h2>
            </div>

            {queue?.currentCustomer && (
              <span className="serving-badge">
                SERVING
              </span>
            )}

          </div>

          {queue?.currentCustomer ? (

            <>

              <div className="big-ticket-number">
                {queue.currentCustomer.displayNumber}
              </div>

              <div className="customer-details">

                <div>
                  <span>Ticket</span>
                  <strong>
                    {queue.currentCustomer.ticketNumber}
                  </strong>
                </div>

                <div>
                  <span>Card</span>
                  <strong>
                    {queue.currentCustomer.cardNumber}
                  </strong>
                </div>

                <div>
                  <span>Priority</span>
                  <strong>
                    {queue.currentCustomer.priority}
                  </strong>
                </div>

                <div>
                  <span>Service time</span>
                  <strong>
                    {formatDuration(elapsedSeconds)}
                  </strong>
                </div>

              </div>

              <div className="service-actions">

                <button
                  className="action-button recall"
                  onClick={recall}
                  disabled={actionLoading}
                >
                  RECALL
                </button>

                <button
                  className="action-button complete"
                  onClick={completeService}
                  disabled={actionLoading}
                >
                  COMPLETE
                </button>

                <button
                  className="action-button transfer"
                  onClick={transfer}
                  disabled={actionLoading}
                >
                  TRANSFER
                </button>

                <button
                  className="action-button no-show"
                  onClick={noShow}
                  disabled={actionLoading}
                >
                  NO SHOW
                </button>

              </div>

            </>

          ) : (

            <div className="empty-current">

              <div className="empty-icon">
                ✓
              </div>

              <h3>
                Desk is ready
              </h3>

              <p>
                Call the next customer when you are
                ready to begin service.
              </p>

            </div>

          )}

        </div>

        {/* ====================================================
            NEXT CUSTOMER
            ==================================================== */}

        <div className="next-customer-card">

          <span className="section-label">
            NEXT CUSTOMER
          </span>

          <h2>
            Up Next
          </h2>

          {queue?.nextCustomer ? (

            <>

              <div className="next-ticket-number">
                {queue.nextCustomer.displayNumber}
              </div>

              <div className="next-details">

                <div>
                  <span>Card</span>
                  <strong>
                    {queue.nextCustomer.cardNumber}
                  </strong>
                </div>

                <div>
                  <span>Priority</span>
                  <strong>
                    {queue.nextCustomer.priority}
                  </strong>
                </div>

              </div>

            </>

          ) : (

            <div className="empty-next">
              <span>—</span>
              <p>
                No customers waiting.
              </p>
            </div>

          )}

        </div>

      </section>

      {/* ======================================================
          CALL NEXT
          ====================================================== */}

      <section className="call-next-section">

        <div>

          <span className="section-label">
            QUEUE CONTROL
          </span>

          <h2>
            {queue?.currentCustomer
              ? "Customer currently being served"
              : "Ready for the next customer?"}
          </h2>

          <p>
            The queue engine automatically selects
            the highest-priority waiting customer.
          </p>

        </div>

        <button
          className="call-next-button"
          onClick={callNext}
          disabled={
            actionLoading ||
            !!queue?.currentCustomer ||
            !queue?.nextCustomer ||
            queue?.desk.status !== "AVAILABLE"
          }
        >
          {actionLoading
            ? "PLEASE WAIT..."
            : "CALL NEXT CUSTOMER"}
        </button>

      </section>

      {/* ======================================================
          WAITING QUEUE
          ====================================================== */}

      <section className="waiting-queue-section">

        <div className="section-header">

          <div>
            <span className="section-label">
              WAITING QUEUE
            </span>

            <h2>
              Customers Waiting
            </h2>
          </div>

          <strong>
            {queue?.waitingCount ?? 0}
          </strong>

        </div>

        {queue?.waitingQueue?.length ? (

          <div className="waiting-list">

            {queue.waitingQueue.map(
              (ticket, index) => (

                <div
                  className="waiting-row"
                  key={ticket.ticketId}
                >

                  <span className="queue-position">
                    #{index + 1}
                  </span>

                  <strong className="queue-number">
                    {ticket.displayNumber}
                  </strong>

                  <span>
                    {ticket.cardNumber}
                  </span>

                  <span
                    className={`priority priority-${ticket.priority.toLowerCase()}`}
                  >
                    {ticket.priority}
                  </span>

                  <span className="waiting-status">
                    WAITING
                  </span>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-queue">
            <h3>
              Queue is empty
            </h3>

            <p>
              There are currently no customers
              waiting for your service.
            </p>
          </div>

        )}

      </section>

    </div>
  );
}