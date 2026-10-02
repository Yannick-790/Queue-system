import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import api from "../../services/api";


interface AnalyticsData {
  totalCustomers: number;
  waitingCustomers: number;
  completedCustomers: number;
  averageWaitingTime: number;
  averageServiceTime: number;
  activeEmployees: number;
  cardsInUse: number;
  lostCards: number;
}



export default function Dashboard() {


  const [data, setData] =
    useState<AnalyticsData | null>(null);


  const [queueTrend, setQueueTrend] =
    useState<any[]>([]);


  const [serviceStats, setServiceStats] =
    useState<any[]>([]);


  const [loading, setLoading] =
    useState(true);


  async function loadAnalytics() {

    try {

      setLoading(true);


      const [
        queue,
        serviceTime,
        employees,
        departments

      ] = await Promise.all([

        api.get("/reports/queue"),

        api.get("/reports/service-time"),

        api.get("/reports/employees"),

        api.get("/reports/departments")

      ]);



      const queueData =
        queue.data.data || {};


      const serviceData =
        serviceTime.data.data || {};


      const employeeData =
        employees.data.data || {};


      const departmentData =
        departments.data.data || {};



      setData({

        totalCustomers:
          queueData.totalCustomers ?? 0,


        waitingCustomers:
          queueData.waitingCustomers ?? 0,


        completedCustomers:
          queueData.completedCustomers ?? 0,


        averageWaitingTime:
          serviceData.averageWaitingTime ?? 0,


        averageServiceTime:
          serviceData.averageServiceTime ?? 0,


        activeEmployees:
          employeeData.activeEmployees ?? 0,


        cardsInUse:
          departmentData.cardsInUse ?? 0,


        lostCards:
          departmentData.lostCards ?? 0,

      });



      setQueueTrend(

        queueData.queueTrend || []

      );


      setServiceStats(

        serviceData.serviceStats || []

      );



    }

    catch(error){

      console.error(
        "Failed to load analytics",
        error
      );

    }

    finally{

      setLoading(false);

    }

  }



  useEffect(()=>{

    loadAnalytics();

  },[]);



  if(loading){

    return (

      <div>

        Loading analytics...

      </div>

    );

  }



  if(!data){

    return (

      <div>

        No analytics data available.

      </div>

    );

  }



  return (

    <div
      style={{
        padding:"30px"
      }}
    >


      <h1>
        Analytics Dashboard
      </h1>



      <button
        onClick={loadAnalytics}
      >
        Refresh
      </button>




      <div

        style={{

          display:"grid",

          gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",

          gap:"20px",

          marginTop:"30px"

        }}

      >


        <Card
          title="Customers Today"
          value={data.totalCustomers}
        />


        <Card
          title="Waiting"
          value={data.waitingCustomers}
        />


        <Card
          title="Completed"
          value={data.completedCustomers}
        />


        <Card
          title="Average Waiting Time"
          value={`${data.averageWaitingTime} min`}
        />


        <Card
          title="Average Service Time"
          value={`${data.averageServiceTime} min`}
        />


        <Card
          title="Active Employees"
          value={data.activeEmployees}
        />


        <Card
          title="Cards In Use"
          value={data.cardsInUse}
        />


        <Card
          title="Lost Cards"
          value={data.lostCards}
        />


      </div>





      <h2>
        Queue Trend
      </h2>


      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <LineChart
          data={queueTrend}
        >

          <CartesianGrid />


          <XAxis
            dataKey="time"
          />


          <YAxis />


          <Tooltip />


          <Line
            type="monotone"
            dataKey="customers"
          />


        </LineChart>


      </ResponsiveContainer>






      <h2>
        Services Performance
      </h2>



      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={serviceStats}
        >

          <CartesianGrid />


          <XAxis
            dataKey="service"
          />


          <YAxis />


          <Tooltip />


          <Bar
            dataKey="customers"
          />


        </BarChart>


      </ResponsiveContainer>



    </div>

  );

}





function Card({

  title,

  value

}:{

  title:string;

  value:string | number;

}){


  return (

    <div

      style={{

        padding:"20px",

        border:"1px solid #ddd",

        borderRadius:"12px",

        background:"#fff"

      }}

    >

      <h3>
        {title}
      </h3>


      <p

        style={{

          fontSize:"28px",

          fontWeight:"bold"

        }}

      >

        {value}

      </p>


    </div>

  );

}