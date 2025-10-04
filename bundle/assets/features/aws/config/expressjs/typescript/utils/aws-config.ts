import { ConfigServiceClient, DescribeConfigRulesCommand, GetComplianceDetailsByConfigRuleCommand } from "@aws-sdk/client-config-service";

export function getConfigClient() {
  return new ConfigServiceClient({ region: process.env.AWS_REGION });
}

export async function listConfigRules() {
  const client = getConfigClient();
  const res = await client.send(new DescribeConfigRulesCommand({}));
  return res.ConfigRules ?? [];
}

export async function getComplianceDetails(ruleName: string) {
  const client = getConfigClient();
  const res = await client.send(new GetComplianceDetailsByConfigRuleCommand({ ConfigRuleName: ruleName }));
  return res.EvaluationResults ?? [];
}
