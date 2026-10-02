import { useState } from "react";
import { CardService } from "../../services/card.service";

export default function ReturnCard() {
  const [cardId, setCardId] = useState("");
  const [loading, setLoading] = useState(false);

  async function returnCard() {
    if (!cardId.trim()) {
      alert("Enter the card ID.");
      return;
    }

    try {
      setLoading(true);

      await CardService.returnCard(cardId.trim());

      alert("Card returned successfully.");

      setCardId("");
    } catch (err: any) {
      alert(
        err.response?.data?.error ||
          "Failed to return card."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Return Card</h1>

      <p>
        Enter the card ID for testing.
      </p>

      <input
        type="text"
        placeholder="Card ID"
        value={cardId}
        onChange={(e) => setCardId(e.target.value)}
      />

      <br />
      <br />

      <button
        onClick={returnCard}
        disabled={loading}
      >
        {loading ? "Returning..." : "Return Card"}
      </button>
    </div>
  );
}