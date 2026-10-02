import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/components/NotificationPanel.css";


interface Notification {

  id:string;

  message:string;

  type:string;

  status:string;

  createdAt:string;

}



export default function NotificationPanel(){


const [notifications,setNotifications] = useState<Notification[]>([]);

const [loading,setLoading] = useState(true);



async function loadNotifications(){


try{


setLoading(true);


const res = await api.get("/notifications");


setNotifications(
  res.data.data || res.data
);


}catch(error){


console.log(error);


}finally{


setLoading(false);


}


}



useEffect(()=>{


loadNotifications();


},[]);




function badge(type:string){


switch(type){


case "WARNING":

return "warning";


case "ERROR":

return "danger";


case "SUCCESS":

return "success";


default:

return "info";


}



}





return (


<div className="dashboard-panel">



<div className="panel-title">


<h2>
Notifications
</h2>



<button

className="refresh-button"

onClick={loadNotifications}

>

Refresh

</button>


</div>





{
loading ? (



<div className="panel-loader">


<div className="logo-spinner">

Q

</div>


Loading notifications...


</div>




) : notifications.length === 0 ? (



<div className="empty-state">

No notifications available.

</div>




) : (



<div className="notification-list">



{
notifications.map(notification=>(



<div

key={notification.id}

className="notification-card"



>


<div>


<h4>

{notification.message}

</h4>


<p>

{
new Date(
notification.createdAt
).toLocaleString()

}

</p>


</div>



<span

className={
`notification-badge ${badge(notification.type)}`
}

>


{
notification.type
}


</span>



</div>



))

}



</div>



)


}



</div>


);



}