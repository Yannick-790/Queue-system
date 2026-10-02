import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Badge from "./ui/Badge";


export default function Navbar() {


  const {
    user,
    logout
  } = useAuth();



  return (

    <header className="navbar">


      <div className="navbar-brand">

        <Link to="/">

          QueueFlow

        </Link>

      </div>



      <div className="navbar-right">


        {
          user ? (

            <>


              <div className="navbar-user">


                <div className="user-avatar">

                  {
                    user.name
                      .charAt(0)
                      .toUpperCase()
                  }

                </div>



                <div className="user-info">


                  <span className="user-name">

                    {user.name}

                  </span>



                  <Badge
                    variant={
                      user.role === "ADMIN"
                      ? "success"
                      :
                      user.role === "MANAGER"
                      ? "info"
                      :
                      user.role === "SECURITY"
                      ? "warning"
                      :
                      "info"
                    }
                  >

                    {user.role}

                  </Badge>


                </div>


              </div>




              <button

                className="navbar-logout"

                onClick={logout}

              >

                Logout

              </button>


            </>


          ) : (

            <div className="navbar-links">


              <Link to="/login">

                Login

              </Link>


              <Link to="/register">

                Register

              </Link>


            </div>

          )

        }


      </div>


    </header>

  );

}