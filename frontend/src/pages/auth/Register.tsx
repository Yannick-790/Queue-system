import { useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "../../styles/auth.css";

type Role =
  | "ADMIN"
  | "MANAGER"
  | "SECURITY"
  | "EMPLOYEE";

export default function Register() {

  const [mode, setMode] =
    useState<"owner" | "employee">("owner");

  const [role, setRole] =
    useState<Role>("ADMIN");

  const [form, setForm] = useState({

    name: "",
    email: "",
    password: "",
    companyName: "",
    companyCode: "",
    industry: ""

  });

  const [error, setError] = useState("");


  function change(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    setForm({

      ...form,
      [e.target.name]: e.target.value

    });

  }


  function validatePassword(password: string) {

    return (

      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)

    );

  }


  async function register() {

    setError("");


    if (!form.name) {

      setError(
        "Your name is required."
      );

      return;

    }


    if (!form.email) {

      setError(
        "Email is required."
      );

      return;

    }


    if (!validatePassword(form.password)) {

      setError(
        "Password must contain uppercase, lowercase, number and symbol."
      );

      return;

    }


    try {

      // ==========================================
      // ADMIN REGISTRATION
      // ADMIN CREATES A NEW COMPANY
      // ==========================================

      if (role === "ADMIN") {

        if (!form.companyName) {

          setError(
            "Company name is required."
          );

          return;

        }


        if (!form.industry) {

          setError(
            "Industry is required."
          );

          return;

        }


        const res = await api.post(

          "/auth/register",

          {

            name: form.name,

            email: form.email,

            password: form.password,

            // IMPORTANT
            role: "ADMIN",

            companyName: form.companyName,

            industry: form.industry

          }

        );


        console.log(
          "ADMIN REGISTRATION:",
          res.data
        );


        alert(
          "Organization created successfully. Please verify your email."
        );

      }


      // ==========================================
      // MANAGER / SECURITY / EMPLOYEE
      // JOIN EXISTING COMPANY
      // ==========================================

      else {

        if (!form.companyName) {

          setError(
            "Company name is required."
          );

          return;

        }


        if (!form.companyCode) {

          setError(
            "Company code is required."
          );

          return;

        }


        const res = await api.post(

          "/auth/register",

          {

            name: form.name,

            email: form.email,

            password: form.password,

            // IMPORTANT
            // This sends the selected role
            role: role,

            companyName: form.companyName,

            companyCode: form.companyCode

          }

        );


        console.log(
          "STAFF REGISTRATION:",
          res.data
        );


        alert(
          `${role} account created successfully. Please verify your email.`
        );

      }


    }

    catch (err: any) {

      setError(

        err.response?.data?.error ||

        err.response?.data?.message ||

        "Registration failed"

      );

    }

  }


  // ==========================================
  // ROLE CHANGE
  // ==========================================

  function changeRole(
    selectedRole: Role
  ) {

    setRole(selectedRole);

    setError("");


    // ADMIN creates company
    if (selectedRole === "ADMIN") {

      setMode("owner");

    }

    // Other roles join company
    else {

      setMode("employee");

    }

  }


  return (

    <div className="auth-page">


      <div className="auth-card">


        <div className="auth-logo">

          Q

        </div>


        <h2>

  {mode === "owner"

    ?

    "Create Organization"

    :

    "Join Organization"

  }

</h2>


        <p>

  {mode === "owner"

    ?

    "Register your company account"

    :

    `Register as ${role.toLowerCase()}`

  }

</p>


        {
          error &&

          <div className="error-box">

            {error}

          </div>
        }


        {/* =====================================
            ROLE SELECTION
        ===================================== */}

        <select

          value={role}

          onChange={(e) => {

            changeRole(
              e.target.value as Role
            );

          }}

        >

          <option value="ADMIN">

            Admin — Create Organization

          </option>


          <option value="MANAGER">

            Manager

          </option>


          <option value="SECURITY">

            Security

          </option>


          <option value="EMPLOYEE">

            Employee

          </option>

        </select>


        <input

          name="name"

          placeholder="Your full name"

          value={form.name}

          onChange={change}

        />


        <input

          name="email"

          placeholder="Work email address"

          type="email"

          value={form.email}

          onChange={change}

        />


        <input

          name="password"

          placeholder="Password (Example: QueueFlow@2026)"

          type="password"

          value={form.password}

          onChange={change}

        />


        {/* =====================================
            ADMIN COMPANY NAME
        ===================================== */}

        {mode === "owner" && (

          <input

            name="companyName"

            placeholder="Organization / Company name"

            value={form.companyName}

            onChange={change}

          />

        )}


        {/* =====================================
            ADMIN INDUSTRY
        ===================================== */}

        {mode === "owner" && (

          <input

            name="industry"

            placeholder="Industry (e.g. Banking, Hospital, Government)"

            value={form.industry}

            onChange={change}

          />

        )}


        {/* =====================================
            OTHER ROLES
            EXISTING COMPANY
        ===================================== */}

        {role !== "ADMIN" && (

          <>

            <input

              name="companyName"

              placeholder="Organization / Company name"

              value={form.companyName}

              onChange={change}

            />


            <input

              name="companyCode"

              placeholder="Company invite code"

              value={form.companyCode}

              onChange={change}

            />

          </>

        )}


        <button onClick={register}>

          {role === "ADMIN"

            ?

            "Create Account"

            :

            "Join Company"

          }

        </button>


        {/* =====================================
            KEEP YOUR EXISTING MODE SWITCH
        ===================================== */}

        <p>

          {

            role === "ADMIN"

              ?

              ""

              :

              "Want to create a company?"

          }

        </p>


        <button

          type="button"

          onClick={() => {

            if (role === "ADMIN") {

              changeRole("EMPLOYEE");

            }

            else {

              changeRole("ADMIN");

            }

          }}

        >

          {

            role === "ADMIN"

              ?

              "Employee Registration"

              :

              "Company Registration"

          }

        </button>


        <p>

          Already have an account?


          {" "}


          <Link to="/login">

            Login

          </Link>

        </p>


      </div>

    </div>

  );

}