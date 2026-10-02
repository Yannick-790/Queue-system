import { useEffect, useMemo, useState } from "react";
import { CardService } from "../../services/card.service";

import "../../styles/GiveCard.css";

interface Card {
  id: string;
  cardNumber: string;
  status: string;
}

export default function GiveCard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [givingCard, setGivingCard] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    try {
      setLoading(true);

      const res = await CardService.getCards();

      const availableCards = res.data.data.filter(
        (card: Card) =>
          card.status === "AVAILABLE_AT_SECURITY"
      );

      setCards(availableCards);
    } catch (err: any) {
      console.error("Failed to load cards:", err);

      alert(
        err?.response?.data?.error ||
          "Failed to load available cards."
      );
    } finally {
      setLoading(false);
    }
  }

  async function giveCard(cardId: string) {
    try {
      setGivingCard(cardId);

      await CardService.assignCard(cardId);

      alert("Card given to customer successfully.");

      await loadCards();
    } catch (err: any) {
      console.error("Failed to give card:", err);

      alert(
        err?.response?.data?.error ||
          "Failed to give card."
      );
    } finally {
      setGivingCard(null);
    }
  }

  const filteredCards = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return cards;
    }

    return cards.filter((card) =>
      card.cardNumber
        .toLowerCase()
        .includes(value)
    );
  }, [cards, search]);

  return (
    <div className="give-card">

      {/* =====================================================
          MODULE HEADER
      ====================================================== */}

      <div className="give-card-header">

        <div>

          <span className="give-card-eyebrow">
            CARD INVENTORY
          </span>

          <h3>
            Available Cards
          </h3>

          <p>
            Select a card to assign it to the next customer.
          </p>

        </div>

        <div className="give-card-count">

          <strong>
            {cards.length}
          </strong>

          <span>
            Available
          </span>

        </div>

      </div>


      {/* =====================================================
          TOOLBAR
      ====================================================== */}

      <div className="give-card-toolbar">

        <div className="give-card-search">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search card number..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <button
          className="give-card-refresh"
          onClick={loadCards}
          disabled={loading}
        >
          {loading
            ? "REFRESHING..."
            : "REFRESH"}
        </button>

      </div>


      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="give-card-table-wrapper">

        <table className="give-card-table">

          <thead>

            <tr>

              <th>
                CARD
              </th>

              <th>
                STATUS
              </th>

              <th>
                ACTION
              </th>

            </tr>

          </thead>


          <tbody>

            {loading && cards.length === 0 ? (

              <tr>

                <td
                  colSpan={3}
                  className="give-card-loading"
                >

                  <div className="loading-spinner" />

                  <span>
                    Loading available cards...
                  </span>

                </td>

              </tr>

            ) : filteredCards.length > 0 ? (

              filteredCards.map((card) => (

                <tr key={card.id}>

                  <td>

                    <div className="card-number">

                      <div className="card-icon">
                        CARD
                      </div>

                      <strong>
                        {card.cardNumber}
                      </strong>

                    </div>

                  </td>


                  <td>

                    <span className="card-status">

                      <span className="status-dot" />

                      AVAILABLE

                    </span>

                  </td>


                  <td>

                    <button
                      className="give-card-button"
                      onClick={() =>
                        giveCard(card.id)
                      }
                      disabled={
                        givingCard === card.id ||
                        givingCard !== null
                      }
                    >

                      {givingCard === card.id
                        ? "ASSIGNING..."
                        : "GIVE CARD"}

                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan={3}
                  className="give-card-empty"
                >

                  <div className="empty-card-icon">
                    —
                  </div>

                  <h4>
                    No cards available
                  </h4>

                  <p>
                    {search
                      ? "No cards match your search."
                      : "There are currently no cards available at security."}
                  </p>

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="give-card-footer">

        <span>
          Showing{" "}
          <strong>
            {filteredCards.length}
          </strong>{" "}
          of{" "}
          <strong>
            {cards.length}
          </strong>{" "}
          available cards
        </span>

        <span className="inventory-status">
          ● Inventory synchronized
        </span>

      </div>

    </div>
  );
}