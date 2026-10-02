import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/components/DeskStatusPanel.css";

interface Desk {
  id: string;
  name: string;

  status:
    | "AVAILABLE"
    | "BUSY"
    | "OFFLINE";

  department?: {
    name: string;
  };

  employee?: {
    user?: {
      name: string;
    };
  };
}



export default function DeskStatusPanel(){


const [desks,setDesks]=useState<Desk[]>([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

loadDesks();

},[]);




async function loadDesks(){


try{


setLoading(true);


const res =
await api.get("/desk");


setDesks(
res.data.data || res.data
);


}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}


}




return (

<div className="desk-panel">



<div className="desk-header">


<h2>

Desk Status

</h2>


<button onClick={loadDesks}>

Refresh

</button>


</div>




{
loading ?


<div className="desk-loader">


<div className="logo-spinner">

Q

</div>


<p>

Loading desks...

</p>


</div>



:

desks.length===0 ?


<div className="empty-desk">

No desks configured.

</div>



:


<table className="desk-table">


<thead>

<tr>

<th>

Desk

</th>


<th>

Department

</th>


<th>

Employee

</th>


<th>

Status

</th>


</tr>

</thead>



<tbody>


{

desks.map(desk=>(


<tr key={desk.id}>


<td>

{desk.name}

</td>



<td>

{desk.department?.name || "-"}

</td>



<td>

{desk.employee?.user?.name || "Not assigned"}

</td>



<td>


<span

className={`desk-status ${desk.status}`}

>

{desk.status}

</span>


</td>


</tr>


))


}



</tbody>



</table>


}



</div>


);


}