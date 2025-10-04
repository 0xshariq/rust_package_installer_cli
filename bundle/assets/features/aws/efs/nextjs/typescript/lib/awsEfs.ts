import {
  EFSClient,
  DescribeFileSystemsCommand,
  CreateFileSystemCommand,
  DeleteFileSystemCommand,
  DescribeMountTargetsCommand,
  CreateMountTargetCommand,
  DeleteMountTargetCommand,
} from "@aws-sdk/client-efs";

const efs = new EFSClient({
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID
    ? { credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! } }
    : {}),
});

export function listFileSystems() {
  return efs.send(new DescribeFileSystemsCommand({}));
}

export function createFileSystem(performanceMode: "generalPurpose" | "maxIO" = "generalPurpose", encrypted = true, tags?: Record<string, string>) {
  return efs.send(
    new CreateFileSystemCommand({
      PerformanceMode: performanceMode,
      Encrypted: encrypted,
      Tags: tags ? Object.entries(tags).map(([Key, Value]) => ({ Key, Value })) : undefined,
    })
  );
}

export function deleteFileSystem(fileSystemId: string) {
  return efs.send(new DeleteFileSystemCommand({ FileSystemId: fileSystemId }));
}

export function listMountTargets(fileSystemId: string) {
  return efs.send(new DescribeMountTargetsCommand({ FileSystemId: fileSystemId }));
}

export function createMountTarget(fileSystemId: string, subnetId: string, securityGroups?: string[]) {
  return efs.send(new CreateMountTargetCommand({ FileSystemId: fileSystemId, SubnetId: subnetId, SecurityGroups: securityGroups }));
}

export function deleteMountTarget(mountTargetId: string) {
  return efs.send(new DeleteMountTargetCommand({ MountTargetId: mountTargetId }));
}
