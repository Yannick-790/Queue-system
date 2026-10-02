import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning";

  loading?: boolean;

  fullWidth?: boolean;
}


export default function Button({

  children,

  variant = "primary",

  loading = false,

  fullWidth = false,

  disabled,

  ...props

}: ButtonProps) {


  return (

    <button

      disabled={disabled || loading}

      {...props}

      style={{

        padding:"12px 20px",

        borderRadius:"8px",

        border:"none",

        cursor:
          disabled || loading
            ? "not-allowed"
            : "pointer",

        fontWeight:600,

        fontSize:"15px",

        width:
          fullWidth
            ? "100%"
            : "auto",

        opacity:
          disabled || loading
            ? 0.6
            : 1,


        background:

          variant === "danger"
            ? "#dc2626"

            : variant === "success"
            ? "#16a34a"

            : variant === "warning"
            ? "#d97706"

            : variant === "secondary"
            ? "#e5e7eb"

            : "#2563eb",


        color:

          variant === "secondary"
            ? "#111827"
            : "white",


        transition:"0.2s",

      }}

    >

      {
        loading
          ? "Loading..."
          : children
      }


    </button>

  );

}