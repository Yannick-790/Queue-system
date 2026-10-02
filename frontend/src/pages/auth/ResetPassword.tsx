import {useState} from "react";
import {
useParams,
useNavigate
} from "react-router-dom";

import api from "../../services/api";

import "../../styles/auth.css";



export default function ResetPassword(){

const {token}=useParams();

const navigate = useNavigate();


const [password,setPassword]=useState("");

const [confirm,setConfirm]=useState("");

const [message,setMessage]=useState("");

const [error,setError]=useState("");

const [loading,setLoading]=useState(false);




async function reset(){


if(password !== confirm){

setError(
"Passwords do not match."
);

return;

}



try{


setLoading(true);

setError("");



await api.post(
`/auth/reset-password/${token}`,
{
password
}
);



setMessage(
"Password changed successfully. Redirecting..."
);



setTimeout(()=>{

navigate("/login");

},2000);



}catch(err:any){


setError(

err.response?.data?.error ||

"Reset failed."

);


}finally{


setLoading(false);


}


}



return (

<div className="auth-page">


<div className="auth-card">



<div className="auth-logo">
Q
</div>



<h1>
Create New Password
</h1>



<p>
Choose a strong password for your QueueFlow account.
</p>




{
error &&

<div className="error-box">

{error}

</div>

}




{
message &&

<div className="success-box">

{message}

</div>

}




<input

type="password"

placeholder="New password"

value={password}

onChange={(e)=>
setPassword(e.target.value)
}

/>




<input

type="password"

placeholder="Confirm password"

value={confirm}

onChange={(e)=>
setConfirm(e.target.value)
}

/>




<button
onClick={reset}
disabled={loading}
>


{

loading ? (

<span className="loader-wrapper">

<span className="loader"></span>

Updating...

</span>

)

:

"Reset Password"

}



</button>




</div>


</div>

);

}