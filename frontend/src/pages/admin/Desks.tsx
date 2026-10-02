import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/desks.css";

interface Service {
  id: string;
  name: string;
}

interface Building {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  building?: Building;
  services?: Service[];
}

interface Employee {
  id: string;

  user?: {
    id: string;
    name: string;
    email: string;
  };

  service?: Service;

  department?: {
    id: string;
    name: string;
  };
}

interface Desk {
  id: string;
  name: string;
  status: "AVAILABLE" | "BUSY" | "OFFLINE";

  department: {
    id: string;
    name: string;
    building?: Building;
    services?: Service[];
  };

  service?: Service;

  employee?: Employee;
}

export default function Desks() {
  // =========================================================
  // DATA
  // =========================================================

  const [desks, setDesks] = useState<Desk[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [createServices, setCreateServices] = useState<Service[]>([]);
  const [editServices, setEditServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);


  async function loadServicesByDepartment(
  departmentId: string,
  mode: "create" | "edit"
) {
  if (!departmentId) {
    if (mode === "create") {
      setCreateServices([]);
    } else {
      setEditServices([]);
    }

    return;
  }

  try {
    setLoadingServices(true);

    const response = await api.get(
      `/company/departments/${departmentId}/services`
    );

    const services =
      response.data.data ||
      response.data ||
      [];

    if (mode === "create") {
      setCreateServices(services);
    } else {
      setEditServices(services);
    }
  } catch (error) {
    console.error(
      "Failed to load department services:",
      error
    );

    if (mode === "create") {
      setCreateServices([]);
    } else {
      setEditServices([]);
    }

    alert("Failed to load services for this department.");
  } finally {
    setLoadingServices(false);
  }
}

  // =========================================================
  // LOADING STATES
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // =========================================================
  // CREATE DESK
  // =========================================================

  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    departmentId: "",
    serviceId: "",
    name: "",
  });

  // =========================================================
  // EDIT DESK
  // =========================================================

  const [showEdit, setShowEdit] = useState(false);
  const [editingDesk, setEditingDesk] = useState<Desk | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    departmentId: "",
    serviceId: "",
  });

  // =========================================================
  // ASSIGN EMPLOYEE
  // =========================================================

  const [showAssign, setShowAssign] = useState(false);
  const [assigningDesk, setAssigningDesk] =
    useState<Desk | null>(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState("");

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [
        deskResponse,
        departmentResponse,
        employeeResponse,
      ] = await Promise.all([
        api.get("/desk"),
        api.get("/company/departments"),
        api.get("/employees"),
      ]);

      setDesks(
        deskResponse.data.data ||
          deskResponse.data ||
          []
      );

      setDepartments(
        departmentResponse.data.data ||
          departmentResponse.data ||
          []
      );

      setEmployees(
        employeeResponse.data.data ||
          employeeResponse.data ||
          []
      );
    } catch (error) {
      console.error(
        "Failed to load desk data:",
        error
      );

      alert("Failed to load desk data.");
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // CREATE DESK
  // =========================================================

  async function createDesk() {
    if (!form.departmentId) {
      alert("Please select a department.");
      return;
    }

    if (!form.serviceId) {
  alert("Please select a service.");
  return;
}

    if (!form.name.trim()) {
      alert("Please enter a desk name.");
      return;
    }

    try {
      setCreating(true);

      await api.post("/desk", {
        departmentId: form.departmentId,
        name: form.name.trim(),
        serviceId: form.serviceId,
      });

      alert("Desk created successfully.");

      setForm({
        departmentId: "",
        name: "",
        serviceId: "",
      });

      setShowCreate(false);

      await loadData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.error ||
          "Failed to create desk."
      );
    } finally {
      setCreating(false);
    }
  }

  // =========================================================
  // EDIT DESK
  // =========================================================

 function openEditDesk(desk: Desk) {
  setEditingDesk(desk);

  const departmentId = desk.department.id;
  const serviceId = desk.service?.id || "";

  setEditForm({
    name: desk.name,
    departmentId,
    serviceId,
  });

  setShowEdit(true);

  loadServicesByDepartment(
    departmentId,
    "edit"
  );
}

  async function updateDesk() {
    if (!editingDesk) {
      return;
    }

    if (!editForm.name.trim()) {
      alert("Please enter a desk name.");
      return;
    }

    if (!editForm.departmentId) {
      alert("Please select a department.");
      return;
    }

    try {
      setUpdating(true);

      await api.patch(
        `/desk/${editingDesk.id}`,
        {
          name: editForm.name.trim(),
          departmentId: editForm.departmentId,
          serviceId: editForm.serviceId,
        }
      );

      alert("Desk updated successfully.");

      setShowEdit(false);
      setEditingDesk(null);

      setEditForm({
        name: "",
        departmentId: "",
        serviceId: "",
      });

      await loadData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.error ||
          "Failed to update desk."
      );
    } finally {
      setUpdating(false);
    }
  }

  // =========================================================
  // ASSIGN EMPLOYEE TO DESK
  // =========================================================

  function openAssignDesk(desk: Desk) {
  if (desk.status !== "AVAILABLE") {
    alert("Only available desks can be assigned.");
    return;
  }

  if (desk.employee) {
    alert("This desk is already assigned to an employee.");
    return;
  }

  if (!desk.service) {
    alert("This desk has no service assigned.");
    return;
  }

  setAssigningDesk(desk);
  setSelectedEmployee("");
  setShowAssign(true);
}

  async function assignEmployee() {
    if (!assigningDesk) {
      return;
    }

    if (!selectedEmployee) {
      alert("Please select an employee.");
      return;
    }

    try {
      setAssigning(true);

      await api.post(
        `/desk/${assigningDesk.id}/assign/${selectedEmployee}`
      );

      alert(
        "Employee assigned to desk successfully."
      );

      setShowAssign(false);
      setAssigningDesk(null);
      setSelectedEmployee("");

      await loadData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.error ||
          "Failed to assign employee to desk."
      );
    } finally {
      setAssigning(false);
    }
  }

  // =========================================================
  // RELEASE EMPLOYEE FROM DESK
  // =========================================================

  async function releaseEmployee(
    employeeId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to release this employee from the desk?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.post(
        `/desk/release/${employeeId}`
      );

      alert(
        "Employee released from desk successfully."
      );

      await loadData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.error ||
          "Failed to release employee."
      );
    }
  }

  // =========================================================
  // CHANGE DESK STATUS
  // =========================================================

  async function changeStatus(
    deskId: string,
    status:
      | "AVAILABLE"
      | "BUSY"
      | "OFFLINE"
  ) {
    try {
      await api.patch(
        `/desk/${deskId}/status`,
        {
          status,
        }
      );

      await loadData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.error ||
          "Failed to update desk status."
      );
    }
  }

  // =========================================================
  // DELETE DESK
  // =========================================================

  async function deleteDesk(
    deskId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this desk?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/desk/${deskId}`
      );

      await loadData();
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.error ||
          "Failed to delete desk."
      );
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="desks-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="desks-header">

        <div className="desks-header-content">

          <div className="desks-title-area">

            <span className="desks-eyebrow">
              WORKSPACE
            </span>

            <h1>
              Desk Management
            </h1>

            <p>
              Create and manage desks for your departments.
            </p>

          </div>

          <button
            className="desk-btn desk-btn-primary"
            onClick={() =>
              setShowCreate(!showCreate)
            }
          >
            {showCreate
              ? "CANCEL"
              : "+ CREATE DESK"}
          </button>

        </div>

      </div>

      {/* =====================================================
          CREATE DESK
      ===================================================== */}

      {showCreate && (
        <div className="desk-form-card">

          <div className="desk-form-header">

            <div>
              <span className="desk-section-label">
                NEW DESK
              </span>

              <h2>
                Create Desk
              </h2>

              <p>
                Add a new desk to one of your departments.
              </p>
            </div>

          </div>

          <div className="desk-form-row">

            {/* DEPARTMENT */}

            <div className="desk-form-group">

              <label>
                Department
              </label>

              <select
                value={form.departmentId}
                
                onChange={(e) => {
  const departmentId = e.target.value;

  setForm({
    ...form,
    departmentId,
    serviceId: "",
  });

  loadServicesByDepartment(
    departmentId,
    "create"
  );
}}
              >

                <option value="">
                  Select department
                </option>

                {departments.map(
                  (department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.building?.name
                        ? `${department.building.name} → `
                        : ""}
                      {department.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* SERVICE */}

<div className="desk-form-group">

  <label>
    Service
  </label>

  <select
    value={form.serviceId}
    disabled={
      !form.departmentId ||
      loadingServices
    }
    onChange={(e) =>
      setForm({
        ...form,
        serviceId: e.target.value,
      })
    }
  >

    <option value="">
      {loadingServices
        ? "Loading services..."
        : !form.departmentId
        ? "Select department first"
        : createServices.length === 0
        ? "No services available"
        : "Select service"}
    </option>

    {createServices.map((service) => (
      <option
        key={service.id}
        value={service.id}
      >
        {service.name}
      </option>
    ))}

  </select>

</div>

            {/* DESK NAME */}

            <div className="desk-form-group">

              <label>
                Desk Name
              </label>

              <input
                type="text"
                placeholder="Desk 1"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

            </div>

            {/* CREATE */}

            <div className="desk-form-action">

              <button
                className="desk-btn desk-btn-primary"
                onClick={createDesk}
                disabled={creating}
              >
                {creating
                  ? "CREATING..."
                  : "CREATE"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          EDIT DESK
      ===================================================== */}

      {showEdit && editingDesk && (
        <div className="desk-form-card">

          <div className="desk-form-header">

            <div>

              <span className="desk-section-label">
                EDIT DESK
              </span>

              <h2>
                Edit Desk
              </h2>

              <p>
                Update the desk information.
              </p>

            </div>

          </div>

          <div className="desk-form-row">

            {/* DESK NAME */}

            <div className="desk-form-group">

              <label>
                Desk Name
              </label>

              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    name: e.target.value,
                  })
                }
              />

            </div>

            {/* DEPARTMENT */}

            <div className="desk-form-group">

              <label>
                Department
              </label>

             <select
  value={editForm.departmentId}
  onChange={(e) => {
    const departmentId = e.target.value;

    setEditForm({
      ...editForm,
      departmentId,
      serviceId: "",
    });

    loadServicesByDepartment(
      departmentId,
      "edit"
    );
  }}
>

                <option value="">
                  Select department
                </option>

                {departments.map(
                  (department) => (
                    <option
                      key={department.id}
                      value={department.id}
                    >
                      {department.building?.name
                        ? `${department.building.name} → `
                        : ""}
                      {department.name}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* SERVICE */}

<div className="desk-form-group">

  <label>
    Service
  </label>

  <select
    value={editForm.serviceId}
    disabled={
      !editForm.departmentId ||
      loadingServices
    }
    onChange={(e) =>
      setEditForm({
        ...editForm,
        serviceId: e.target.value,
      })
    }
  >

    <option value="">
      {loadingServices
        ? "Loading services..."
        : !editForm.departmentId
        ? "Select department first"
        : editServices.length === 0
        ? "No services available"
        : "Select service"}
    </option>

    {editServices.map((service) => (
      <option
        key={service.id}
        value={service.id}
      >
        {service.name}
      </option>
    ))}

  </select>

</div>

            {/* SAVE */}

            <div className="desk-form-action">

              <button
                className="desk-btn desk-btn-primary"
                onClick={updateDesk}
                disabled={updating}
              >
                {updating
                  ? "SAVING..."
                  : "SAVE"}
              </button>

              {/* CANCEL */}

              <button
                className="desk-btn desk-btn-secondary"
                onClick={() => {
                  setShowEdit(false);
                  setEditingDesk(null);

                  setEditForm({
                    name: "",
                    departmentId: "",
                    serviceId: "",
                  });
                }}
                disabled={updating}
              >
                CANCEL
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          ASSIGN EMPLOYEE
      ===================================================== */}

      {showAssign && assigningDesk && (
        <div className="desk-form-card">

          <div className="desk-form-header">

            <div>

              <span className="desk-section-label">
                DESK ASSIGNMENT
              </span>

              <h2>
                Assign Employee
              </h2>

              <p>
                Choose an employee to work at this desk.
              </p>

            </div>

            <div className="assigning-desk-badge">
              {assigningDesk.name}
            </div>

          </div>

          <div className="desk-form-row">

            {/* EMPLOYEE */}

            <div className="desk-form-group desk-form-group-wide">

              <label>
                Employee
              </label>

              <select
                value={selectedEmployee}
                onChange={(e) =>
                  setSelectedEmployee(
                    e.target.value
                  )
                }
              >

                <option value="">
                  Select employee
                </option>

               {employees
  .filter(
    (employee) =>
      employee.service?.id ===
      assigningDesk?.service?.id
  )
  .map((employee) => (
    <option
      key={employee.id}
      value={employee.id}
    >
      {employee.user?.name || "Unknown"}
      {" — "}
      {employee.service?.name || "No service"}
    </option>
  ))}

              </select>

            </div>

            {/* ASSIGN */}

            <div className="desk-form-action">

              <button
                className="desk-btn desk-btn-success"
                onClick={assignEmployee}
                disabled={assigning}
              >
                {assigning
                  ? "ASSIGNING..."
                  : "ASSIGN"}
              </button>

              {/* CANCEL */}

              <button
                className="desk-btn desk-btn-secondary"
                onClick={() => {
                  setShowAssign(false);
                  setAssigningDesk(null);
                  setSelectedEmployee("");
                }}
                disabled={assigning}
              >
                CANCEL
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          DESKS
      ===================================================== */}

      {loading ? (

        <div className="desk-loading-card">

          <div className="desk-spinner"></div>

          <p>
            Loading desks...
          </p>

        </div>

      ) : desks.length === 0 ? (

        <div className="desk-empty-card">

          <div className="desk-empty-icon">
            ▦
          </div>

          <h3>
            No desks configured
          </h3>

          <p>
            Create your first desk to start managing your workspace.
          </p>

          <button
            className="desk-btn desk-btn-primary"
            onClick={() =>
              setShowCreate(true)
            }
          >
            + CREATE DESK
          </button>

        </div>

      ) : (

        <div className="desk-table-card">

          <div className="desk-table-header">

            <div>

              <span className="desk-section-label">
                DESK DIRECTORY
              </span>

              <h2>
                All Desks
              </h2>

            </div>

            <div className="desk-count">
              {desks.length}{" "}
              {desks.length === 1
                ? "Desk"
                : "Desks"}
            </div>

          </div>

          <div className="desk-table-wrapper">

            <table className="desk-table">

              <thead>

                <tr>

                  <th>
                    Desk
                  </th>

                  <th>
                    Building
                  </th>

                  <th>
                    Department
                  </th>

                  <th>
                    Employee
                  </th>

                  <th>
                    Service
                  </th>

                  <th>
                    Employee Service
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {desks.map((desk) => (

                  <tr key={desk.id}>

                    {/* DESK */}

                    <td>

                      <div className="desk-name-cell">

                        <div className="desk-icon">
                          D
                        </div>

                        <div>

                          <strong>
                            {desk.name}
                          </strong>

                          <span>
                            ID: {desk.id.slice(0, 8)}
                          </span>

                        </div>

                      </div>

                    </td>

                    {/* BUILDING */}

                    <td>

                      <span className="desk-location">
                        {desk.department?.building
                          ?.name || "-"}
                      </span>

                    </td>

                    {/* DEPARTMENT */}

                    <td>

                      <span className="desk-department">
                        {desk.department?.name ||
                          "-"}
                      </span>

                    </td>

                    {/* EMPLOYEE */}

                    <td>

                      {desk.employee?.user ? (

                        <div className="desk-employee-cell">

                          <div className="employee-avatar">
                            {desk.employee.user.name
                              ?.charAt(0)
                              .toUpperCase() || "?"}
                          </div>

                          <div>

                            <strong>
                              {
                                desk.employee.user.name
                              }
                            </strong>

                            <span>
                              {
                                desk.employee.user.email
                              }
                            </span>

                          </div>

                        </div>

                      ) : (

                        <span className="not-assigned">
                          Not assigned
                        </span>

                      )}

                    </td>

                    {/* DESK SERVICE */}

                    <td>

                      {desk.service ? (

                        <span className="service-badge">
                          {desk.service.name}
                        </span>

                      ) : (

                        <span className="not-assigned">
                          No service
                        </span>

                      )}

                    </td>

                    {/* EMPLOYEE SERVICE */}

                    <td>

                      {desk.employee?.service ? (

                        <span className="employee-service-badge">
                          {
                            desk.employee.service.name
                          }
                        </span>

                      ) : (

                        <span className="not-assigned">
                          Not assigned
                        </span>

                      )}

                    </td>

                    {/* STATUS */}

                    <td>

                      <select
                        className={`desk-status-select desk-status-${desk.status.toLowerCase()}`}
                        value={desk.status}
                        onChange={(e) =>
                          changeStatus(
                            desk.id,
                            e.target
                              .value as
                              | "AVAILABLE"
                              | "BUSY"
                              | "OFFLINE"
                          )
                        }
                      >

                        <option value="AVAILABLE">
                          AVAILABLE
                        </option>

                        <option value="BUSY">
                          BUSY
                        </option>

                        <option value="OFFLINE">
                          OFFLINE
                        </option>

                      </select>

                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="desk-actions">

                        {/* ASSIGN */}

                        <button
                          className="desk-action-btn desk-action-assign"
                          onClick={() =>
                            openAssignDesk(
                              desk
                            )
                          }
                        >
                          ASSIGN
                        </button>

                        {/* RELEASE */}

                        {desk.employee && (
                          <button
                            className="desk-action-btn desk-action-release"
                            onClick={() =>
                              releaseEmployee(
                                desk.employee!.id
                              )
                            }
                          >
                            RELEASE
                          </button>
                        )}

                        {/* EDIT */}

                        <button
                          className="desk-action-btn desk-action-edit"
                          onClick={() =>
                            openEditDesk(
                              desk
                            )
                          }
                        >
                          EDIT
                        </button>

                        {/* DELETE */}

                        <button
                          className="desk-action-btn desk-action-delete"
                          onClick={() =>
                            deleteDesk(
                              desk.id
                            )
                          }
                        >
                          DELETE
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}