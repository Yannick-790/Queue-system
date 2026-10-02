import "../styles/components/StatCard.css";


interface StatCardProps {

title:string;

value:string | number;

icon?:string;

loading?:boolean;

}


export default function StatCard({

title,

value,

icon="◉",

loading=false

}:StatCardProps){



return (

<div className="stat-card">


<div className="stat-card-icon">

{icon}

</div>



<div className="stat-card-content">


{
loading ?

<div className="stat-loading">
  <div className="mini-spinner"></div>
</div>


:

<h2>

{value}

</h2>


}



<p>

{title}

</p>



</div>



</div>

);


}