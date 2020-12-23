import { IsOptional, IsString } from 'class-validator';

export class SubscribeDto {
  @IsString()
  plan!: string;

  @IsString()
  paymentMethod!: string;

  @IsString()
  @IsOptional()
  coupon?: string;
}
