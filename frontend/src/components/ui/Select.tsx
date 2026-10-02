import type {
  SelectHTMLAttributes,
  ReactNode
} from "react";


interface SelectProps
extends SelectHTMLAttributes<HTMLSelectElement>{

  label?: string;

  children: ReactNode;

  error?: string;

}


export default function Select({

  label,

  children,

  error,

  ...props

}:SelectProps){


return (

<div
style={{
display:"flex",
flexDirection:"column",
gap:"6px",
marginBottom:"15px"
}}
>


{
label && (

<label
style={{
fontWeight:600,
fontSize:"14px"
}}
>

{label}

</label>

)

}



<select

{...props}

style={{

padding:"12px",

border:
error
?
"1px solid #dc2626"
:
"1px solid #d1d5db",

borderRadius:"8px",

fontSize:"15px",

background:"white"

}}

>

{children}

</select>



{
error && (

<span
style={{
color:"#dc2626",
fontSize:"13px"
}}
>

{error}

</span>

)

}


</div>

);

}