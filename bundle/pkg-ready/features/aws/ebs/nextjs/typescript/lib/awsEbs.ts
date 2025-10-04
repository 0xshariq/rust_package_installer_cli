import {
  EC2Client,
  DescribeVolumesCommand,
  CreateVolumeCommand,
  DeleteVolumeCommand,
  AttachVolumeCommand,
  DetachVolumeCommand,
} from "@aws-sdk/client-ec2";

const ec2 = new EC2Client({
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID
    ? { credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! } }
    : {}),
});

export function listVolumes(filters?: { [k: string]: string }) {
  const Filters = filters
    ? Object.entries(filters).map(([Name, Value]) => ({ Name, Values: [Value] }))
    : undefined;
  return ec2.send(new DescribeVolumesCommand({ Filters }));
}

export function createVolume(az: string, sizeGiB: number, volumeType: string = "gp3", tagKey?: string, tagValue?: string) {
  return ec2.send(
    new CreateVolumeCommand({
      AvailabilityZone: az,
      Size: sizeGiB,
      VolumeType: volumeType as any,
      TagSpecifications: tagKey && tagValue ? [{ ResourceType: "volume", Tags: [{ Key: tagKey, Value: tagValue }] }] : undefined,
    })
  );
}

export function deleteVolume(volumeId: string) {
  return ec2.send(new DeleteVolumeCommand({ VolumeId: volumeId }));
}

export function attachVolume(volumeId: string, instanceId: string, device: string) {
  return ec2.send(new AttachVolumeCommand({ VolumeId: volumeId, InstanceId: instanceId, Device: device }));
}

export function detachVolume(volumeId: string, instanceId?: string, device?: string, force?: boolean) {
  return ec2.send(new DetachVolumeCommand({ VolumeId: volumeId, InstanceId: instanceId, Device: device, Force: force }));
}
