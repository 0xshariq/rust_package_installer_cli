import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { XRayService } from "./xray.service";

@Controller("xray")
export class XRayController {
  constructor(private readonly svc: XRayService) {}

  @Post("segments")
  putSegments(@Body("segments") segments: string[]) {
    return this.svc.putTraceSegments(segments);
  }

  @Get("service-graph")
  getServiceGraph(@Query("start") start: string, @Query("end") end: string) {
    return this.svc.getServiceGraph(new Date(start), new Date(end));
  }

  @Get("summaries")
  getSummaries(@Query("start") start: string, @Query("end") end: string, @Query("filter") filter?: string) {
    return this.svc.getTraceSummaries(new Date(start), new Date(end), filter);
  }
}
