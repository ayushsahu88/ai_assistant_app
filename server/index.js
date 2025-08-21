import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./db/db.js";
import authRouter from "./routes/authRouters.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import geminiResponse from "./gemini.js";

const app = express();
configDotenv();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
     "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.get("/", async (req, res) => {
  let prompt = req.query.prompt;
  let data = await geminiResponse(prompt);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server runing on PORT ${PORT}`);
  connectDB();
});
