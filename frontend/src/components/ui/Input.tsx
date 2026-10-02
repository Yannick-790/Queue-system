import type {
  InputHTMLAttributes
} from "react";


interface InputProps
extends InputHTMLAttributes<HTMLInputElement>{

  label?: string;

  error?: string;

}


export default function Input({

  label,

  error,

  ...props

}:InputProps){


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



<input

{...props}

style={{

padding:"12px 14px",

border:
error
?
"1px solid #dc2626"
:
"1px solid #d1d5db",

borderRadius:"8px",

fontSize:"15px",

outline:"none",

background:"white",

}}

/>



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