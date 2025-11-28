import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "../types";

export type UserDocument = Document & IUser;

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },
    profilePicture: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const User: Model<UserDocument> =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", UserSchema);

export default User;

