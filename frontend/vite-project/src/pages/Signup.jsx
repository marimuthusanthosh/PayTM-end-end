import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { BottonWarning } from "../components/ButtonWarning"
import Image from "../assets/paytm.png"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from 'axios';
import  BufferLoader  from "../components/Loader";
import { toast } from "react-toastify";


export const Signup = () => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4 mt-20">
          <div className="flex flex-row justify-center items-center pt-4">
            <img className="w-[80px]" src={Image} />
            <Heading className="text-4xl font-bold" label={"Mini PayTM"} />
          </div>
          <Heading label={"Register Here!"} className="text-[20px] pt-1 font-bold" />
          <SubHeading label={"Enter your information to create an account"} />
          <InputBox onChange={(e) => {
            setFirstname(e.target.value)
          }} placeholder="Marimuthu" label={"First Name"} />
          <InputBox onChange={(e) => {
            setLastName(e.target.value)
          }} placeholder="Santhosh" label={"Last Name"} />
          <InputBox onChange={(e) => {
            setUsername(e.target.value)
          }} placeholder="marimuthusanthoshh@gmail.com" label={"Email"} />
          <InputBox onChange={(e) => {
            setPassword(e.target.value)
          }} placeholder="123456" label={"Password"} />

          <BufferLoader isLoading={isLoading} />

          <div className="pt-4">
            <Button onClick={async () => {
              setIsLoading(true);

              try {
                const response = await axios.post("http://localhost:3000/user/signup", {
                  username,
                  firstName,
                  lastName,
                  password
                });
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId",response.data.user._id); 
                localStorage.setItem("username",response.data.user.firstName)
                navigate("/dashboard");
                toast.success("Registration Successful, Please Login!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });
              } catch (error) {
                console.error("Signup error:", error);
                console.error("Error signing up:", error);
                  toast.error(
                    `Failed to sign up. ${error.response.data.message} `,
                    {
                      position: "top-left",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    }
                  );
              } finally {
                setIsLoading(false);
              }
            }} label={"Sign up"} />
          </div>
          <BottonWarning label={"Already have an account"} buttonText={"Sign in"} to={"/signin"} />
        </div>
      </div>
    </div>
  )
}
