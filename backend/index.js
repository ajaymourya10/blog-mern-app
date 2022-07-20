const express = require("express");
const dbConnect = require("./config/db/dbConnect");
const dotenv = require("dotenv");
const {
  userLoginController,
  userRegisterController,
} = require("./controller/users/userController");
const userRoutes = require("./routes/userRoutes");
const {errorHandler,notFound} = require("./middleware/error/errorHandler")
const app = express();

//dotenv call
dotenv.config();

//database
dbConnect();

//middleware
app.use(express.json());

//user routes
app.use("/api/users", userRoutes);

//error handler middleware
app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running now on ${PORT}`);
});
