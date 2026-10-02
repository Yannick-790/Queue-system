import { useEffect, useState } from "react";
import { CardService } from "../../services/card.service";
import "../../styles/cards.css";

interface Card {
  id: string;
  cardNumber: string;
  rfidUid?: string | null;
  status:
    | "AVAILABLE_AT_SECURITY"
    | "WITH_CUSTOMER"
    | "RETURN_PENDING"
    | "LOST";
}

export default function Cards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [startNumber, setStartNumber] = useState(1);
  const [endNumber, setEndNumber] = useState(100);

  const [rfidInput, setRfidInput] = useState("");
  const [registeringCardId, setRegisteringCardId] = useState<string | null>(null);

  // =========================================================
  // LOAD CARDS
  // =========================================================

  async function loadCards() {
    try {
      setLoading(true);
      setError("");

      const res = await CardService.getCards();

      const data = res.data?.data ?? res.data ?? [];

      setCards(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to load cards."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
  }, []);

  // =========================================================
  // CREATE CARD BATCH
  // =========================================================

  async function createCards() {
    if (startNumber < 1) {
      setError("Start number must be at least 1.");
      return;
    }

    if (endNumber < startNumber) {
      setError(
        "End number must be greater than or equal to start number."
      );
      return;
    }

    try {
      setCreating(true);
      setError("");

      await CardService.createManyCards(
        startNumber,
        endNumber
      );

      await loadCards();

      setStartNumber(endNumber + 1);

      alert(
        `Cards ${startNumber
          .toString()
          .padStart(3, "0")} - ${endNumber
          .toString()
          .padStart(3, "0")} created successfully.`
      );
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to create cards."
      );
    } finally {
      setCreating(false);
    }
  }

    // =========================================================
  // REGISTER RFID TO EXISTING CARD
  // =========================================================

  async function registerRfid(cardId: string) {
    if (!rfidInput.trim()) {
      setError("RFID UID is required.");
      return;
    }

    try {
      setRegisteringCardId(cardId);
      setError("");

      await CardService.registerRfid(
        cardId,
        rfidInput.trim()
      );

      setRfidInput("");
      setRegisteringCardId(null);

      await loadCards();

      alert("RFID registered successfully.");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to register RFID."
      );
      setRegisteringCardId(null);
    }
  }

  // =========================================================
  // STATISTICS
  // =========================================================

  const available = cards.filter(
    (card) =>
      card.status === "AVAILABLE_AT_SECURITY"
  ).length;

  const withCustomer = cards.filter(
    (card) =>
      card.status === "WITH_CUSTOMER"
  ).length;

  const returnPending = cards.filter(
    (card) =>
      card.status === "RETURN_PENDING"
  ).length;

  const lost = cards.filter(
    (card) =>
      card.status === "LOST"
  ).length;

  // =========================================================
  // STATUS DISPLAY
  // =========================================================

  function getStatusClass(
    status: Card["status"]
  ) {
    switch (status) {
      case "AVAILABLE_AT_SECURITY":
        return "available";

      case "WITH_CUSTOMER":
        return "customer";

      case "RETURN_PENDING":
        return "pending";

      case "LOST":
        return "lost";

      default:
        return "";
    }
  }

  function getStatusLabel(
    status: Card["status"]
  ) {
    switch (status) {
      case "AVAILABLE_AT_SECURITY":
        return "Available";

      case "WITH_CUSTOMER":
        return "With Customer";

      case "RETURN_PENDING":
        return "Return Pending";

      case "LOST":
        return "Lost";

      default:
        return status;
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="cards-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="cards-header">

        <div className="cards-header-left">

          <h1>
            Card Management
          </h1>

          <p>
            Manage and monitor your company's
            physical queue cards.
          </p>

        </div>

        <button
          className="cards-refresh-btn"
          onClick={loadCards}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="cards-error">
          {error}
        </div>
      )}


      {/* =====================================================
          CREATE CARD BATCH
      ===================================================== */}

      <section className="cards-create-panel">

        <div className="cards-create-header">

          <h2>
            Create Card Batch
          </h2>

          <p>
            Create QueueFlow card numbers for
            your physical reusable cards.
          </p>

        </div>


        <div className="cards-create-form">

          <div className="cards-field">

            <label htmlFor="start-number">
              Start Number
            </label>

            <input
              id="start-number"
              type="number"
              min="1"
              value={startNumber}
              onChange={(e) =>
                setStartNumber(
                  Number(e.target.value)
                )
              }
            />

          </div>


          <div className="cards-field">

            <label htmlFor="end-number">
              End Number
            </label>

            <input
              id="end-number"
              type="number"
              min="1"
              value={endNumber}
              onChange={(e) =>
                setEndNumber(
                  Number(e.target.value)
                )
              }
            />

          </div>


          <button
            className="cards-create-btn"
            onClick={createCards}
            disabled={creating}
          >
            {creating
              ? "Creating..."
              : "Create Cards"}
          </button>

        </div>

      </section>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      {loading ? (

        <div className="cards-loading">

          <div className="cards-spinner"></div>

          <p>
            Loading cards...
          </p>

        </div>

      ) : (

        <>

          <div className="cards-stats">

            <div className="cards-stat">

              <h2>
                {cards.length}
              </h2>

              <p>
                Total Cards
              </p>

            </div>


            <div className="cards-stat available">

              <h2>
                {available}
              </h2>

              <p>
                Available
              </p>

            </div>


            <div className="cards-stat customer">

              <h2>
                {withCustomer}
              </h2>

              <p>
                With Customers
              </p>

            </div>


            <div className="cards-stat pending">

              <h2>
                {returnPending}
              </h2>

              <p>
                Return Pending
              </p>

            </div>


            <div className="cards-stat lost">

              <h2>
                {lost}
              </h2>

              <p>
                Lost Cards
              </p>

            </div>

          </div>


          {/* =================================================
              CARD TABLE
          ================================================= */}

          <section className="cards-table-panel">

            <div className="cards-table-header">

              <h2>
                Physical Cards
              </h2>

              <span className="cards-table-count">
                {cards.length}{" "}
                {cards.length === 1
                  ? "card"
                  : "cards"}
              </span>

            </div>


            {cards.length === 0 ? (

              <div className="cards-empty">

                <div className="cards-empty-icon">
                  💳
                </div>

                <h3>
                  No cards registered
                </h3>

                <p>
                  Create your first card batch
                  to start managing physical
                  queue cards.
                </p>

              </div>

            ) : (

              <div className="cards-table-wrapper">

                <table className="cards-table">

                  <thead>

                    <tr>

                      <th>
                        Card Number
                      </th>

                      <th>
                        RFID
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {cards.map((card) => (

                      <tr key={card.id}>

                        <td>

                          <span className="card-number">
                            {card.cardNumber}
                          </span>

                        </td>


                        <td>

  {card.rfidUid ? (

    <span className="card-rfid">
      {card.rfidUid}
    </span>

  ) : (

    <div className="card-rfid-register">

      <input
        type="text"
        placeholder="Scan RFID"
        value={
          registeringCardId === card.id
            ? rfidInput
            : ""
        }
        onChange={(e) => {
          setRegisteringCardId(card.id);
          setRfidInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            registerRfid(card.id);
          }
        }}
      />

      <button
        type="button"
        onClick={() =>
          registerRfid(card.id)
        }
        disabled={
          registeringCardId === card.id &&
          !rfidInput.trim()
        }
      >
        {registeringCardId === card.id
          ? "Registering..."
          : "Register"}
      </button>

    </div>

  )}

</td>


                        <td>

                          <span
                            className={`card-status ${getStatusClass(
                              card.status
                            )}`}
                          >
                            {getStatusLabel(
                              card.status
                            )}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </>

      )}

    </div>
  );
}