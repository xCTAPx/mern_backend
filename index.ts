export {}; // for avoiding ts-nodejs error (Cannot redeclare block-scoped variable ...)

import { Request, Response } from "express";

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./src/routes/auth");
const errorMiddleware = require("./src/middlewares/errors-middleware");

const URL_PREFIX = "/api";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

mongoose.set("useCreateIndex", true);

// external middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use(`${URL_PREFIX}/auth`, authRoute);

// internal middlewares
app.use(errorMiddleware);

app.get(`${URL_PREFIX}`, (_request: Request, response: Response): void => {
  response.send("Backend part of application in development process now...");
});

const startApp = async () => {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(port, () => console.log(`Server has been started. Port: ${port}`));
};

startApp();
