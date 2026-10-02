import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/components/EmployeeStatusPanel.css";

interface Employee {
  id: string;
  name: string;

  department?: {
    id: string;
    buildingId: string;
    name: string;
  };

  service?: {
    id: string;
    name: string;
  };

  desk?: {
    id: string;
    name: string;
  };

  status: "AVAILABLE" | "BUSY" | "OFFLINE";
}


export default function EmployeeStatusPanel(){


const [employees,setEmployees]=useState<Employee[]>([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

loadEmployees();

},[]);



async function loadEmployees(){


try{


setLoading(true);


const res =
await api.get("/employees");


setEmployees(
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

<div className="employee-panel">


<div className="employee-header">


<h2>

Employee Status

</h2>


<button onClick={loadEmployees}>

Refresh

</button>


</div>




{
loading ?


<div className="panel-loader">

<div className="logo-spinner">

Q

</div>


<p>

Loading employees...

</p>


</div>



:

employees.length===0 ?


<div className="empty-panel">

No employees found.

</div>



:


<table>


<thead>

<tr>

<th>Name</th>

<th>Department</th>

<th>Desk</th>

<th>Status</th>

</tr>

</thead>


<tbody>


{
employees.map(employee=>(


<tr key={employee.id}>


<td>

{employee.name}

</td>

<td>
  {employee.department?.name || "-"}
</td>

<td>
  {employee.desk?.name || "-"}
</td>


<td>


<span className={`status ${employee.status}`}>

{employee.status}

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