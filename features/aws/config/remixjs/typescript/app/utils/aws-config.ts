import { ConfigServiceClient, DescribeConfigRulesCommand, GetComplianceDetailsByConfigRuleCommand } from "@aws-sdk/client-config-service";

function client() {
  return new ConfigServiceClient({ region: process.env.AWS_REGION });
}

export async function listConfigRules() {
  const c = client();
  const res = await c.send(new DescribeConfigRulesCommand({}));
  return res.ConfigRules ?? [];
}

export async function getComplianceDetails(ruleName: string) {
  const c = client();
  const res = await c.send(new GetComplianceDetailsByConfigRuleCommand({ ConfigRuleName: ruleName }));
  return res.EvaluationResults ?? [];
}
