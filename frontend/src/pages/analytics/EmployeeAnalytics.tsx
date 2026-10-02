import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import api from "../../services/api";


export default function EmployeeAnalytics() {


const [employees,setEmployees] =
useState<any[]>([]);


const [loading,setLoading] =
useState(true);



async function loadEmployees(){

try{

setLoading(true);


const res =
await api.get("/reports/employees");


setEmployees(
res.data.data || []
);


}
catch(error){

console.error(
"Employee analytics error",
error
);

}
finally{

setLoading(false);

}

}



useEffect(()=>{

loadEmployees();

},[]);




if(loading){

return (
<h2>
Loading employee analytics...
</h2>
);

}




return (

<div
style={{
padding:"30px"
}}
>


<h1>
Employee Performance
</h1>



<button
onClick={loadEmployees}
>
Refresh
</button>




<ResponsiveContainer
width="100%"
height={350}
>


<BarChart
data={employees}
>


<CartesianGrid/>


<XAxis
dataKey="employee"
/>


<YAxis/>


<Tooltip/>


<Bar
dataKey="customersServed"
/>


</BarChart>


</ResponsiveContainer>




<h2>
Employee Details
</h2>


<table
border={1}
cellPadding={10}
>


<thead>

<tr>

<th>
Employee
</th>


<th>
Customers Served
</th>


<th>
Average Service Time
</th>


<th>
Status
</th>


</tr>

</thead>



<tbody>


{
employees.map((employee)=>(

<tr
key={employee.id}
>


<td>
{employee.employee}
</td>


<td>
{employee.customersServed}
</td>


<td>
{employee.averageServiceTime} min
</td>


<td>
{employee.status}
</td>


</tr>


))
}



</tbody>


</table>



</div>

);

}