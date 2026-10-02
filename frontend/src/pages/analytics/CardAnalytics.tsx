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


export default function CardAnalytics(){


const [cards,setCards] =
useState<any>(null);


const [loading,setLoading] =
useState(true);



async function loadCards(){

try{

setLoading(true);


const res =
await api.get("/reports/cards");


setCards(
res.data.data
);


}
catch(error){

console.error(
"Card analytics error",
error
);

}
finally{

setLoading(false);

}

}



useEffect(()=>{

loadCards();

},[]);




if(loading){

return (
<h2>
Loading cards...
</h2>
);

}



const chartData=[

{
name:"Available",
value:cards.available
},

{
name:"With Customer",
value:cards.withCustomer
},

{
name:"Return Pending",
value:cards.returnPending
},

{
name:"Lost",
value:cards.lost
}

];




return (

<div
style={{
padding:"30px"
}}
>


<h1>
Card Analytics
</h1>


<button
onClick={loadCards}
>
Refresh
</button>



<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(200px,1fr))",
gap:"20px"
}}
>


<Card
title="Available"
value={cards.available}
/>


<Card
title="With Customer"
value={cards.withCustomer}
/>


<Card
title="Return Pending"
value={cards.returnPending}
/>


<Card
title="Lost"
value={cards.lost}
/>


</div>




<ResponsiveContainer
width="100%"
height={300}
>


<BarChart
data={chartData}
>


<CartesianGrid/>


<XAxis
dataKey="name"
/>


<YAxis/>


<Tooltip/>


<Bar
dataKey="value"
/>


</BarChart>


</ResponsiveContainer>



</div>

);

}




function Card(
{
title,
value
}:{
title:string;
value:number;
}
){

return (

<div
style={{
border:"1px solid #ddd",
padding:"20px",
borderRadius:"10px"
}}
>

<h3>
{title}
</h3>

<h2>
{value}
</h2>


</div>

);

}