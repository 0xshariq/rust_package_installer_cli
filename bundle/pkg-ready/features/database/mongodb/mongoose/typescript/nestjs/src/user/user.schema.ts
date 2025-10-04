import { Schema, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
}

export const UserSchema = new Schema<User>({
  name: String,
  email: { type: String, unique: true },
});
