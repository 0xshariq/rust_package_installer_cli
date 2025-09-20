// app/utils/aws.organizations.server.ts
import { OrganizationsClient, ListAccountsCommand, DescribeOrganizationCommand } from "@aws-sdk/client-organizations";

function client() {
  return new OrganizationsClient({ region: process.env.AWS_REGION });
}

export async function orgListAccounts() {
  const c = client();
  const accounts: any[] = [];
  let NextToken: string | undefined;

  do {
    const res = await c.send(new ListAccountsCommand({ NextToken }));
    accounts.push(...(res.Accounts ?? []));
    NextToken = res.NextToken;
  } while (NextToken);

  return accounts;
}

export async function orgDescribe() {
  const c = client();
  const res = await c.send(new DescribeOrganizationCommand({}));
  return res.Organization ?? null;
}
