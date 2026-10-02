import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "../../styles/auth.css";


export default function ForgotPassword(){

const [email,setEmail] = useState("");

const [message,setMessage] = useState("");

const [error,setError] = useState("");

const [loading,setLoading] = useState(false);



async function submit(){

try{

setLoading(true);
setError("");
setMessage("");


await api.post(
"/auth/forgot-password",
{
 email
}
);


setMessage(
"Password reset link sent. Check your email."
);


}catch(err:any){

setError(
err.response?.data?.error ||
"Something went wrong."
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
Forgot Password
</h1>


<p>
Enter your email and we will send you a reset link.
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

type="email"

placeholder="Email address"

value={email}

onChange={(e)=>
setEmail(e.target.value)
}

/>




<button
onClick={submit}
disabled={loading}
>


{
loading ? (

<span className="loader-wrapper">

<span className="loader"></span>

Sending...

</span>

)

:

"Send Reset Link"

}


</button>




<p>

Remember your password?

<Link to="/login">

 Login

</Link>


</p>



</div>


</div>

);

}
