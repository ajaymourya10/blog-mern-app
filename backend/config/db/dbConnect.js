const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
     "enter db string here",{
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log("Connected with db ");
  } catch (err) {
    console.log(`Error ${err.message}`);
  }
};

module.exports = dbConnect;
