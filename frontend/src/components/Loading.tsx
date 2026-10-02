import type { ReactNode } from "react";
import "../../styles/components.css";


interface LoadingProps {

  text?: string;

  size?: "small" | "medium" | "large";

  fullScreen?: boolean;

  children?: ReactNode;

}



export default function Loading({

  text = "Loading...",

  size = "medium",

  fullScreen = false,

  children,

}: LoadingProps) {


  return (

    <div

      className={
        fullScreen
          ? "loading-container loading-fullscreen"
          : "loading-container"
      }

    >


      <div

        className={`loading-spinner loading-${size}`}

      />



      {text && (

        <p className="loading-text">

          {text}

        </p>

      )}



      {children && (

        <div className="loading-content">

          {children}

        </div>

      )}



    </div>

  );

}