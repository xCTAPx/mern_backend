import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoute } from "./routes";
import { errorsMiddleware } from "./middlewares";
import { mode } from "./utils";

const URL_PREFIX = "/api";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

mongoose.set("useCreateIndex", true);

// external middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use(`${URL_PREFIX}/auth`, authRoute);

// internal middlewares
app.use(errorsMiddleware);

app.get("/", (_request: Request, response: Response): void => {
  response.send(
    `Backend part of application in development process now... (${mode} mode)`
  );
});

const startApp = async () => {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(port, () => console.log(`Server has been started. Port: ${port}`));
};

startApp();
