import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/components/CardStatusPanel.css";


interface Card {

id:string;

cardNumber:string;

status:
"AVAILABLE_AT_SECURITY"
|
"WITH_CUSTOMER"
|
"RETURN_PENDING"
|
"LOST";

}



export default function CardStatusPanel(){


const [cards,setCards]=useState<Card[]>([]);

const [loading,setLoading]=useState(true);



useEffect(()=>{

loadCards();

},[]);



async function loadCards(){


try{


setLoading(true);


const res =
await api.get("/cards");


setCards(
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




const count=(status:Card["status"])=>{


return cards.filter(

card=>card.status===status

).length;


};




return (


<div className="card-panel">



<div className="card-header">


<h2>

Card Status

</h2>


<button onClick={loadCards}>

Refresh

</button>


</div>




{
loading ?


<div className="card-loader">


<div className="logo-spinner">

Q

</div>


<p>

Loading cards...

</p>


</div>



:


<div className="card-grid">


<div className="card-box available">

<h3>

{count("AVAILABLE_AT_SECURITY")}

</h3>

<p>

Available

</p>

</div>



<div className="card-box customer">

<h3>

{count("WITH_CUSTOMER")}

</h3>

<p>

With Customers

</p>

</div>



<div className="card-box pending">

<h3>

{count("RETURN_PENDING")}

</h3>

<p>

Return Pending

</p>

</div>



<div className="card-box lost">

<h3>

{count("LOST")}

</h3>

<p>

Lost Cards

</p>

</div>



</div>


}



</div>


);


}