import { Injectable } from "@nestjs/common";
import {
  EC2Client,
  DescribeVolumesCommand,
  CreateVolumeCommand,
  DeleteVolumeCommand,
  AttachVolumeCommand,
  DetachVolumeCommand,
} from "@aws-sdk/client-ec2";

@Injectable()
export class AwsEbsService {
  private ec2 = new EC2Client({
    region: process.env.AWS_REGION,
    ...(process.env.AWS_ACCESS_KEY_ID
      ? { credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! } }
      : {}),
  });

  list(filters?: { [k: string]: string }) {
    const Filters = filters ? Object.entries(filters).map(([Name, Value]) => ({ Name, Values: [Value] })) : undefined;
    return this.ec2.send(new DescribeVolumesCommand({ Filters }));
  }
  create(az: string, sizeGiB: number, volumeType = "gp3", tagKey?: string, tagValue?: string) {
    return this.ec2.send(new CreateVolumeCommand({
      AvailabilityZone: az, Size: sizeGiB, VolumeType: volumeType as any,
      TagSpecifications: tagKey && tagValue ? [{ ResourceType: "volume", Tags: [{ Key: tagKey, Value: tagValue }] }] : undefined,
    }));
  }
  delete(volumeId: string) { return this.ec2.send(new DeleteVolumeCommand({ VolumeId: volumeId })); }
  attach(volumeId: string, instanceId: string, device: string) { return this.ec2.send(new AttachVolumeCommand({ VolumeId: volumeId, InstanceId: instanceId, Device: device })); }
  detach(volumeId: string, instanceId?: string, device?: string, force?: boolean) { return this.ec2.send(new DetachVolumeCommand({ VolumeId: volumeId, InstanceId: instanceId, Device: device, Force: force })); }
}
