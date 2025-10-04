import { CloudFrontClient, CreateDistributionCommand, ListDistributionsCommand, DeleteDistributionCommand } from "@aws-sdk/client-cloudfront";

const client = new CloudFrontClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function createDistribution(originDomain) {
  const params = {
    DistributionConfig: {
      CallerReference: `${Date.now()}`,
      Comment: "Created via API",
      Enabled: true,
      Origins: {
        Quantity: 1,
        Items: [
          {
            Id: "origin1",
            DomainName: originDomain,
            CustomOriginConfig: {
              HTTPPort: 80,
              HTTPSPort: 443,
              OriginProtocolPolicy: "https-only",
            },
          },
        ],
      },
      DefaultCacheBehavior: {
        TargetOriginId: "origin1",
        ViewerProtocolPolicy: "redirect-to-https",
        TrustedSigners: { Enabled: false, Quantity: 0 },
      },
    },
  };

  const command = new CreateDistributionCommand(params);
  return await client.send(command);
}

export async function listDistributions() {
  const command = new ListDistributionsCommand({});
  return await client.send(command);
}

export async function deleteDistribution(id, etag) {
  const command = new DeleteDistributionCommand({ Id: id, IfMatch: etag });
  return await client.send(command);
}
