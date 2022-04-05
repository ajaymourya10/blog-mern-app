const express = require("express");
const dbConnect = require('./config/db/dbConnect');

const app = express();
//database
dbConnect();

//server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running now on ${PORT}`);
});
