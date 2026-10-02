import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/setup.css";

interface Building {
  id: string;
  name: string;
  location: string | null;
}

export default function BuildingSetup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [buildings, setBuildings] = useState<Building[]>([]);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    loadBuildings();
  }, []);

  async function loadBuildings() {
    try {
      setLoading(true);

      const res = await api.get("/company/buildings");

      setBuildings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function addBuilding() {
    if (!name.trim()) return;

    try {
      setSaving(true);

      await api.post("/company/buildings", {
        name,
        location,
      });

      setName("");
      setLocation("");

      await loadBuildings();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-2">
        Buildings
      </h1>

      <p className="text-gray-500 mb-8">
        Add every building where customers are served.
      </p>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <div className="grid md:grid-cols-2 gap-5">

          <div>

            <label className="block mb-2 font-medium">
              Building Name
            </label>

            <input
              className="w-full border rounded-lg p-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Head Office"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Location
            </label>

            <input
              className="w-full border rounded-lg p-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Kigali"
            />

          </div>

        </div>

        <button
          onClick={addBuilding}
          disabled={saving}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {saving ? "Adding..." : "+ Add Building"}
        </button>

      </div>

      <div className="bg-white rounded-xl shadow">

        <div className="p-5 border-b">

          <h2 className="font-semibold">
            Existing Buildings
          </h2>

        </div>

        {loading ? (

          <div className="p-10 text-center">
            Loading...
          </div>

        ) : buildings.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            No buildings added yet.
          </div>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left p-4">
                  Name
                </th>

                <th className="text-left p-4">
                  Location
                </th>

              </tr>

            </thead>

            <tbody>

              {buildings.map((building) => (

                <tr
                  key={building.id}
                  className="border-b"
                >

                  <td className="p-4">
                    {building.name}
                  </td>

                  <td className="p-4">
                    {building.location || "-"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      <div className="flex justify-between mt-8">

        <button
          onClick={() => navigate("/setup/company")}
          className="border px-6 py-3 rounded-lg"
        >
          Previous
        </button>

        <button
          disabled={buildings.length === 0}
          onClick={() => navigate("/setup/departments")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
        >
          Continue
        </button>

      </div>

    </div>
  );
}