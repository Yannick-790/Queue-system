import Button from "./Button";


interface ConfirmDialogProps {

  open:boolean;

  title?:string;

  message:string;

  onConfirm:()=>void;

  onCancel:()=>void;

}


export default function ConfirmDialog({

open,

title="Confirm Action",

message,

onConfirm,

onCancel

}:ConfirmDialogProps){


if(!open) return null;


return (

<div

style={{

position:"fixed",

top:0,

left:0,

right:0,

bottom:0,

background:"rgba(0,0,0,0.4)",

display:"flex",

alignItems:"center",

justifyContent:"center",

zIndex:1000

}}

>


<div

style={{

background:"#fff",

padding:"25px",

borderRadius:"12px",

width:"350px",

boxShadow:"0 10px 30px rgba(0,0,0,.2)"

}}

>


<h3>

{title}

</h3>


<p

style={{

margin:"15px 0"

}}

>

{message}

</p>



<div

style={{

display:"flex",

gap:"10px",

justifyContent:"flex-end"

}}

>


<Button
variant="secondary"
onClick={onCancel}
>

Cancel

</Button>



<Button
variant="danger"
onClick={onConfirm}
>

Confirm

</Button>


</div>


</div>


</div>

);

}