import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto';
import { ListMetricsQueryDto } from './dto/list-metrics-query.dto';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  ingest(@Body() dto: CreateMetricDto) {
    return this.metricsService.ingest(dto);
  }

  @Get()
  findRecent(@Query() query: ListMetricsQueryDto) {
    return this.metricsService.findRecent(query.limit, query.fingerprint);
  }

  @Get('hosts')
  findHosts() {
    return this.metricsService.findHosts();
  }
}
