import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/dashboard.css";


export default function AdminDashboard(){


const navigate = useNavigate();


const [company,setCompany] = useState<any>(null);

const [loading,setLoading] = useState(true);



useEffect(()=>{


async function load(){


try{


const res =
await api.get("/company");


setCompany(res.data);


}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}


}


load();


},[]);





if(loading){


return(

<div className="dashboard-loader">


<div className="logo-spinner">

Q

</div>


<p>
Loading QueueFlow workspace...
</p>


</div>

);


}





const setupSteps = [

{
name:"Company",
done:!!company?.name,
path:"/setup/company"
},

{
name:"Buildings",
done:
(company?.buildings?.length || 0) > 0,
path:"/setup/buildings"
},

{
name:"Departments",
done:
(company?.buildings || [])
.some(
(building:any)=>
building.departments?.length > 0
),
path:"/setup/departments"
},

{
name:"Services",
done:
(company?.buildings || [])
.some(
(building:any)=>
building.departments?.some(
(department:any)=>
department.services?.length > 0
)
),
path:"/setup/services"
},

{
name:"Queue Flow",
done:
!!company?.routingMode,
path:"/setup/flow"
}

];



const completed =
setupSteps.filter(
step=>step.done
).length;



const percentage =
Math.round(
(completed/setupSteps.length)*100
);




return(

<div className="admin-dashboard">



<section className="dashboard-header">


<div>


<h1>
Admin Control Center
</h1>


<p>
Manage your QueueFlow organization and customer flow.
</p>


</div>



<div className="admin-badge">

ADMIN

</div>



</section>






<section className="company-panel">


<h2>

{company?.name || "Your Organization"}

</h2>


<p>

Industry:

<strong>
 {company?.industry || "Not configured"}
</strong>

</p>



</section>






{
percentage < 100 && (


<section className="setup-warning">


<h2>
Complete your organization setup
</h2>


<p>

Your queue system is not ready yet.
Complete these steps before employees start serving customers.

</p>



<div className="progress-bar">


<div
style={{
width:`${percentage}%`
}}
>


</div>


</div>



<p>

{percentage}% completed

</p>




<div className="setup-grid">


{
setupSteps.map(step=>(


<div
key={step.name}
className="setup-card"
onClick={()=>navigate(step.path)}
>


<h3>

{step.done ? "✓":"○"}

{" "}

{step.name}

</h3>


<button>

Configure

</button>


</div>


))

}



</div>



</section>


)

}





<section className="management-grid">



<Card
title="Buildings"
text="Manage organization locations"
click={()=>navigate("/setup/buildings")}
/>



<Card
title="Departments"
text="Create service departments"
click={()=>navigate("/setup/departments")}
/>



<Card
title="Services"
text="Configure customer services"
click={()=>navigate("/setup/services")}
/>



<Card
title="Employees"
text="Manage staff accounts"
click={()=>navigate("/admin/employees")}
/>



<Card
title="Reports"
text="Analyze queue performance"
click={()=>navigate("/admin/reports")}
/>



<Card
title="Public Display"
text="Monitor customer screens"
click={()=>navigate("/display/"+company?.id)}
/>



</section>





<section className="tech-section">


<h2>
QueueFlow Technology
</h2>


<div className="tech-box">


<img
src="/hero.png"
alt="Queue technology"
/>



<div>

<h3>
Smart Queue Engine
</h3>


<p>

Real-time tickets, employee desks,
physical cards and live customer displays.

</p>

</div>



</div>


</section>





</div>

);


}






function Card(
{
title,
text,
click
}:
{
title:string;
text:string;
click:()=>void;
}

){


return(

<div
className="dashboard-card"
>


<h3>
{title}
</h3>


<p>
{text}
</p>


<button
onClick={click}
>

Open

</button>


</div>


);


}