import { Injectable } from "@nestjs/common";
import { OrganizationsClient, ListAccountsCommand, DescribeOrganizationCommand, Account } from "@aws-sdk/client-organizations";

@Injectable()
export class OrganizationsService {
  private client = new OrganizationsClient({ region: process.env.AWS_REGION });

  async listAccounts(): Promise<Account[]> {
    const out: Account[] = [];
    let NextToken: string | undefined;

    do {
      const res = await this.client.send(new ListAccountsCommand({ NextToken }));
      out.push(...(res.Accounts ?? []));
      NextToken = res.NextToken;
    } while (NextToken);

    return out;
  }

  async describeOrganization() {
    const res = await this.client.send(new DescribeOrganizationCommand({}));
    return res.Organization ?? null;
  }
}
