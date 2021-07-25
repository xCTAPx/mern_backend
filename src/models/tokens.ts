export {}; // for avoiding ts-nodejs error (Cannot redeclare block-scoped variable ...)

const { Schema, model } = require("mongoose");

const tokensSchema = new Schema({
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Tokens", tokensSchema);
