import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { User } from "./user.model";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: ReturnModelType<typeof User>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
