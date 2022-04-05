const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ajay:GUtKg7vJ2bJAXHeB@blog-mern-app.9uuvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log("Connected with db " + i);
  } catch (err) {
    console.log(`Error ${err.message}`);
  }
};

module.exports = dbConnect;
