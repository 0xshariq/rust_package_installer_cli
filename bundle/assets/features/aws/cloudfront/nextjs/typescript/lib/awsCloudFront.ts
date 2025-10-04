import { CloudFrontClient, CreateDistributionCommand, ListDistributionsCommand, DeleteDistributionCommand, GetDistributionCommand } from "@aws-sdk/client-cloudfront";

const client = new CloudFrontClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const createDistribution = async (originDomain: string) => {
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
};

export const listDistributions = async () => {
  const command = new ListDistributionsCommand({});
  return await client.send(command);
};

export const deleteDistribution = async (id: string, etag: string) => {
  const command = new DeleteDistributionCommand({ Id: id, IfMatch: etag });
  return await client.send(command);
};

export const getDistribution = async (id: string) => {
  const command = new GetDistributionCommand({ Id: id });
  return await client.send(command);
};
