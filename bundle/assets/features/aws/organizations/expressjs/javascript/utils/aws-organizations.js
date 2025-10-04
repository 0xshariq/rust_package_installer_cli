import { OrganizationsClient, ListAccountsCommand, DescribeOrganizationCommand } from "@aws-sdk/client-organizations";

export function getOrgClient() {
  return new OrganizationsClient({ region: process.env.AWS_REGION });
}

export async function listAccounts() {
  const client = getOrgClient();
  const out = [];
  let NextToken;

  do {
    const res = await client.send(new ListAccountsCommand({ NextToken }));
    out.push(...(res.Accounts ?? []));
    NextToken = res.NextToken;
  } while (NextToken);

  return out;
}

export async function describeOrganization() {
  const client = getOrgClient();
  const res = await client.send(new DescribeOrganizationCommand({}));
  return res.Organization ?? null;
}
