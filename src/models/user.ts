export {}; // for avoiding ts-nodejs error (Cannot redeclare block-scoped variable ...)

const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  isActivated: {
    type: String,
    default: false,
  },
  activationLink: String,
});

module.exports = model("User", userSchema);
