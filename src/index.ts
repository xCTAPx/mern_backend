import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.PORT || 80;

const app = express();

app.use(express.json());

app.get("/", (_request, response) => {
  response.send("Hello world!");
});

const startApp = async () => {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(port, () => console.log(`Server has been started. Port: ${port}`));
};

startApp();
