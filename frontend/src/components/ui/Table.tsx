import type { ReactNode } from "react";


interface TableProps {

headers:string[];

children:ReactNode;

}


export default function Table({

headers,

children

}:TableProps){


return (

<table
style={{
width:"100%",
borderCollapse:"collapse",
background:"#fff",
borderRadius:"12px",
overflow:"hidden"
}}
>


<thead>

<tr>

{
headers.map((h)=>(

<th
key={h}
style={{
padding:"12px",
textAlign:"left",
borderBottom:"1px solid #e5e7eb",
background:"#f9fafb"
}}
>

{h}

</th>

))
}

</tr>

</thead>


<tbody>

{children}

</tbody>


</table>

);

}