const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log("Connected with MongoDB(NO-SQL)");
  } catch (err) {
    console.log(`Error ${err.message}`);
  }
};

module.exports = dbConnect;
