import bcrypt from "bcryptjs";
import User, { UserDocument } from "../models/User";
import { IUser } from "../types";

type CreateUserPayload = Pick<IUser, "username" | "email" | "password">;

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = await bcrypt.genSalt(10);
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  candidatePassword: string,
  storedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, storedPassword);
};

export const createUser = async ({
  username,
  email,
  password,
}: CreateUserPayload): Promise<UserDocument> => {
  const hashedPassword = await hashPassword(password);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  return user;
};

export const findUserByEmail = async (
  email: string
): Promise<UserDocument | null> => {
  return User.findOne({ email }).exec();
};
