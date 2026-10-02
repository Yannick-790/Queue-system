import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/setup.css";

interface Department {
  id: string;
  name: string;
  building?: {
    name: string;
  };
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  departmentId: string;
  department?: {
    name: string;
  };
}

export default function ServiceSetup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [departmentId, setDepartmentId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");


  useEffect(() => {
    loadData();
  }, []);


 async function loadData() {
  try {
    setLoading(true);

    const departmentRes = await api.get("/company/departments");
    const serviceRes = await api.get("/services");

    setDepartments(departmentRes.data);

    setServices(serviceRes.data.data || serviceRes.data);

    if (departmentRes.data.length > 0) {
      setDepartmentId(departmentRes.data[0].id);
    }

  } catch (error) {
    console.error("Loading setup data failed:", error);
  } finally {
    setLoading(false);
  }
}


  async function addService() {

    if (!name.trim() || !departmentId) {
      return;
    }


    try {

      setSaving(true);


      await api.post("/services", {

        name,
        description,
        departmentId,

      });


      setName("");
      setDescription("");


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
        Services
      </h1>


      <p className="text-gray-500 mb-8">
        Add the services customers will request.
      </p>



      <div className="bg-white rounded-xl shadow p-6 mb-8">


        <div className="grid md:grid-cols-2 gap-5">


          <div>


            <label className="block mb-2 font-medium">
              Department
            </label>


            <select

              className="w-full border rounded-lg p-3"

              value={departmentId}

              onChange={(e) =>
                setDepartmentId(e.target.value)
              }

            >


              <option value="">
                Select department
              </option>


              {departments.map((department) => (

                <option

                  key={department.id}

                  value={department.id}

                >

                  {department.name}

                </option>

              ))}


            </select>


          </div>




          <div>


            <label className="block mb-2 font-medium">
              Service Name
            </label>


            <input

              className="w-full border rounded-lg p-3"

              value={name}

              onChange={(e) =>
                setName(e.target.value)
              }

              placeholder="Passport Application"

            />


          </div>


        </div>



        <div className="mt-5">


          <label className="block mb-2 font-medium">
            Description
          </label>


          <textarea

            className="w-full border rounded-lg p-3"

            rows={3}

            value={description}

            onChange={(e) =>
              setDescription(e.target.value)
            }

            placeholder="Describe this service..."

          />


        </div>




        <button

          onClick={addService}

          disabled={saving}

          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"

        >

          {saving ? "Adding..." : "+ Add Service"}

        </button>


      </div>





      <div className="bg-white rounded-xl shadow">



        <div className="p-5 border-b">

          <h2 className="font-semibold">
            Existing Services
          </h2>

        </div>





        {loading ? (


          <div className="p-10 text-center">
            Loading...
          </div>



        ) : services.length === 0 ? (


          <div className="p-10 text-center text-gray-500">
            No services created yet.
          </div>



        ) : (



          <table className="w-full">


            <thead>


              <tr className="border-b">


                <th className="text-left p-4">
                  Service
                </th>


                <th className="text-left p-4">
                  Department
                </th>


                <th className="text-left p-4">
                  Description
                </th>


              </tr>


            </thead>




            <tbody>



              {services.map((service) => (


                <tr

                  key={service.id}

                  className="border-b"

                >


                  <td className="p-4">
                    {service.name}
                  </td>


                  <td className="p-4">

                    {
                      service.department?.name ||
                      departments.find(
                        (d) => d.id === service.departmentId
                      )?.name ||
                      "-"
                    }

                  </td>


                  <td className="p-4">

                    {service.description || "-"}

                  </td>


                </tr>


              ))}



            </tbody>



          </table>



        )}


      </div>






      <div className="flex justify-between mt-8">



        <button

          onClick={() =>
            navigate("/setup/departments")
          }

          className="border px-6 py-3 rounded-lg"

        >

          Previous

        </button>





        <button

          disabled={services.length === 0}

          onClick={() =>
            navigate("/setup/flow")
          }

          className="bg-green-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"

        >

          Continue

        </button>



      </div>




    </div>

  );
}