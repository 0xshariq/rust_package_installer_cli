import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { getModelForClass } from "@typegoose/typegoose";
import { User } from "./user.model";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => getModelForClass(User),
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
