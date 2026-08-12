import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
  constructor() {}

  @Get()
  healthCheck(): string {
    return 'Client Gateway is running and healthy!';
  }


}
