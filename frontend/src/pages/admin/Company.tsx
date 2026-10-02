import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/company.css";


export default function Company(){


const [company,setCompany] =
useState<any>(null);

const [buildings,setBuildings] =
useState<any[]>([]);



useEffect(()=>{

loadCompany();

loadBuildings();

},[]);




async function loadCompany(){

const res =
await api.get("/company");


setCompany(
res.data
);

}




async function loadBuildings(){

const res =
await api.get("/company/buildings");


setBuildings(
res.data
);

}




return (

<div className="company-page">


<h1 className="company-title">
Company Management
</h1>


{
company && (

<div className="company-card">

<h2 className="company-name">
{company.name}
</h2>

<p className="company-industry">
Industry:
<span>
{company.industry}
</span>
</p>


</div>

)
}




<h2 className="buildings-title">
Buildings
</h2>


<div className="buildings-container">

{

buildings.map(building=>(

<div
className="building-card"
key={building.id}
>


<h3 className="building-name">
{building.name}
</h3>


<p className="department-count">
Departments:
<span>
{building.departments?.length || 0}
</span>
</p>


</div>


))

}

</div>



</div>

);

}