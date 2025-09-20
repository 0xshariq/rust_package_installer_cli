import { Injectable } from "@nestjs/common";
import { ConfigServiceClient, DescribeConfigRulesCommand, GetComplianceDetailsByConfigRuleCommand } from "@aws-sdk/client-config-service";

@Injectable()
export class AwsConfigService {
  private client = new ConfigServiceClient({ region: process.env.AWS_REGION });

  async listConfigRules() {
    const res = await this.client.send(new DescribeConfigRulesCommand({}));
    return res.ConfigRules ?? [];
  }

  async getComplianceDetails(ruleName: string) {
    const res = await this.client.send(new GetComplianceDetailsByConfigRuleCommand({ ConfigRuleName: ruleName }));
    return res.EvaluationResults ?? [];
  }
}
