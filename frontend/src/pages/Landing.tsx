import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/landing.css";


export default function Landing(){

const [loading,setLoading] = useState(true);


useEffect(()=>{

const timer = setTimeout(()=>{

setLoading(false);

},1200);


return ()=>clearTimeout(timer);


},[]);



if(loading){

return(

<div className="landing-loader">

<div className="logo-loader">

<span>Q</span>

</div>

<p>
Loading QueueFlow...
</p>

</div>

);

}



return(

<div className="landing">


{/* NAVBAR */}

<header className="landing-navbar">


<div className="brand">


<div className="logo">

Q

</div>


<h2>
QueueFlow
</h2>


</div>



<div className="landing-actions">


<Link to="/login">
Login
</Link>


<Link
className="primary-btn"
to="/register"
>

Create Organization

</Link>


</div>


</header>





{/* HERO */}

<section className="hero-section">

  <div className="hero-background-glow glow-one"></div>
  <div className="hero-background-glow glow-two"></div>

  <div className="hero-content">

    <div className="hero-badge">
      ⚡ Smart Queue Technology
    </div>

    <h1>
      Smart Queue Management
      <span> for Modern Organizations</span>
    </h1>

    <p>
      QueueFlow helps hospitals, banks, government offices,
      universities and businesses manage customer flow,
      reduce waiting time and improve service experience.
    </p>

    <div className="hero-buttons">

      <Link
        className="primary-btn"
        to="/register"
      >
        Start Your Organization
      </Link>

      <Link
        className="secondary-btn"
        to="/login"
      >
        Employee Login
      </Link>

    </div>

    <div className="hero-trust">

      <span>✓ Real-time queues</span>
      <span>✓ Multi-department</span>
      <span>✓ Live analytics</span>

    </div>

  </div>


  <div className="hero-card">

    <div className="tech-grid"></div>

    <div className="queue-dashboard">

      <div className="dashboard-header">

        <div>
          <small>QUEUEFLOW LIVE</small>
          <h3>Customer Queue</h3>
        </div>

        <div className="online-dot">
          ● LIVE
        </div>

      </div>


      <div className="now-serving">

        <small>NOW SERVING</small>

        <strong>047</strong>

        <span>Desk 04</span>

      </div>


      <div className="queue-stats">

        <div>
          <strong>12</strong>
          <span>Waiting</span>
        </div>

        <div>
          <strong>04</strong>
          <span>Desks</span>
        </div>

        <div>
          <strong>08m</strong>
          <span>Avg. Wait</span>
        </div>

      </div>


      <div className="queue-progress">

        <div className="progress-label">
          <span>Customer Flow</span>
          <span>78%</span>
        </div>

        <div className="progress-bar">

          <div></div>

        </div>

      </div>


      <div className="queue-items">

        <div>
          <span>048</span>
          <small>Waiting</small>
        </div>

        <div>
          <span>049</span>
          <small>Waiting</small>
        </div>

        <div>
          <span>050</span>
          <small>Waiting</small>
        </div>

      </div>

    </div>

  </div>

</section>





{/* FEATURES */}


<section className="section">


<h2>
Everything needed to control customer flow
</h2>



<div className="feature-grid">


<Feature
title="Digital Queue Engine"
text="Create tickets, manage waiting customers and automatically call the next person."
/>


<Feature
title="Physical Card System"
text="Reusable numbered cards with complete tracking lifecycle."
/>


<Feature
title="Real Time Display"
text="TV screens update instantly using WebSocket technology."
/>


<Feature
title="Multi Department Routing"
text="Support hospitals, banks and organizations with complex workflows."
/>


<Feature
title="Employee Management"
text="Connect employees, desks and services together."
/>


<Feature
title="Analytics"
text="Understand waiting times, performance and customer flow."
/>



</div>


</section>







{/* FLOW */}


<section className="section flow">


<h2>
How QueueFlow works
</h2>



<div className="flow-container">


<Step text="Customer arrives"/>

<Step text="Security gives card"/>

<Step text="Customer joins queue"/>

<Step text="Employee calls customer"/>

<Step text="Customer receives service"/>

<Step text="Card returns available"/>


</div>


</section>







{/* INDUSTRIES */}


<section className="section">


<h2>
Built for every organization
</h2>



<div className="industry-grid">


<span>🏥 Hospitals</span>

<span>🏦 Banks</span>

<span>🏛 Government Offices</span>

<span>🎓 Universities</span>

<span>📱 Telecom Companies</span>

<span>🏢 Businesses</span>


</div>


</section>






{/* FOOTER CTA */}


<section className="cta">


<h2>

Ready to transform customer service?

</h2>


<p>

Create your organization and start managing queues professionally.

</p>



<Link
className="primary-btn"
to="/register"
>

Create Account

</Link>


</section>



</div>


);

}





function Feature(
{
title,
text
}:
{
title:string;
text:string;
}
){

return(

<div className="feature-card">

<h3>
{title}
</h3>

<p>
{text}
</p>

</div>

);

}





function Step(
{
text
}:
{
text:string;
}
){

return(

<div className="step">

<div className="step-number">
✓
</div>

<p>
{text}
</p>

</div>

);

}