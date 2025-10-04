import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
}

const UserSchema: Schema<IUser> = new Schema({
  name: String,
  email: { type: String, unique: true },
});

export default (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
