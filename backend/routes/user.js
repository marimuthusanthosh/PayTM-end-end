const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");


const { User, Account } = require("../db/index");
const { authMiddleware } = require("../authMiddleware");
const { siginBody, signupBody, updateBody } = require("../types");



// Signup Route
router.post("/signup", async (req, res) => {
  const parsedContent = signupBody.safeParse(req.body);

  if (!parsedContent.success) {
    return res.status(411).json({
      message: "Incorrect Inputs"
    });
  }

  const existingUser = await User.findOne({ username: req.body.username });

  if (existingUser) {
    return res.status(411).json({ message: "User Already exists" });
  }

  
  const { username,firstName, lastName, password } = req.body;

    const user = await User.create({
      username,
      firstName,
      lastName,
      password
    });

    const userId = user._id;

    // Optional: create account with random balance
    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.status(200).json({
      message: "User created successfully",
      token: token,
      user:user
    });
    console.log(user);
 
});



// Signin Route
router.post("/signin", async (req, res) => {
  const parsedContent = siginBody.safeParse(req.body);
  if (!parsedContent.success) {
    return res.status(403).json({ message: "Wrong input format" });
  }

  const userExists = await User.findOne({
    username: req.body.username,
    password: req.body.password
  });

  if (userExists) {
    const token = jwt.sign({ userId: userExists._id }, JWT_SECRET);
    return res.status(200).json({ token: token });
  }

  res.status(411).json({ message: "Error while logging in" });
});

// Edit user info
router.put("/edit", authMiddleware, async (req, res) => {
  const parsedContent = updateBody.safeParse(req.body);
  if (!parsedContent.success) {
    return res.status(411).json({ message: "Wrong input format" });
  }

  await User.updateOne(
    { _id: req.userId }, // filter
    { $set: req.body }   // update data
  );

  return res.status(200).json({ message: "User updated successfully" });
});

// Bulk user search
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      { firstName: { $regex: filter, $options: "i" } },
      { lastName: { $regex: filter, $options: "i" } }
    ]
  });

  res.json({
    users: users.map(user => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id
    }))
  });
});



module.exports = router;