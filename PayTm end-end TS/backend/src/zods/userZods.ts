import {z} from "zod"

export const signupBody = z.object({

  username:z.string(),
  firstName:z.string().min(3).max(50),
  lastName:z.string().min(3).max(50).nullable(),
  password:z.string().min(3).max(50)

})

export const signinBody =z.object({

  username:z.string().email(),
  password:z.string()


})