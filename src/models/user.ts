import { Schema, model } from "mongoose";
import { UserModel } from "../types";

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
    type: Boolean,
    default: false,
  },
  activationLink: String,
});

export default model<UserModel>("User", userSchema);
