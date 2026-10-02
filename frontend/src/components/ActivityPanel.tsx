import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/components/ActivityPanel.css";


interface Activity {

id:string;

message:string;

type?:string;

createdAt:string;

}



export default function ActivityPanel(){


const [activities,setActivities]=useState<Activity[]>([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

loadActivity();

},[]);



async function loadActivity(){


try{


setLoading(true);


const res =
await api.get("/activity");


setActivities(
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

<div className="activity-panel">


<div className="activity-header">


<h2>

Live Activity

</h2>


</div>




{
loading ?


<div className="activity-loader">


<div className="logo-spinner">

Q

</div>


<p>

Loading activity...

</p>


</div>



:


activities.length===0 ?


<div className="activity-empty">

No recent activity.

</div>



:


<div className="activity-list">


{

activities.map(activity=>(


<div

key={activity.id}

className="activity-item"

>


<div className="activity-icon">

•

</div>



<div>


<h4>

{activity.message}

</h4>



<span>

{
new Date(
activity.createdAt
)
.toLocaleString()

}

</span>


</div>



</div>


))


}



</div>


}



</div>


);


}