import type { ReactNode } from "react";
import clsx from "clsx";
import "../../styles/components.css";


interface EmptyStateProps {

  title: string;

  message?: string;

  icon?: ReactNode;

  action?: ReactNode;

  className?: string;

}



export default function EmptyState({

  title,

  message = "No data available.",

  icon,

  action,

  className,

}: EmptyStateProps) {


  return (

    <section

      className={clsx(
        "empty-state",
        className
      )}

    >


      {icon && (

        <div className="empty-state-icon">

          {icon}

        </div>

      )}



      <h3 className="empty-state-title">

        {title}

      </h3>



      <p className="empty-state-message">

        {message}

      </p>




      {action && (

        <div className="empty-state-action">

          {action}

        </div>

      )}



    </section>

  );

}