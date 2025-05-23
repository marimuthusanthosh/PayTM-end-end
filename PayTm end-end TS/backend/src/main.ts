import express, { Express,Request,Response } from 'express'; 
import userRoute from './routes/user';
import accountRoute from './routes/account'
import { PORT } from './secret';
import cors from "cors"; 

const app: Express = express(); 

app.use(cors())

app.use(express.json()); 
app.use("/user", userRoute);

app.use("/account",accountRoute);
app.get("/",(req:Request,res:Response)=>{

  res.send("i am working")
})

app.listen(PORT, () => {
  console.log("It's running, you did a great job!");
});
