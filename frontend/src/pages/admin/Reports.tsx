import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/reports.css";

interface QueueStatistic {
  status: string;
  _count: {
    id: number;
  };
}

interface CardStatistic {
  status: string;
  _count: {
    id: number;
  };
}

interface EmployeePerformance {
  employee: string;
  completedCustomers: number;
}

interface DepartmentLoad {
  department: string;
  waitingCustomers: number;
}

interface TimeStatistic {
  averageMinutes: number;
}

export default function Reports() {

  const [queueStats, setQueueStats] =
    useState<QueueStatistic[]>([]);

  const [cardStats, setCardStats] =
    useState<CardStatistic[]>([]);

  const [employeeStats, setEmployeeStats] =
    useState<EmployeePerformance[]>([]);

  const [departmentStats, setDepartmentStats] =
    useState<DepartmentLoad[]>([]);

  const [serviceTime, setServiceTime] =
    useState<TimeStatistic>({
      averageMinutes: 0,
    });

  const [waitingTime, setWaitingTime] =
    useState<TimeStatistic>({
      averageMinutes: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    async function loadReports() {

      try {

        setLoading(true);
        setError("");

        const [
          queueResponse,
          cardResponse,
          serviceResponse,
          waitingResponse,
          employeeResponse,
          departmentResponse,
        ] = await Promise.all([

          api.get("/reports/queue"),

          api.get("/reports/cards"),

          api.get("/reports/service-time"),

          api.get("/reports/waiting-time"),

          api.get("/reports/employees"),

          api.get("/reports/departments"),

        ]);

        setQueueStats(
          queueResponse.data.data
        );

        setCardStats(
          cardResponse.data.data
        );

        setServiceTime(
          serviceResponse.data.data
        );

        setWaitingTime(
          waitingResponse.data.data
        );

        setEmployeeStats(
          employeeResponse.data.data
        );

        setDepartmentStats(
          departmentResponse.data.data
        );

      } catch (err: any) {

        console.error(
          "Failed to load reports:",
          err
        );

        setError(
          err.response?.data?.error ||
          "Failed to load reports."
        );

      } finally {

        setLoading(false);

      }

    }

    loadReports();

  }, []);

  // ---------------------------------------------
  // HELPERS
  // ---------------------------------------------

  function getQueueCount(
    status: string
  ) {

    const result =
      queueStats.find(
        item => item.status === status
      );

    return result?._count.id ?? 0;
  }

  function getCardCount(
    status: string
  ) {

    const result =
      cardStats.find(
        item => item.status === status
      );

    return result?._count.id ?? 0;
  }

  const totalTickets =
    queueStats.reduce(
      (total, item) =>
        total + item._count.id,
      0
    );

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------

  if (loading) {

    return (
      <div className="reports-page">

        <div className="reports-loading">

          <div className="reports-spinner" />

          <p>
            Loading reports...
          </p>

        </div>

      </div>
    );

  }

  // ---------------------------------------------
  // ERROR
  // ---------------------------------------------

  if (error) {

    return (
      <div className="reports-page">

        <div className="reports-error">

          <h2>
            Unable to load reports
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>
    );

  }

  // ---------------------------------------------
  // PAGE
  // ---------------------------------------------

  return (

    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">

        <div>

          <p className="reports-label">
            ANALYTICS
          </p>

          <h1>
            Reports
          </h1>

          <p className="reports-subtitle">
            Monitor queues, employees,
            departments and cards.
          </p>

        </div>

      </div>


      {/* OVERVIEW */}

      <section className="report-cards">

        <div className="report-card">

          <span className="report-card-icon">
            🎫
          </span>

          <div>

            <p>
              Total Tickets
            </p>

            <h2>
              {totalTickets}
            </h2>

          </div>

        </div>


        <div className="report-card">

          <span className="report-card-icon">
            ⏳
          </span>

          <div>

            <p>
              Waiting
            </p>

            <h2>
              {getQueueCount("WAITING")}
            </h2>

          </div>

        </div>


        <div className="report-card">

          <span className="report-card-icon">
            🟢
          </span>

          <div>

            <p>
              Currently Serving
            </p>

            <h2>
              {getQueueCount("SERVING")}
            </h2>

          </div>

        </div>


        <div className="report-card">

          <span className="report-card-icon">
            ✅
          </span>

          <div>

            <p>
              Completed
            </p>

            <h2>
              {getQueueCount("COMPLETED")}
            </h2>

          </div>

        </div>

      </section>


      {/* TIME REPORTS */}

      <section className="reports-grid">

        <div className="report-panel">

          <div className="panel-title">

            <h2>
              Average Waiting Time
            </h2>

            <span>
              ⏳
            </span>

          </div>

          <div className="big-number">

            {waitingTime.averageMinutes}

            <small>
              min
            </small>

          </div>

          <p>
            Average time customers wait
            before being served.
          </p>

        </div>


        <div className="report-panel">

          <div className="panel-title">

            <h2>
              Average Service Time
            </h2>

            <span>
              ⏱
            </span>

          </div>

          <div className="big-number">

            {serviceTime.averageMinutes}

            <small>
              min
            </small>

          </div>

          <p>
            Average time employees spend
            serving a customer.
          </p>

        </div>

      </section>


      {/* EMPLOYEES */}

      <section className="report-section">

        <div className="section-header">

          <div>

            <h2>
              Employee Performance
            </h2>

            <p>
              Customers completed by each employee.
            </p>

          </div>

          <span>
            👥
          </span>

        </div>


        {employeeStats.length === 0 ? (

          <div className="empty-report">
            No employee data available.
          </div>

        ) : (

          <div className="report-table">

            <div className="table-row table-header">

              <span>
                Employee
              </span>

              <span>
                Completed Customers
              </span>

            </div>


            {employeeStats.map(
              (employee, index) => (

                <div
                  className="table-row"
                  key={index}
                >

                  <span>
                    {employee.employee}
                  </span>

                  <strong>
                    {employee.completedCustomers}
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* DEPARTMENTS */}

      <section className="report-section">

        <div className="section-header">

          <div>

            <h2>
              Department Load
            </h2>

            <p>
              Customers currently waiting
              in each department.
            </p>

          </div>

          <span>
            🏢
          </span>

        </div>


        {departmentStats.length === 0 ? (

          <div className="empty-report">
            No department data available.
          </div>

        ) : (

          <div className="report-table">

            <div className="table-row table-header">

              <span>
                Department
              </span>

              <span>
                Waiting Customers
              </span>

            </div>


            {departmentStats.map(
              (department, index) => (

                <div
                  className="table-row"
                  key={index}
                >

                  <span>
                    {department.department}
                  </span>

                  <strong>
                    {department.waitingCustomers}
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* CARDS */}

      <section className="report-section">

        <div className="section-header">

          <div>

            <h2>
              Card Statistics
            </h2>

            <p>
              Current status of QueueFlow cards.
            </p>

          </div>

          <span>
            💳
          </span>

        </div>


        <div className="card-stat-grid">

          <div className="card-stat">

            <span>
              Available
            </span>

            <strong>
              {getCardCount(
                "AVAILABLE_AT_SECURITY"
              )}
            </strong>

          </div>


          <div className="card-stat">

            <span>
              With Customers
            </span>

            <strong>
              {getCardCount(
                "WITH_CUSTOMER"
              )}
            </strong>

          </div>


          <div className="card-stat">

            <span>
              Return Pending
            </span>

            <strong>
              {getCardCount(
                "RETURN_PENDING"
              )}
            </strong>

          </div>


          <div className="card-stat">

            <span>
              Lost
            </span>

            <strong>
              {getCardCount(
                "LOST"
              )}
            </strong>

          </div>

        </div>

      </section>

    </div>

  );
}