const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const port = process.env.PORT || 80;

const app = express();

app.use(express.json());

app.get("/", (_request, response) => {
  response.send(
    "Hello world! It is backend part of future app. It is in development process now..."
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
