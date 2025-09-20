import { Injectable } from "@nestjs/common";
import { CloudFrontClient, CreateDistributionCommand, ListDistributionsCommand, DeleteDistributionCommand } from "@aws-sdk/client-cloudfront";

@Injectable()
export class AwsCloudFrontService {
  private client = new CloudFrontClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  listDistributions() {
    return this.client.send(new ListDistributionsCommand({}));
  }

  createDistribution(originDomain: string) {
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

    return this.client.send(new CreateDistributionCommand(params));
  }

  deleteDistribution(id: string, etag: string) {
    return this.client.send(new DeleteDistributionCommand({ Id: id, IfMatch: etag }));
  }
}
