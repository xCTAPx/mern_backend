import { Schema, model } from "mongoose";
import { TokensModel } from "../types";

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
    required: true,
  },
});

export default model<TokensModel>("Tokens", tokensSchema);
