import { Module } from "@nestjs/common";
import { XRayService } from "./xray.service";
import { XRayController } from "./xray.controller";

@Module({
  providers: [XRayService],
  controllers: [XRayController],
  exports: [XRayService],
})
export class XRayModule {}
