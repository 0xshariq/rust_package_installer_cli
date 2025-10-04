import { Injectable } from "@nestjs/common";
import { SupportClient, DescribeTrustedAdvisorChecksCommand, DescribeTrustedAdvisorCheckResultCommand } from "@aws-sdk/client-support";

const client = new SupportClient({ region: process.env.AWS_REGION });

@Injectable()
export class AwsTrustedAdvisorService {
  async describeChecks() {
    const command = new DescribeTrustedAdvisorChecksCommand({ language: "en" });
    return await client.send(command);
  }

  async checkResult(checkId: string) {
    const command = new DescribeTrustedAdvisorCheckResultCommand({ checkId, language: "en" });
    return await client.send(command);
  }
}
