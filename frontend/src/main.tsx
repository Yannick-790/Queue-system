import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./styles/auth.css";
import "./styles/landing.css";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/forms.css";
import "./styles/tables.css";
import "./styles/components.css";
import "./styles/setup.css";
import "./styles/employee.css";


const rootElement = document.getElementById("root");


if (!rootElement) {
  throw new Error(
    "Root element not found. Check index.html"
  );
}


createRoot(rootElement).render(

  <StrictMode>

    <AuthProvider>

      <App />

    </AuthProvider>

  </StrictMode>

);