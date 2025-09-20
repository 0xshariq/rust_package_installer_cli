import { Injectable } from "@nestjs/common";
import {
  EFSClient,
  DescribeFileSystemsCommand,
  CreateFileSystemCommand,
  DeleteFileSystemCommand,
  DescribeMountTargetsCommand,
  CreateMountTargetCommand,
  DeleteMountTargetCommand,
} from "@aws-sdk/client-efs";

@Injectable()
export class AwsEfsService {
  private efs = new EFSClient({
    region: process.env.AWS_REGION,
    ...(process.env.AWS_ACCESS_KEY_ID
      ? { credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! } }
      : {}),
  });

  list() { return this.efs.send(new DescribeFileSystemsCommand({})); }
  create(performanceMode: "generalPurpose" | "maxIO" = "generalPurpose", encrypted = true, tags?: Record<string, string>) {
    return this.efs.send(new CreateFileSystemCommand({
      PerformanceMode: performanceMode, Encrypted: encrypted,
      Tags: tags ? Object.entries(tags).map(([Key, Value]) => ({ Key, Value })) : undefined,
    }));
  }
  delete(fileSystemId: string) { return this.efs.send(new DeleteFileSystemCommand({ FileSystemId: fileSystemId })); }
  listMountTargets(fileSystemId: string) { return this.efs.send(new DescribeMountTargetsCommand({ FileSystemId: fileSystemId })); }
  createMountTarget(fileSystemId: string, subnetId: string, securityGroups?: string[]) {
    return this.efs.send(new CreateMountTargetCommand({ FileSystemId: fileSystemId, SubnetId: subnetId, SecurityGroups: securityGroups }));
  }
  deleteMountTarget(mountTargetId: string) { return this.efs.send(new DeleteMountTargetCommand({ MountTargetId: mountTargetId })); }
}
