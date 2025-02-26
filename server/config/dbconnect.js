const { default: mongoose } = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/test`);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDb };
