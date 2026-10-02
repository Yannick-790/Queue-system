import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import "../../styles/PublicDisplay.css";

interface CustomerCalledData {
  event: "CUSTOMER_CALLED";
  displayNumber: string;
  desk: string;
  service: string;
}

const SOCKET_URL = "http://localhost:5000";

export default function PublicDisplay() {
  const { user } = useAuth();

  const [customer, setCustomer] =
    useState<CustomerCalledData | null>(null);

  const [connected, setConnected] =
    useState(false);

  useEffect(() => {
    const companyId = user?.companyId;

    if (!companyId) {
      console.warn(
        "PublicDisplay: company ID is not available."
      );

      setConnected(false);
      return;
    }

    console.log(
      "PublicDisplay: connecting...",
      companyId
    );

    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    // ========================================================
    // CONNECT
    // ========================================================

    const handleConnect = () => {
      console.log(
        "PublicDisplay connected:",
        socket.id
      );

      setConnected(true);

      /*
       * Backend:
       *
       * socket.on("join-company", ...)
       *
       * joins:
       *
       * company:${companyId}
       */

      socket.emit(
        "join-company",
        companyId
      );

      console.log(
        "PublicDisplay joined company:",
        companyId
      );
    };

    // ========================================================
    // DISCONNECT
    // ========================================================

    const handleDisconnect = (
      reason: Socket.DisconnectReason
    ) => {
      console.log(
        "PublicDisplay disconnected:",
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
        "PublicDisplay connection error:",
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
        "PublicDisplay queue update:",
        data
      );

      /*
       * Runtime validation.
       * Never blindly trust socket data.
       */

      if (
        typeof data !== "object" ||
        data === null
      ) {
        return;
      }

      const payload =
        data as Record<string, unknown>;

      if (
        payload.event !==
        "CUSTOMER_CALLED"
      ) {
        return;
      }

      if (
        typeof payload.displayNumber !==
          "string" ||
        typeof payload.desk !==
          "string" ||
        typeof payload.service !==
          "string"
      ) {
        console.warn(
          "PublicDisplay: invalid CUSTOMER_CALLED payload:",
          data
        );

        return;
      }

      const customerData: CustomerCalledData =
        {
          event: "CUSTOMER_CALLED",

          displayNumber:
            payload.displayNumber,

          desk:
            payload.desk,

          service:
            payload.service,
        };

      console.log(
        "PUBLIC DISPLAY NOW SERVING:",
        customerData
      );

      setCustomer(customerData);
    };

    // ========================================================
    // REGISTER SOCKET EVENTS
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
        "PublicDisplay: cleaning up socket."
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
  }, [user?.companyId]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="public-display">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="public-display-header">

        <div>
          <p className="public-display-brand">
            QUEUEFLOW
          </p>

          <h1>
            Customer Display
          </h1>
        </div>

        <div
          className={
            connected
              ? "public-connection online"
              : "public-connection offline"
          }
        >
          <span className="public-connection-dot" />

          {connected
            ? "LIVE"
            : "OFFLINE"}
        </div>

      </header>

      {/* ====================================================
          MAIN
      ==================================================== */}

      <main className="public-display-main">

        <p className="public-now-serving">
          NOW SERVING
        </p>

        {customer ? (

          <section className="public-customer">

            {/* NUMBER */}

            <div className="public-ticket-number">
              {customer.displayNumber}
            </div>

            {/* DETAILS */}

            <div className="public-details">

              <div className="public-detail">

                <span>
                  DESK
                </span>

                <strong>
                  {customer.desk}
                </strong>

              </div>

              <div className="public-detail">

                <span>
                  SERVICE
                </span>

                <strong>
                  {customer.service}
                </strong>

              </div>

            </div>

          </section>

        ) : (

          <section className="public-waiting">

            <div className="public-waiting-icon">
              ✓
            </div>

            <h2>
              Waiting for next customer
            </h2>

            <p>
              Please wait for your number
              to be called.
            </p>

          </section>

        )}

      </main>

      {/* ====================================================
          FOOTER
      ==================================================== */}

      <footer className="public-display-footer">

        <strong>
          QueueFlow
        </strong>

        <span>
          Please proceed to your assigned desk
          when your number is called.
        </span>

      </footer>

    </div>
  );
}