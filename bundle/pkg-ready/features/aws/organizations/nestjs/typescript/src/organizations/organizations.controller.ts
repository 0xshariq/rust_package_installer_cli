import { Controller, Get } from "@nestjs/common";
import { OrganizationsService } from "./organizations.service";

@Controller("api/organizations")
export class OrganizationsController {
  constructor(private readonly svc: OrganizationsService) {}

  @Get("accounts")
  listAccounts() {
    return this.svc.listAccounts();
  }

  @Get("describe")
  describe() {
    return this.svc.describeOrganization();
  }
}
