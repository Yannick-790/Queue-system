import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/setup.css";


type RoutingMode =
  | "FIXED_FLOW"
  | "FLEXIBLE_FLOW";


interface Company {

id:string;

name:string;

routingMode:RoutingMode;

}



export default function FlowSetup(){


const navigate = useNavigate();


const [loading,setLoading] =
useState(true);


const [saving,setSaving] =
useState(false);



const [company,setCompany] =
useState<Company | null>(null);



const [routingMode,setRoutingMode] =
useState<RoutingMode>("FIXED_FLOW");





useEffect(()=>{

loadCompany();

},[]);





async function loadCompany(){

try{


const res =
await api.get("/company");



setCompany(res.data);



setRoutingMode(
res.data.routingMode || "FIXED_FLOW"
);



}
catch(error){

console.log(error);

}
finally{

setLoading(false);

}

}



async function saveFlow() {
  try {
    setSaving(true);

    // 1. Save routing mode
    await api.patch(
      "/company/routing-mode",
      {
        routingMode,
      }
    );

    // 2. Mark the complete setup as finished
    const res = await api.post(
      "/company/complete-setup"
    );

    console.log(
      "COMPLETE SETUP:",
      res.data
    );

    // 3. Confirm backend changed database value
    if (
      res.data?.data?.setupCompleted !== true
    ) {
      throw new Error(
        "Backend did not mark setup as completed."
      );
    }

    // 4. Setup is REALLY finished
    navigate("/admin", {
      replace: true,
    });

  } catch (error: any) {

    console.error(
      "SETUP COMPLETION ERROR:",
      error
    );

    alert(
      error?.response?.data?.error ||
      error?.message ||
      "Failed to complete setup."
    );

  } finally {
    setSaving(false);
  }
}



if(loading){

return(

<div className="setup-loading">

Loading flow settings...

</div>

);

}





return(

<div className="setup-container">


<h1>
Queue Flow Setup
</h1>


<p className="setup-description">

Choose how customers move through your organization.

</p>




<div className="flow-grid">



<button

onClick={()=>
setRoutingMode("FIXED_FLOW")
}

className={
routingMode==="FIXED_FLOW"
?
"flow-card active-blue"
:
"flow-card"
}

>


<h2>
Fixed Flow
</h2>


<p>

You create the customer journey order.

</p>


<div className="flow-example">

Reception

↓

Finance

↓

Approval

</div>


<span>

Best for hospitals,
government offices,
multi-step services.

</span>


</button>






<button

onClick={()=>
setRoutingMode("FLEXIBLE_FLOW")
}

className={
routingMode==="FLEXIBLE_FLOW"
?
"flow-card active-green"
:
"flow-card"
}

>


<h2>
Flexible Flow
</h2>


<p>

Customers go directly to the selected service.

</p>


<div className="flow-example">

Customer

↓

Chosen Department

↓

Employee

</div>


<span>

Best for banks,
support centers,
simple requests.

</span>


</button>



</div>





<div className="current-flow">


<h3>
Current Selection
</h3>


<p>

Company:

<strong>
{" "}
{company?.name}
</strong>

</p>



<p>

Flow:

<strong>
{" "}
{routingMode}
</strong>

</p>


</div>






<div className="setup-actions">


<button

onClick={()=>
navigate("/setup/services")
}

className="secondary-btn"

>

Previous

</button>





<button

onClick={saveFlow}

disabled={saving}

className="primary-btn"

>

{
saving
?
"Saving..."
:
"Save Flow"
}


</button>



</div>



</div>

);

}