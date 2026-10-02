import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();

  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function change(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function login(e?: React.FormEvent) {
    e?.preventDefault();

    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // ==================================================
      // 1. LOGIN
      // ==================================================

      console.log("LOGIN: sending request...");

      const res = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data?.data?.token;

      if (!token) {
        throw new Error(
          "Login succeeded, but the server did not return an authentication token."
        );
      }

      // ==================================================
      // 2. SAVE TOKEN
      // ==================================================

      localStorage.setItem("token", token);

      console.log("TOKEN SAVED");

      // ==================================================
      // 3. GET ROLE FROM LOGIN RESPONSE
      // ==================================================

      const role =
        res.data?.data?.user?.role ??
        res.data?.data?.role ??
        res.data?.user?.role ??
        res.data?.role;

      console.log("LOGGED USER ROLE:", role);

      if (!role) {
        throw new Error(
          "Login succeeded, but the server did not return the user's role."
        );
      }

      // ==================================================
      // 4. IMPORTANT
      // LOAD USER INTO AuthContext BEFORE NAVIGATION
      // ==================================================

      console.log("REFRESHING AUTH USER...");

      await refreshUser();

      console.log("AUTH USER REFRESHED");

      // ==================================================
      // 5. ADMIN
      // ==================================================

      if (role === "ADMIN") {
        console.log("ADMIN LOGIN");

        console.log("CHECKING COMPANY SETUP...");

        const setupRes = await api.get(
          "/company/setup-status"
        );

        console.log(
          "SETUP RESPONSE:",
          setupRes.data
        );

        const setupCompleted =
          setupRes.data?.data?.setupCompleted;

        if (typeof setupCompleted !== "boolean") {
          console.error(
            "Invalid setup-status response:",
            setupRes.data
          );

          throw new Error(
            "Server returned an invalid company setup status."
          );
        }

        console.log(
          "SETUP COMPLETED:",
          setupCompleted
        );

        // ADMIN HAS NOT FINISHED SETUP
        if (!setupCompleted) {
          console.log(
            "Company setup incomplete → /setup/company"
          );

          navigate("/setup/company", {
            replace: true,
          });

          return;
        }

        // ADMIN HAS FINISHED SETUP
        console.log(
          "Company setup complete → /admin"
        );

        navigate("/admin", {
          replace: true,
        });

        return;
      }

      // ==================================================
      // 6. MANAGER
      // ==================================================

      if (role === "MANAGER") {
        console.log("MANAGER LOGIN");

        navigate("/manager", {
          replace: true,
        });

        return;
      }

      // ==================================================
      // 7. SECURITY
      // ==================================================

      if (role === "SECURITY") {
        console.log("SECURITY LOGIN");

        navigate("/security", {
          replace: true,
        });

        return;
      }

      // ==================================================
      // 8. EMPLOYEE
      // ==================================================

      if (role === "EMPLOYEE") {
        console.log("EMPLOYEE LOGIN");
        console.log("EMPLOYEE → /desk");

        navigate("/desk", {
          replace: true,
        });

        return;
      }

      // ==================================================
      // 9. UNKNOWN ROLE
      // ==================================================

      throw new Error(
        `Unknown user role: ${role}`
      );

    } catch (err: any) {
      console.error(
        "LOGIN FLOW ERROR:",
        err
      );

      const backendError =
        err?.response?.data?.error ||
        err?.response?.data?.message;

      if (backendError) {
        setError(backendError);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to login. Please try again."
        );
      }

      // ==================================================
      // REMOVE TOKEN ONLY IF AUTHENTICATION FAILED
      // ==================================================

      if (
        !err?.response ||
        err?.response?.status === 401
      ) {
        localStorage.removeItem("token");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* LOGO */}

        <div className="auth-logo">
          Q
        </div>

        {/* TITLE */}

        <h1>
          Welcome Back
        </h1>

        <p>
          Login to your QueueFlow account
        </p>

        {/* ERROR */}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={login}>

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={change}
            disabled={loading}
            autoComplete="email"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={change}
            disabled={loading}
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login"}
          </button>

        </form>

        {/* FORGOT PASSWORD */}

        <Link to="/forgot-password">
          Forgot password?
        </Link>

        {/* REGISTER */}

        <p>
          Don't have an account?

          <Link to="/register">
            {" "}Register
          </Link>
        </p>

      </div>

    </div>
  );
}