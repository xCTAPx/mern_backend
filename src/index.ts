import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoute } from "./routes";
import { errorsMiddleware } from "./middlewares";
import { isProduction, mode } from "./utils";

const URL_PREFIX = "/api";

dotenv.config();

const port = process.env.PORT || 5000;
const origin_url = isProduction
  ? "https://mern-frontend-app.herokuapp.com"
  : "http://localhost:3000";

const CORS_OPTIONS = {
  origin: origin_url,
  credentials: true,
  optionsSuccessStatus: 200,
};

const DOCS_URL = `${process.env.API_URL}/api/auth/api-docs`;

const app = express();

mongoose.set("useCreateIndex", true);

// external middlewares
app.use(cors(CORS_OPTIONS));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use(`${URL_PREFIX}/auth`, authRoute);

// internal middlewares
app.use(errorsMiddleware);

app.get(
  "/",
  (_request: Request, response: Response): void => {
    response.send(
      `Backend part of application in development process now... (${mode} mode) </br>
    <h4>Docs: </h4>
    <ul>
      <li>Auth: <a href="${DOCS_URL}">${DOCS_URL}</a></li>
    </ul>
    `
    );
  }
);

const startApp = async () => {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(port, () =>
    console.log(`Server has been started. Port: ${port}`)
  );
};

startApp();
