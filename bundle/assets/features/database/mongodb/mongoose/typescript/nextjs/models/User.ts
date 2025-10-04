import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
});

export default (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
