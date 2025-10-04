import { Controller, Post, Body } from "@nestjs/common";
import { PaypalService } from "./paypal.service";

@Controller("paypal")
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post("create")
  createOrder() {
    return this.paypalService.createOrder();
  }

  @Post("capture")
  captureOrder(@Body("orderID") orderID: string) {
    return this.paypalService.captureOrder(orderID);
  }

  @Post("refund")
  refund(@Body("captureID") captureID: string) {
    return this.paypalService.refund(captureID);
  }
}
