import { SupportClient, DescribeTrustedAdvisorChecksCommand, DescribeTrustedAdvisorCheckResultCommand } from "@aws-sdk/client-support";

const client = new SupportClient({ region: process.env.AWS_REGION });

export const describeChecks = async () => {
  const command = new DescribeTrustedAdvisorChecksCommand({ language: "en" });
  return await client.send(command);
};

export const checkResult = async (checkId) => {
  const command = new DescribeTrustedAdvisorCheckResultCommand({ checkId, language: "en" });
  return await client.send(command);
};
