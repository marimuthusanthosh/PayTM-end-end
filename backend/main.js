const express = require("express");
const app = express();
const PORT = 3000;
const cors=require("cors")

app.use(cors());
app.use(express.json());

const userRoute = require("./routes/user");
const accountRoute = require("./routes/account");

// Health check route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Use user-related routes
app.use("/user", userRoute);

// Uncomment this if you create account routes
app.use("/account", accountRoute);

app.listen(PORT, () => {
  console.log("Server listening on PORT", PORT);
});
