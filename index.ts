export {}; // for avoiding ts-nodejs error (Cannot redeclare block-scoped variable ...)

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./src/routes/auth");

const URL_PREFIX = "/api";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get(`${URL_PREFIX}`, (_request, response): void => {
  response.send("Backend part of application in development process now...");
});

app.use(`${URL_PREFIX}/auth`, authRoute);

const startApp = async () => {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(port, () => console.log(`Server has been started. Port: ${port}`));
};

startApp();
