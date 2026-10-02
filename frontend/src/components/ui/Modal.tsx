import type { ReactNode } from "react";


interface ModalProps {

  open: boolean;

  title?: string;

  children: ReactNode;

  onClose: () => void;

  width?: string;

}


export default function Modal({

  open,

  title,

  children,

  onClose,

  width = "500px"

}: ModalProps) {


  if (!open) return null;


  return (

    <div

      style={{

        position:"fixed",

        inset:0,

        background:"rgba(15,23,42,0.55)",

        display:"flex",

        justifyContent:"center",

        alignItems:"center",

        zIndex:2000,

        padding:"20px"

      }}

      onClick={onClose}

    >


      <div

        style={{

          background:"#ffffff",

          width,

          maxWidth:"100%",

          borderRadius:"16px",

          boxShadow:
          "0 20px 50px rgba(0,0,0,0.25)",

          overflow:"hidden",

          animation:"modalIn .2s ease"

        }}

        onClick={(e)=>e.stopPropagation()}

      >



        <div

          style={{

            display:"flex",

            justifyContent:"space-between",

            alignItems:"center",

            padding:"18px 24px",

            borderBottom:
            "1px solid #e5e7eb"

          }}

        >


          <h2

            style={{

              margin:0,

              fontSize:"20px",

              fontWeight:700,

              color:"#111827"

            }}

          >

            {title}

          </h2>



          <button

            onClick={onClose}

            style={{

              border:"none",

              background:"transparent",

              fontSize:"24px",

              cursor:"pointer",

              color:"#64748b"

            }}

          >

            ×

          </button>


        </div>




        <div

          style={{

            padding:"24px"

          }}

        >

          {children}

        </div>



      </div>



      <style>

        {`

        @keyframes modalIn {

          from {

            opacity:0;

            transform:translateY(-15px) scale(.98);

          }

          to {

            opacity:1;

            transform:translateY(0) scale(1);

          }

        }

        `}

      </style>


    </div>

  );

}