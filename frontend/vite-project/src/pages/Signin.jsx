import { useState } from "react";
import {Heading} from "../components/Heading";
import {Button} from "../components/Button";
import {BottonWarning} from "../components/ButtonWarning";
import {SubHeading} from "../components/SubHeading";
import {InputBox} from "../components/InputBox";
import Image from "../assets/paytm.png"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import  BufferLoader  from "../components/Loader";



export const Signin =()=>{  

  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate=useNavigate();
  return(
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <div className="flex">
          <img className="w-[80px]" src={Image} alt="logo" />
          <Heading label={"Mini PayTM"} className="font-bold text-4xl pt-2"/>
          </div>
          <Heading label={"Login Here!"} className="text-[20px] font-medium pt-1" />
          <SubHeading label={"Enter your credentials to access your account"}/>
          <InputBox placeholder={"marimuthusanthoshh@gmail.com"} label={"username"} onChange={(e)=>{
            setUsername(e.target.value)
          }}/>
          <InputBox placeholder={"123456"} label={"Password"} 
          onChange={(e)=>{
            setPassword(e.target.value)
          }}/>
          <BufferLoader isLoading={isLoading} />
          <div className="pt-4">
            <Button label={"Login Here!"} onClick={async ()=>{
              try{
                
                const response = await axios.post("http://localhost:3000/user/signin",{
                  username,
                  password
                })
                   localStorage.setItem("token", response.data.token);
                   localStorage.setItem("userId",response.data.user._id); 
                   localStorage.setItem("username",response.data.user.firstName)
                    navigate("/dashboard")
                    toast.success("Login Successful", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
                  setIsLoading(false);
              } catch(err){
                console.error("Error signing in:", err);
                  toast.error(
                    `Failed to sign in. ${err.response.data.message}`,
                    {
                      position: "top-left",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    }
                  );
                  setIsLoading(false);

              }
            }}/>
          </div>
          <BottonWarning label={"Don't have an account ?"} buttonText={"Sign up"} to={"/signup"}/>
        </div>
      </div>
    </div>
  )
}