import { Request, Response, Router } from 'express';
import { prisma } from '../schema';
import { signinBody, signupBody } from '../zods/userZods';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '../secret';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
declare global {
  namespace Express {
    interface Request {
      userId?: number; // Prisma userId is Int, so number
    }
  }
}


console.log("iam a superstar")
router.post('/signup', async(req: Request, res: Response) => {
  // your logic here
  const {username,firstName,lastName,password}=req.body; 

  const parsedContent=signupBody.safeParse(req.body)

  if(!parsedContent){
   res.status(400).json({ message: "Wrong inputs" });
  }

  const existingUser=await prisma.user.findFirst({
    where:{username:username}
  })
  if(existingUser){
    res.status(401).json({message:"user exists Already"})
  }
  try{

    const response= await prisma.user.create({
      data:{
        username,
        firstName,
        lastName,
        password
      },
    })
    const userId=response.id;
    const information=await prisma.account.create({
      data:{
        userId,
        balance: 1 + Math.random() * 10000

      }
    }) 

    if(information){
      console.log("account also created")
    }


  res.status(200).json({response})
  }catch(err){
    console.log(err);
  }finally{
    await prisma.$disconnect();
  }

});


router.post("/signin", async (req:Request, res:Response) => {

  const {userId,username,password}=req.body;

  const parsedContent = signinBody.safeParse(req.body);
  if (!parsedContent.success) {
     res.status(403).json({ message: "Wrong input format" });
  }
  
  const userExists=await prisma.user.findFirst({
    where:{
      username:username
    }
  })
  
  if(userExists){
    const token =jwt.sign({userId:userId},JWT_SECRET!)
    
    res.status(200).json({token:token})
  }
  
})

router.put("/edit", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const parsedContent = signinBody.safeParse(req.body);

  if (!parsedContent.success) {
    res.status(403).json({ message: "Wrong input format" });
    return;
  }

  const userId = req.userId;

  try {
    const update = await prisma.user.update({
      where: { id: userId },
      data: parsedContent.data,
    });

    res.status(200).json({ message: "User updated", user: update });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/bulk", async (req: Request, res: Response): Promise<void> => {
  const filter = (req.query.filter as string) || "";

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: filter,
              mode: "insensitive"
            }
          },
          {
            lastName: {
              contains: filter,
              mode: "insensitive"
            }
          }
        ]
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true
      }
    });

    res.json({
      users: users.map(user => ({
        _id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      }))
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
