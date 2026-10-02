import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/setup.css";


type CompanyForm = {
  name: string;
  industry: string;
  routingMode: "FIXED_FLOW" | "FLEXIBLE_FLOW";
  allowEmployeeRegistration: boolean;
  employeeInviteCode: string;
};

export default function CompanySetup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CompanyForm>({
    name: "",
    industry: "",
    routingMode: "FIXED_FLOW",
    allowEmployeeRegistration: false,
    employeeInviteCode: "",
  });

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    try {
      const res = await api.get("/company");

      if (res.data) {
        setForm({
          name: res.data.name ?? "",
          industry: res.data.industry ?? "",
          routingMode: res.data.routingMode ?? "FIXED_FLOW",
          allowEmployeeRegistration:
            res.data.allowEmployeeRegistration ?? false,
          employeeInviteCode:
            res.data.employeeInviteCode ?? "",
        });
      }
    } catch {
      // First setup, nothing exists yet.
    } finally {
      setLoading(false);
    }
  }

  function change(e: any) {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  async function generateInviteCode() {
  try {
    const res = await api.post(
      "/company/generate-invite-code"
    );

    setForm((prev) => ({
      ...prev,
      employeeInviteCode: res.data.data.inviteCode,
    }));
  } catch (err) {
    console.error(err);
  }
}

 async function saveCompany() {
  try {
    if (
      form.allowEmployeeRegistration &&
      !form.employeeInviteCode
    ) {
      alert("Please generate an employee invite code first.");
      return;
    }

    setSaving(true);

    await api.patch("/company", form);

    navigate("/setup/buildings");
  } catch (err) {
    console.error(err);
  } finally {
    setSaving(false);
  }
}

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        Loading company...
      </div>
    );
  }

  return (
    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold mb-2">
        Company Setup
      </h1>

      <p className="text-gray-500 mb-8">
        Configure your company before using the queue system.
      </p>

      <div className="space-y-6">

        <div>
          <label className="block mb-2">
            Company Name
          </label>

          <input
            className="w-full border rounded-lg p-3"
            name="name"
            value={form.name}
            onChange={change}
          />
        </div>

        <div>
          <label className="block mb-2">
            Industry
          </label>

          <input
            className="w-full border rounded-lg p-3"
            name="industry"
            value={form.industry}
            onChange={change}
          />
        </div>

        <div>
          <label className="block mb-2">
            Routing Mode
          </label>

          <select
            className="w-full border rounded-lg p-3"
            name="routingMode"
            value={form.routingMode}
            onChange={change}
          >
            <option value="FIXED_FLOW">
              Fixed Flow
            </option>

            <option value="FLEXIBLE_FLOW">
              Flexible Flow
            </option>

          </select>
        </div>

       <div className="employee-toggle-card">

  <div>
    <h3>
      Employee Registration
    </h3>

    <p>
      Allow employees to join the company using an invite code.
    </p>
  </div>


  <label className="switch">

    <input
      type="checkbox"
      name="allowEmployeeRegistration"
      checked={form.allowEmployeeRegistration}
      onChange={change}
    />

    <span className="slider"></span>

  </label>


</div>

        {form.allowEmployeeRegistration && (

          <div className="border rounded-xl p-5">

            <div className="flex justify-between items-center mb-4">

              <h3 className="font-semibold">
                Employee Invite Code
              </h3>

              <button
                onClick={generateInviteCode}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                Generate
              </button>

            </div>

            <input
              readOnly
              className="w-full border rounded-lg p-3 bg-gray-100"
              value={form.employeeInviteCode}
            />

          </div>

        )}

        <div className="flex justify-end">

          <button
            onClick={saveCompany}
            disabled={saving}
            className="px-8 py-3 rounded-lg bg-green-600 text-white"
          >
            {saving
              ? "Saving..."
              : "Continue"}
          </button>

        </div>

      </div>

    </div>
  );
}