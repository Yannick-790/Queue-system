import { useEffect, useState } from "react";
import api from "../../services/api";


export default function CreateTicket(){

const [cards,setCards] = useState<any[]>([]);
const [services,setServices] = useState<any[]>([]);

const [cardId,setCardId] = useState("");
const [serviceId,setServiceId] = useState("");



useEffect(()=>{

loadCards();
loadServices();

},[]);



async function loadCards(){

const res =
await api.get("/cards");


setCards(res.data.data);

}



async function loadServices(){

const res =
await api.get("/services");


setServices(res.data.data);

}



async function createTicket(){

await api.post(
"/tickets",
{
cardId,
serviceId
}
);


alert("Customer added");

}




return (

<div>

<h1>
Create Customer Ticket
</h1>


<select onChange={(e)=>setCardId(e.target.value)}>

<option>
Select Card
</option>


{cards.map(card=>(

<option key={card.id} value={card.id}>

{card.cardNumber}

</option>

))}


</select>



<select onChange={(e)=>setServiceId(e.target.value)}>

<option>
Select Service
</option>


{services.map(service=>(

<option key={service.id} value={service.id}>

{service.name}

</option>

))}


</select>



<button onClick={createTicket}>
Create Ticket
</button>


</div>

);

}