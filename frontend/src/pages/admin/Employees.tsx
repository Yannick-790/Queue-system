import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/employee.css";

interface Employee {
  id: string;
  employeeNumber?: string | null;

  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };

  department?: {
    id: string;
    name: string;
  } | null;

  service?: {
    id: string;
    name: string;
  } | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;

  employee?: {
    id: string;
    departmentId: string | null;
    serviceId: string | null;
    employeeNumber: string | null;
  } | null;
}

interface Department {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

type EmployeeMode = "ASSIGN" | "CREATE";

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);

  // --------------------------------------------------
  // MODE
  // --------------------------------------------------

  const [mode, setMode] = useState<EmployeeMode>("ASSIGN");

  // --------------------------------------------------
  // EXISTING USER
  // --------------------------------------------------

  const [selectedUser, setSelectedUser] = useState("");

  // --------------------------------------------------
  // NEW USER
  // --------------------------------------------------

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");

  // --------------------------------------------------
  // EMPLOYEE ASSIGNMENT
  // --------------------------------------------------

  const [selectedDepartment, setSelectedDepartment] =
    useState("");

  const [selectedService, setSelectedService] =
    useState("");

  const [employeeNumber, setEmployeeNumber] =
    useState("");

  const [error, setError] = useState("");

  // ==================================================
  // LOAD EMPLOYEES
  // ==================================================

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/employees");

      setEmployees(res.data.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);

      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // OPEN ADD EMPLOYEE
  // ==================================================

  async function openAddEmployee() {
    try {
      setError("");

      const [usersRes, departmentsRes] =
        await Promise.all([
          api.get("/employees/available-users"),
          api.get("/company/departments"),
        ]);

      setUsers(usersRes.data.data || []);
      setDepartments(
        departmentsRes.data.data ||
          departmentsRes.data ||
          []
      );

      // Default mode
      setMode("ASSIGN");

      // Reset form
      resetForm();

      setShowAddForm(true);
    } catch (error) {
      console.error(
        "Error loading employee setup:",
        error
      );

      setError(
        "Failed to load employee setup data."
      );
    }
  }

  // ==================================================
  // RESET FORM
  // ==================================================

  function resetForm() {
    setSelectedUser("");

    setName("");
    setEmail("");
    setPassword("");
    setRole("EMPLOYEE");

    setSelectedDepartment("");
    setSelectedService("");
    setEmployeeNumber("");

    setServices([]);
  }

  // ==================================================
  // CHANGE MODE
  // ==================================================

  function changeMode(newMode: EmployeeMode) {
    setMode(newMode);
    setError("");

    setSelectedUser("");

    setName("");
    setEmail("");
    setPassword("");
    setRole("EMPLOYEE");
  }

  // ==================================================
  // LOAD SERVICES
  // ==================================================

  async function loadServices(departmentId: string) {
    setSelectedDepartment(departmentId);
    setSelectedService("");
    setServices([]);

    if (!departmentId) {
      return;
    }

    try {
      const res = await api.get(
        `/company/departments/${departmentId}/services`
      );

      setServices(
        res.data.data ||
          res.data ||
          []
      );
    } catch (error) {
      console.error(
        "Error loading services:",
        error
      );

      setServices([]);

      setError(
        "Failed to load services for this department."
      );
    }
  }

  // ==================================================
  // ASSIGN EXISTING USER
  // ==================================================

  async function assignExistingUser() {
  if (!selectedUser) {
    setError("Please select a user.");
    return;
  }

  if (!selectedDepartment) {
    setError("Please select a department.");
    return;
  }

  if (!selectedService) {
    setError("Please select a service.");
    return;
  }

  // Find the selected user from /employees/available-users
  const user = users.find(
    (u: any) => u.id === selectedUser
  );

  if (!user) {
    setError("Selected user was not found.");
    return;
  }

  // Existing registered user must already have an employee record
  if (!user.employee?.id) {
    setError(
      "This user does not have an employee record. Use Create New Employee instead."
    );
    return;
  }

  try {
    setSaving(true);
    setError("");

    const payload: {
      departmentId: string;
      serviceId: string;
      employeeNumber?: string;
    } = {
      departmentId: selectedDepartment,
      serviceId: selectedService,
    };

    if (employeeNumber.trim()) {
      payload.employeeNumber =
        employeeNumber.trim();
    }

    // IMPORTANT:
    // ASSIGN existing employee
    await api.put(
      `/employees/${user.employee.id}/assign`,
      payload
    );

    resetForm();

    setShowAddForm(false);

    await loadEmployees();

  } catch (error: any) {
    console.error(
      "Error assigning employee:",
      error
    );

    setError(
      error?.response?.data?.error ||
      "Failed to assign user."
    );

  } finally {
    setSaving(false);
  }
}

  // ==================================================
  // CREATE NEW EMPLOYEE
  // ==================================================

 async function createNewEmployee() {
  if (!name.trim()) {
    setError("Please enter the employee name.");
    return;
  }

  if (!email.trim()) {
    setError("Please enter the employee email.");
    return;
  }

  if (!password) {
    setError("Please enter a password.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  if (!selectedDepartment) {
    setError("Please select a department.");
    return;
  }

  if (!selectedService) {
    setError("Please select a service.");
    return;
  }

  try {
    setSaving(true);
    setError("");

    const payload: {
      name: string;
      email: string;
      password: string;
      role: string;
      departmentId: string;
      serviceId: string;
      employeeNumber?: string;
    } = {
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      departmentId: selectedDepartment,
      serviceId: selectedService,
    };

    if (employeeNumber.trim()) {
      payload.employeeNumber =
        employeeNumber.trim();
    }

    await api.post(
      "/employees/create",
      payload
    );

    resetForm();

    setShowAddForm(false);

    await loadEmployees();

  } catch (error: any) {
    console.error(
      "Error creating employee:",
      error
    );

    setError(
      error?.response?.data?.error ||
      "Failed to create employee."
    );

  } finally {
    setSaving(false);
  }
}

  // ==================================================
  // SUBMIT
  // ==================================================

  async function submitEmployee() {
    if (mode === "ASSIGN") {
      await assignExistingUser();
      return;
    }

    await createNewEmployee();
  }

  // ==================================================
  // DELETE EMPLOYEE
  // ==================================================

  async function deleteEmployee(
    employeeId: string
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(
        `/employees/${employeeId}`
      );

      await loadEmployees();
    } catch (error: any) {
      console.error(
        "Error deleting employee:",
        error
      );

      setError(
        error?.response?.data?.error ||
          "Failed to remove employee."
      );
    }
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="employees-page">
        <div className="employees-loading">
          <div className="employees-spinner"></div>

          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="employees-page">

      {/* HEADER */}

      <section className="employees-header">

        <div>
          <span className="employees-eyebrow">
            ORGANIZATION
          </span>

          <h1>Employees</h1>

          <p>
            Manage your organization's employees,
            departments and service assignments.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={openAddEmployee}
        >
          <span>+</span>
          Add Employee
        </button>

      </section>

      {/* ERROR */}

      {error && (
        <div className="employee-error">
          <strong>
            Something went wrong
          </strong>

          <span>{error}</span>
        </div>
      )}

      {/* ADD EMPLOYEE */}

      {showAddForm && (
        <section className="employee-form-panel">

          {/* FORM HEADER */}

          <div className="employee-form-header">

            <div>
              <h2>
                {mode === "ASSIGN"
                  ? "Assign Employee"
                  : "Create Employee"}
              </h2>

              <p>
                {mode === "ASSIGN"
                  ? "Assign an existing company user to a department and service."
                  : "Create a new company user and assign them to a department and service."}
              </p>
            </div>

            <button
              className="form-close"
              onClick={() => {
                setShowAddForm(false);
                setError("");
                resetForm();
              }}
            >
              ×
            </button>

          </div>

          {/* MODE SWITCH */}

          <div className="employee-mode-switch">

            <button
              type="button"
              className={
                mode === "ASSIGN"
                  ? "mode-btn active"
                  : "mode-btn"
              }
              onClick={() =>
                changeMode("ASSIGN")
              }
            >
              Assign Existing User
            </button>

            <button
              type="button"
              className={
                mode === "CREATE"
                  ? "mode-btn active"
                  : "mode-btn"
              }
              onClick={() =>
                changeMode("CREATE")
              }
            >
              Create New Employee
            </button>

          </div>

          {/* FORM */}

          <div className="employee-form-grid">

            {/* ====================================== */}
            {/* EXISTING USER */}
            {/* ====================================== */}

            {mode === "ASSIGN" && (
              <div className="form-group">

                <label>
                  User
                  <span>*</span>
                </label>

                <select
                  value={selectedUser}
                  onChange={(e) =>
                    setSelectedUser(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    {users.length === 0
                      ? "No available users"
                      : "Select user"}
                  </option>

                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name} —{" "}
                      {user.email} (
                      {user.role})
                    </option>
                  ))}

                </select>

                {users.length === 0 && (
                  <small>
                    No registered users are
                    currently available for
                    assignment.
                  </small>
                )}

              </div>
            )}

            {/* ====================================== */}
            {/* CREATE USER */}
            {/* ====================================== */}

            {mode === "CREATE" && (
              <>

                <div className="form-group">

                  <label>
                    Full Name
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Employee full name"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Email
                    <span>*</span>
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="employee@example.com"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Password
                    <span>*</span>
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Temporary password"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Role
                    <span>*</span>
                  </label>

                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value)
                    }
                  >

                    <option value="EMPLOYEE">
                      Employee
                    </option>

                    <option value="MANAGER">
                      Manager
                    </option>

                    <option value="SECURITY">
                      Security
                    </option>

                  </select>

                  <small>
                    ADMIN cannot be created from
                    this employee form.
                  </small>

                </div>

              </>
            )}

            {/* ====================================== */}
            {/* DEPARTMENT */}
            {/* ====================================== */}

            <div className="form-group">

              <label>
                Department
                <span>*</span>
              </label>

              <select
                value={selectedDepartment}
                onChange={(e) =>
                  loadServices(
                    e.target.value
                  )
                }
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
                      {department.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* ====================================== */}
            {/* SERVICE */}
            {/* ====================================== */}

            <div className="form-group">

              <label>
                Service
                <span>*</span>
              </label>

              <select
                value={selectedService}
                onChange={(e) =>
                  setSelectedService(
                    e.target.value
                  )
                }
                disabled={
                  !selectedDepartment
                }
              >

                <option value="">
                  {!selectedDepartment
                    ? "Select department first"
                    : services.length === 0
                    ? "No services available"
                    : "Select service"}
                </option>

                {services.map((service) => (
                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.name}
                  </option>
                ))}

              </select>

            </div>

            {/* ====================================== */}
            {/* EMPLOYEE NUMBER */}
            {/* ====================================== */}

            <div className="form-group">

              <label>
                Employee Number
                <small>
                  Optional
                </small>
              </label>

              <input
                type="text"
                value={employeeNumber}
                onChange={(e) =>
                  setEmployeeNumber(
                    e.target.value
                  )
                }
                placeholder="e.g. EMP-001"
                maxLength={50}
              />

            </div>

          </div>

          {/* ACTIONS */}

          <div className="employee-form-actions">

            <button
              className="btn-secondary"
              onClick={() => {
                setShowAddForm(false);
                setError("");
                resetForm();
              }}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="btn-primary"
              onClick={submitEmployee}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : mode === "ASSIGN"
                ? "Assign Employee"
                : "Create Employee"}
            </button>

          </div>

        </section>
      )}

      {/* EMPLOYEE LIST */}

      <section className="table-panel">

        <div className="table-heading">

          <div>

            <h2>
              Employee Directory
            </h2>

            <p>
              {employees.length}{" "}
              {employees.length === 1
                ? "employee"
                : "employees"}
            </p>

          </div>

        </div>

        {employees.length === 0 ? (

          <div className="employees-empty">

            <div className="empty-icon">
              👥
            </div>

            <h3>
              No employees yet
            </h3>

            <p>
              Create a new employee or
              assign an existing company user.
            </p>

            <button
              className="btn-primary"
              onClick={openAddEmployee}
            >
              + Add Employee
            </button>

          </div>

        ) : (

          <div className="employee-table-wrapper">

            <table className="employee-table">

              <thead>

                <tr>
                  <th>Employee</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Service</th>
                  <th>Employee No.</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {employees.map((emp) => (

                  <tr key={emp.id}>

                    <td>

                      <div className="user-cell">

                        <div className="avatar">

                          {(
                            emp.user?.name ||
                            "?"
                          )
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <span className="user-name">
                            {emp.user?.name ||
                              "N/A"}
                          </span>

                          <span className="user-email">
                            {emp.user?.email ||
                              "N/A"}
                          </span>

                        </div>

                      </div>

                    </td>

                    <td>

                      <span className="badge badge-role">
                        {emp.user?.role ||
                          "N/A"}
                      </span>

                    </td>

                    <td>
                      {emp.department?.name ||
                        "Unassigned"}
                    </td>

                    <td>
                      {emp.service?.name ||
                        "Unassigned"}
                    </td>

                    <td>
                      {emp.employeeNumber ||
                        "—"}
                    </td>

                    <td>

                      <button
                        className="action-btn-danger"
                        onClick={() =>
                          deleteEmployee(
                            emp.id
                          )
                        }
                      >
                        Remove
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}