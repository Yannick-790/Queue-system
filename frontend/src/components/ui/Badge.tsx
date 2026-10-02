import type { ReactNode } from "react";
import clsx from "clsx";
import "../../styles/components.css";


export type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral"
  | "primary";


export type BadgeSize =
  | "sm"
  | "md"
  | "lg";


interface BadgeProps {

  children: ReactNode;

  variant?: BadgeVariant;

  size?: BadgeSize;

  rounded?: boolean;

  dot?: boolean;

  icon?: ReactNode;

  className?: string;

}


export default function Badge({

  children,

  variant = "neutral",

  size = "md",

  rounded = true,

  dot = false,

  icon,

  className,

}: BadgeProps) {


  return (

    <span

      className={clsx(

        "badge",

        `badge-${variant}`,

        `badge-${size}`,

        {
          "badge-rounded": rounded,
          "badge-dot": dot,
        },

        className

      )}

    >


      {dot && (

        <span
          className="badge-indicator"
        />

      )}



      {icon && (

        <span
          className="badge-icon"
        >
          {icon}
        </span>

      )}



      <span>
        {children}
      </span>


    </span>

  );

}