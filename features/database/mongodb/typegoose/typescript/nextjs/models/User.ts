import { getModelForClass, prop } from "@typegoose/typegoose";

export class User {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;
}

export default getModelForClass(User);
