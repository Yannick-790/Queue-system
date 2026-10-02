import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/setup.css";

interface Building {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  buildingId: string;
  building?: {
    name: string;
  };
}

export default function DepartmentSetup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [buildingId, setBuildingId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [buildingRes, departmentRes] = await Promise.all([
        api.get("/company/buildings"),
        api.get("/company/departments"),
      ]);

      setBuildings(buildingRes.data);
      setDepartments(departmentRes.data);

      if (buildingRes.data.length > 0) {
        setBuildingId(buildingRes.data[0].id);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  async function addDepartment() {
    if (!name.trim() || !buildingId) return;

    try {
      setSaving(true);

      await api.post("/company/departments", {
        name,
        buildingId,
      });

      setName("");

      await loadData();

    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }


  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-2">
        Departments
      </h1>

      <p className="text-gray-500 mb-8">
        Create departments where customers will receive services.
      </p>


      <div className="bg-white rounded-xl shadow p-6 mb-8">


        <div className="grid md:grid-cols-2 gap-5">


          <div>

            <label className="block mb-2 font-medium">
              Building
            </label>


            <select
              className="w-full border rounded-lg p-3"
              value={buildingId}
              onChange={(e) => setBuildingId(e.target.value)}
            >

              <option value="">
                Select building
              </option>


              {buildings.map((building) => (

                <option
                  key={building.id}
                  value={building.id}
                >
                  {building.name}
                </option>

              ))}


            </select>


          </div>



          <div>

            <label className="block mb-2 font-medium">
              Department Name
            </label>


            <input
              className="w-full border rounded-lg p-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer Service"
            />


          </div>


        </div>



        <button
          onClick={addDepartment}
          disabled={saving}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >

          {saving ? "Adding..." : "+ Add Department"}

        </button>


      </div>



      <div className="bg-white rounded-xl shadow">


        <div className="p-5 border-b">

          <h2 className="font-semibold">
            Existing Departments
          </h2>

        </div>



        {loading ? (

          <div className="p-10 text-center">
            Loading...
          </div>


        ) : departments.length === 0 ? (

          <div className="p-10 text-center text-gray-500">
            No departments created yet.
          </div>


        ) : (

          <table className="w-full">


            <thead>

              <tr className="border-b">


                <th className="text-left p-4">
                  Department
                </th>


                <th className="text-left p-4">
                  Building
                </th>


              </tr>

            </thead>



            <tbody>


              {departments.map((department) => (

                <tr
                  key={department.id}
                  className="border-b"
                >


                  <td className="p-4">
                    {department.name}
                  </td>


                  <td className="p-4">
                    {
                      department.building?.name ||
                      buildings.find(
                        (b) => b.id === department.buildingId
                      )?.name ||
                      "-"
                    }
                  </td>


                </tr>


              ))}


            </tbody>


          </table>

        )}


      </div>




      <div className="flex justify-between mt-8">


        <button
          onClick={() => navigate("/setup/buildings")}
          className="border px-6 py-3 rounded-lg"
        >
          Previous
        </button>



        <button
          disabled={departments.length === 0}
          onClick={() => navigate("/setup/services")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
        >
          Continue
        </button>


      </div>



    </div>
  );
}