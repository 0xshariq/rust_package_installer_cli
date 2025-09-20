import { Controller, Get, Post, Delete, Body, Query } from "@nestjs/common";
import { AwsEfsService } from "./aws-efs.service";

@Controller("aws-efs")
export class AwsEfsController {
  constructor(private readonly svc: AwsEfsService) {}

  @Get("filesystems")
  list() { return this.svc.list(); }

  @Get("mount-targets")
  mounts(@Query("fileSystemId") fileSystemId: string) {
    return this.svc.listMountTargets(fileSystemId);
  }

  @Post()
  action(@Body() body: any) {
    switch (body.type) {
      case "create-fs": return this.svc.create(body.performanceMode, body.encrypted, body.tags);
      case "create-mt": return this.svc.createMountTarget(body.fileSystemId, body.subnetId, body.securityGroups);
      default: return { error: "invalid type" };
    }
  }

  @Delete()
  remove(@Body() body: any) {
    if (body.mountTargetId) return this.svc.deleteMountTarget(body.mountTargetId);
    if (body.fileSystemId) return this.svc.delete(body.fileSystemId);
    return { error: "missing identifier" };
  }
}
