import { OrganizationsClient, ListAccountsCommand, DescribeOrganizationCommand } from "@aws-sdk/client-organizations";

export function getOrgClient() {
  return new OrganizationsClient({ region: process.env.AWS_REGION });
}

export async function listAccounts() {
  const client = getOrgClient();
  const accounts: any[] = [];
  let NextToken: string | undefined = undefined;

  do {
    const res = await client.send(new ListAccountsCommand({ NextToken }));
    accounts.push(...(res.Accounts ?? []));
    NextToken = res.NextToken;
  } while (NextToken);

  return accounts;
}

export async function describeOrganization() {
  const client = getOrgClient();
  const res = await client.send(new DescribeOrganizationCommand({}));
  return res.Organization ?? null;
}
