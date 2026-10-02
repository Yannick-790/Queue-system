import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import api from "../../services/api";


export default function ServiceAnalytics() {

  const [services, setServices] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);



  async function loadServices() {

    try {

      setLoading(true);

      const res =
        await api.get("/reports/departments");


      setServices(
        res.data.data || []
      );


    } catch(error) {

      console.error(
        "Service analytics error",
        error
      );

    } finally {

      setLoading(false);

    }

  }



  useEffect(() => {

    loadServices();

  }, []);



  if(loading){

    return (
      <h2>
        Loading services...
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
        Service Analytics
      </h1>


      <button onClick={loadServices}>
        Refresh
      </button>



      <h2>
        Service Popularity
      </h2>


      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <PieChart>

          <Pie
            data={services}
            dataKey="customers"
            nameKey="service"
          >

            {
              services.map((_, index) => (
                <Cell
                  key={index}
                />
              ))
            }

          </Pie>


          <Tooltip/>

        </PieChart>

      </ResponsiveContainer>





      <h2>
        Service Performance
      </h2>


      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart
          data={services}
        >

          <CartesianGrid/>


          <XAxis
            dataKey="service"
          />


          <YAxis/>


          <Tooltip/>


          <Bar
            dataKey="completed"
          />


        </BarChart>


      </ResponsiveContainer>


    </div>

  );

}