import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class IdentityDto {
  @IsOptional()
  @IsString()
  host_id?: string;

  @IsString()
  fingerprint: string;
}

export class HostInfoDto {
  @IsOptional()
  @IsString()
  host_id?: string;

  @IsOptional()
  @IsString()
  hostname?: string;

  @IsOptional()
  @IsString()
  os?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  platform_family?: string;

  @IsOptional()
  @IsString()
  platform_version?: string;

  @IsOptional()
  @IsString()
  kernel_version?: string;

  @IsOptional()
  @IsString()
  kernel_arch?: string;

  @IsOptional()
  @IsString()
  virtualization_system?: string;

  @IsOptional()
  @IsString()
  virtualization_role?: string;

  @IsOptional()
  @IsNumber()
  uptime_seconds?: number;

  @IsOptional()
  @IsNumber()
  boot_time_unix?: number;

  @IsOptional()
  @IsString()
  go_os?: string;

  @IsOptional()
  @IsString()
  go_arch?: string;

  @IsOptional()
  @IsNumber()
  num_cpu?: number;

  @IsOptional()
  @IsNumber()
  num_goroutine?: number;
}

export class ProcessorDto {
  @IsOptional()
  @IsNumber()
  cpu?: number;

  @IsOptional()
  @IsString()
  vendor_id?: string;

  @IsOptional()
  @IsString()
  model_name?: string;

  @IsOptional()
  @IsNumber()
  mhz?: number;

  @IsOptional()
  @IsNumber()
  cores?: number;

  @IsOptional()
  @IsString()
  physical_id?: string;

  @IsOptional()
  @IsString()
  core_id?: string;
}

export class CpuInfoDto {
  @IsOptional()
  @IsNumber()
  logical_cores?: number;

  @IsOptional()
  @IsNumber()
  physical_cores?: number;

  @IsOptional()
  @IsString()
  model_name?: string;

  @IsOptional()
  @IsString()
  vendor_id?: string;

  @IsOptional()
  @IsNumber()
  mhz?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcessorDto)
  processors?: ProcessorDto[];
}

export class MemoryInfoDto {
  @IsOptional()
  @IsNumber()
  total_bytes?: number;

  @IsOptional()
  @IsNumber()
  available_bytes?: number;

  @IsOptional()
  @IsNumber()
  used_bytes?: number;

  @IsOptional()
  @IsNumber()
  used_percent?: number;
}

export class TemperatureDto {
  @IsString()
  sensor_key: string;

  @IsNumber()
  value_c: number;

  @IsOptional()
  @IsNumber()
  high_c?: number;

  @IsOptional()
  @IsNumber()
  critical_c?: number;
}

export class CreateMetricDto {
  @IsDateString()
  collected_at: string;

  @ValidateNested()
  @Type(() => IdentityDto)
  identity: IdentityDto;

  @ValidateNested()
  @Type(() => HostInfoDto)
  host: HostInfoDto;

  @ValidateNested()
  @Type(() => CpuInfoDto)
  cpu: CpuInfoDto;

  @ValidateNested()
  @Type(() => MemoryInfoDto)
  memory: MemoryInfoDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemperatureDto)
  temperatures?: TemperatureDto[];

  @IsOptional()
  @IsNumber()
  primary_temperature_c?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  warnings?: string[];
}
