import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/auth.css";


export default function VerifyEmail(){

const { token } = useParams();

const navigate = useNavigate();

const [message,setMessage] =
useState("Verifying your email...");


useEffect(()=>{


async function verify(){


try{


await api.get(`/auth/verify/${token}`);


setMessage(
"Email verified successfully. Redirecting to login..."
);



setTimeout(()=>{

navigate("/login");

},2000);



}



catch (error: any) {
  console.error(error);

  setMessage(
    error.response?.data?.error ??
    "Verification failed."
  );



}


}



if(token){

verify();

}


},[token,navigate]);




return(

<div className="auth-page">


<div className="auth-card">


<div className="auth-logo">
Q
</div>


<h1>
Email Verification
</h1>


<p>
{message}
</p>


</div>


</div>

);


}