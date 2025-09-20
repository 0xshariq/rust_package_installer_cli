import { EC2Client, DescribeVolumesCommand, CreateVolumeCommand, DeleteVolumeCommand, AttachVolumeCommand, DetachVolumeCommand } from "@aws-sdk/client-ec2";

const ec2 = new EC2Client({
  region: process.env.AWS_REGION,
  ...(process.env.AWS_ACCESS_KEY_ID ? { credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } } : {}),
});

export function listVolumes(filters) {
  const Filters = filters ? Object.entries(filters).map(([Name, Value]) => ({ Name, Values: [Value] })) : undefined;
  return ec2.send(new DescribeVolumesCommand({ Filters }));
}
export function createVolume(az, sizeGiB, volumeType = "gp3", tagKey, tagValue) {
  return ec2.send(new CreateVolumeCommand({
    AvailabilityZone: az, Size: sizeGiB, VolumeType: volumeType,
    TagSpecifications: tagKey && tagValue ? [{ ResourceType: "volume", Tags: [{ Key: tagKey, Value: tagValue }] }] : undefined,
  }));
}
export function deleteVolume(volumeId) { return ec2.send(new DeleteVolumeCommand({ VolumeId: volumeId })); }
export function attachVolume(volumeId, instanceId, device) { return ec2.send(new AttachVolumeCommand({ VolumeId: volumeId, InstanceId: instanceId, Device: device })); }
export function detachVolume(volumeId, instanceId, device, force) { return ec2.send(new DetachVolumeCommand({ VolumeId: volumeId, InstanceId: instanceId, Device: device, Force: force })); }
