const mongoose=require("mongoose"); 

mongoose.connect("mongodb+srv://msanthoshhh:Rockmadhav123@cluster0.z7pts0d.mongodb.net/payTM")

const userSchema=mongoose.Schema({
  
  username:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowerCase:true,
    minLength:3,
    maxLength:30
  },
  firstName:{
    type:String,
    required:true,
    trim:true,
    minLength:3,
    maxLength:30
    
  },
  lastName:{
    type:String,
    required:true,
    trim:true,
    minLength:3,
    maxLength:30
    
  },
  password:{
    type:String,
    required:true,
    minLength:6
  }
})


const accountSchema=mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  balance:{
    type:Number,
    required:true
  }
 
})

const User=mongoose.model("User",userSchema);
const Account=mongoose.model("Account",accountSchema);


module.exports={
  User,Account
}
