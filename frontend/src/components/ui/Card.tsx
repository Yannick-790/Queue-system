import type { ReactNode } from "react";


interface CardProps {

  children: ReactNode;

  title?: string;

  className?: string;

}


export default function Card({

  children,

  title,

  className,

}:CardProps){


return (

<div

className={className}

style={{

background:"#fff",

borderRadius:"12px",

padding:"20px",

boxShadow:
"0 2px 10px rgba(0,0,0,0.08)",

border:
"1px solid #e5e7eb",

}}

>


{
title && (

<h3

style={{

fontSize:"18px",

fontWeight:700,

marginBottom:"15px"

}}

>

{title}

</h3>

)

}


{children}


</div>

);

}