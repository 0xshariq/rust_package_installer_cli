import { json } from "@remix-run/node";
import { CloudFrontClient, CreateDistributionCommand, ListDistributionsCommand, DeleteDistributionCommand } from "@aws-sdk/client-cloudfront";

const client = new CloudFrontClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const loader = async () => {
  const command = new ListDistributionsCommand({});
  const data = await client.send(command);
  return json(data);
};

export const action = async ({ request }: any) => {
  const { type, originDomain, id, etag } = await request.json();
  let command;

  switch (type) {
    case "create":
      command = new CreateDistributionCommand({
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
      });
      break;
    case "delete":
      command = new DeleteDistributionCommand({ Id: id, IfMatch: etag });
      break;
    default:
      return json({ error: "Invalid type" }, { status: 400 });
  }

  const data = await client.send(command);
  return json(data);
};