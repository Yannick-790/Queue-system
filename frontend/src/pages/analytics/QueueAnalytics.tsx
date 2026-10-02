import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import api from "../../services/api";


export default function QueueAnalytics() {

  const [loading,setLoading] =
    useState(true);


  const [queueData,setQueueData] =
    useState<any[]>([]);


  const [peakHours,setPeakHours] =
    useState<any[]>([]);



  async function loadData(){

    try{

      setLoading(true);


      const res =
await api.get("/reports/queue");


setQueueData(

res.data.data.map(
(item:any)=>({

status:item.status,

customers:item._count.id

})

)

);


      setQueueData(
        res.data.data.queueTrend || []
      );


      setPeakHours(
        res.data.data.peakHours || []
      );


    }
    catch(error){

      console.error(
        "Queue analytics error",
        error
      );

    }
    finally{

      setLoading(false);

    }

  }



  useEffect(()=>{

    loadData();

  },[]);



  if(loading){

    return (
      <h2>
        Loading queue analytics...
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
Queue Analytics
</h1>


<button
onClick={loadData}
>
Refresh
</button>



<section>

<h2>
Customers Waiting Over Time
</h2>


<ResponsiveContainer
width="100%"
height={300}
>

<LineChart
data={queueData}
>

<CartesianGrid/>


<XAxis
dataKey="time"
/>


<YAxis/>


<Tooltip/>


<Line
type="monotone"
dataKey="waiting"
/>


</LineChart>


</ResponsiveContainer>


</section>




<section>


<h2>
Peak Queue Hours
</h2>


<ResponsiveContainer
width="100%"
height={300}
>


<BarChart
data={peakHours}
>


<CartesianGrid/>


<XAxis
dataKey="hour"
/>


<YAxis/>


<Tooltip/>


<Bar
dataKey="customers"
/>


</BarChart>


</ResponsiveContainer>


</section>




</div>

);

}