import { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import "../../styles/DeskDisplay.css";

// ============================================================
// TYPES
// ============================================================

interface CustomerCalledData {
  event: "CUSTOMER_CALLED";
  displayNumber: string;
  desk: string;
  service: string;
}

interface DeskInfo {
  id: string;
  name: string;
  status?: string;
}

const SOCKET_URL = "http://localhost:5000";

// ============================================================
// DESK DISPLAY
// ============================================================

export default function DeskDisplay() {
  const { user } = useAuth();

  const [customer, setCustomer] =
    useState<CustomerCalledData | null>(null);

  const [connected, setConnected] =
    useState(false);

  // ==========================================================
  // EMPLOYEE DESK
  // ==========================================================

  const desk = useMemo<DeskInfo | null>(() => {
    return user?.employee?.desk ?? null;
  }, [user?.employee?.desk]);

  // ==========================================================
  // SOCKET CONNECTION
  // ==========================================================

  useEffect(() => {
    const companyId = user?.companyId;

    if (!companyId) {
      console.warn(
        "DeskDisplay: company ID is not available."
      );

      setConnected(false);
      return;
    }

    console.log(
      "DeskDisplay: starting Socket.IO connection",
      {
        companyId,
        employeeId: user?.employee?.id,
        deskId: desk?.id,
        deskName: desk?.name,
      }
    );

    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // ========================================================
    // CONNECT
    // ========================================================

    const handleConnect = () => {
      console.log(
        "DeskDisplay: Socket.IO connected:",
        socket.id
      );

      setConnected(true);

      // ------------------------------------------------------
      // JOIN COMPANY
      // ------------------------------------------------------

      socket.emit(
        "join-company",
        companyId
      );

      console.log(
        "DeskDisplay: joined company room:",
        companyId
      );

      // ------------------------------------------------------
      // JOIN EMPLOYEE
      //
      // This gives us a private employee room as well.
      // ------------------------------------------------------

      if (user?.employee?.id) {
        socket.emit(
          "join-employee",
          {
            companyId,
            employeeId:
              user.employee.id,
          }
        );

        console.log(
          "DeskDisplay: joined employee room:",
          user.employee.id
        );
      }
    };

    // ========================================================
    // DISCONNECT
    // ========================================================

    const handleDisconnect = (
      reason: Socket.DisconnectReason
    ) => {
      console.warn(
        "DeskDisplay: Socket.IO disconnected:",
        reason
      );

      setConnected(false);
    };

    // ========================================================
    // CONNECTION ERROR
    // ========================================================

    const handleConnectError = (
      error: Error
    ) => {
      console.error(
        "DeskDisplay: Socket.IO connection error:",
        error.message
      );

      setConnected(false);
    };

    // ========================================================
    // QUEUE UPDATE
    // ========================================================

    const handleQueueUpdate = (
      data: unknown
    ) => {
      console.log(
        "DeskDisplay: received queue-update:",
        data
      );

      // ------------------------------------------------------
      // BASIC OBJECT VALIDATION
      // ------------------------------------------------------

      if (
        typeof data !== "object" ||
        data === null
      ) {
        console.warn(
          "DeskDisplay: invalid socket payload."
        );

        return;
      }

      const payload =
        data as Record<string, unknown>;

      // ------------------------------------------------------
      // ONLY CUSTOMER_CALLED
      // ------------------------------------------------------

      if (
        payload.event !==
        "CUSTOMER_CALLED"
      ) {
        return;
      }

      // ------------------------------------------------------
      // VALIDATE PAYLOAD
      // ------------------------------------------------------

      if (
        typeof payload.displayNumber !==
          "string" ||
        typeof payload.desk !==
          "string" ||
        typeof payload.service !==
          "string"
      ) {
        console.warn(
          "DeskDisplay: invalid CUSTOMER_CALLED payload:",
          payload
        );

        return;
      }

      const incomingDesk =
        payload.desk.trim();

      // ------------------------------------------------------
      // DESK CHECK
      //
      // The current backend broadcasts CUSTOMER_CALLED
      // to the entire company room.
      //
      // Therefore this display must ignore calls for
      // another desk.
      // ------------------------------------------------------

      if (!desk?.name) {
        console.warn(
          "DeskDisplay: employee has no assigned desk."
        );

        return;
      }

      const assignedDesk =
        desk.name.trim();

      if (
        incomingDesk.toLowerCase() !==
        assignedDesk.toLowerCase()
      ) {
        console.log(
          "DeskDisplay: ignoring call for another desk.",
          {
            incomingDesk,
            assignedDesk,
          }
        );

        return;
      }

      // ------------------------------------------------------
      // CREATE SAFE CUSTOMER DATA
      // ------------------------------------------------------

      const customerData: CustomerCalledData = {
        event:
          "CUSTOMER_CALLED",

        displayNumber:
          payload.displayNumber.trim(),

        desk:
          incomingDesk,

        service:
          payload.service.trim(),
      };

      console.log(
        "DeskDisplay: CUSTOMER CALLED FOR THIS DESK:",
        customerData
      );

      setCustomer(
        customerData
      );
    };

    // ========================================================
    // SOCKET EVENTS
    // ========================================================

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    socket.on(
      "connect_error",
      handleConnectError
    );

    socket.on(
      "queue-update",
      handleQueueUpdate
    );

    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {
      console.log(
        "DeskDisplay: cleaning up Socket.IO connection."
      );

      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );

      socket.off(
        "connect_error",
        handleConnectError
      );

      socket.off(
        "queue-update",
        handleQueueUpdate
      );

      socket.disconnect();

      setConnected(false);
    };
  }, [
    user?.companyId,
    user?.employee?.id,
    desk?.id,
    desk?.name,
  ]);

  // ==========================================================
  // NO USER
  // ==========================================================

  if (!user) {
    return (
      <div className="desk-display">
        <main className="desk-display-main">
          <section className="waiting-display">
            <div className="waiting-icon">
              !
            </div>

            <h2>
              Authentication required
            </h2>

            <p>
              Please sign in to access the desk display.
            </p>
          </section>
        </main>
      </div>
    );
  }

  // ==========================================================
  // NO EMPLOYEE
  // ==========================================================

  if (
    user.role === "EMPLOYEE" &&
    !user.employee
  ) {
    return (
      <div className="desk-display">
        <main className="desk-display-main">
          <section className="waiting-display">
            <div className="waiting-icon">
              !
            </div>

            <h2>
              Employee profile not found
            </h2>

            <p>
              Your account is not connected to an employee profile.
            </p>
          </section>
        </main>
      </div>
    );
  }

  // ==========================================================
  // NO DESK
  // ==========================================================

  if (
    user.role === "EMPLOYEE" &&
    !desk
  ) {
    return (
      <div className="desk-display">
        <header className="desk-display-header">

          <div>
            <p className="desk-display-label">
              QUEUEFLOW
            </p>

            <h1>
              Desk Display
            </h1>
          </div>

          <div className="connection-status offline">
            <span className="connection-dot" />
            NO DESK
          </div>

        </header>

        <main className="desk-display-main">

          <section className="waiting-display">

            <div className="waiting-icon">
              !
            </div>

            <h2>
              No desk assigned
            </h2>

            <p>
              Contact your manager or administrator
              to assign a desk to your employee account.
            </p>

          </section>

        </main>

        <footer className="desk-display-footer">

          <span>
            QueueFlow
          </span>

          <span>
            Desk assignment required
          </span>

        </footer>
      </div>
    );
  }

  // ==========================================================
  // MAIN DISPLAY
  // ==========================================================

  return (
    <div className="desk-display">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="desk-display-header">

        <div>

          <p className="desk-display-label">
            QUEUEFLOW
          </p>

          <h1>
            Desk Display
          </h1>

          <p className="desk-display-assignment">
            {desk?.name}
          </p>

        </div>

        <div
          className={
            connected
              ? "connection-status online"
              : "connection-status offline"
          }
        >

          <span className="connection-dot" />

          {connected
            ? "LIVE"
            : "OFFLINE"}

        </div>

      </header>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="desk-display-main">

        <p className="now-serving">
          NOW SERVING
        </p>


        {/* ====================================================
            CUSTOMER CALLED
        ==================================================== */}

        {customer ? (

          <section
            className="customer-called"
            aria-live="polite"
          >

            {/* ================================================
                TICKET NUMBER
            ================================================= */}

            <div className="ticket-number">
              {customer.displayNumber}
            </div>


            {/* ================================================
                CUSTOMER DETAILS
            ================================================= */}

            <div className="customer-details">

              <div className="display-detail">

                <span>
                  SERVICE
                </span>

                <strong>
                  {customer.service}
                </strong>

              </div>


              <div className="display-detail">

                <span>
                  DESK
                </span>

                <strong>
                  {customer.desk}
                </strong>

              </div>

            </div>

          </section>

        ) : (

          /* ==================================================
             WAITING
          ================================================== */

          <section className="waiting-display">

            <div className="waiting-icon">
              ✓
            </div>

            <h2>
              Waiting for next customer
            </h2>

            <p>
              Your desk is ready.
              The next customer will appear here.
            </p>

          </section>

        )}

      </main>


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="desk-display-footer">

        <div>
          <strong>
            QueueFlow
          </strong>

          <span>
            {desk?.name}
          </span>
        </div>

        <span>
          Please serve the displayed customer.
        </span>

      </footer>

    </div>
  );
}
