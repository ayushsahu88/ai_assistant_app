import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Success");
  } catch (error) {
    console.log("MongoDB Error", error);
  }
};

export default connectDB;
