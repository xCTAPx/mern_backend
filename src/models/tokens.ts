import { Schema, model } from "mongoose";
import { TokensModelType } from "../types";

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

export const TokensModel = model<TokensModelType>("Tokens", tokensSchema);
