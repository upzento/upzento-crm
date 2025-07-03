import { Controller, Get, Module } from '@nestjs/common';

@Controller('health')
class MinimalHealthController {
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      info: {
        api: {
          status: 'up',
          message: 'Minimal health check endpoint',
        },
      },
    };
  }
}

@Module({
  controllers: [MinimalHealthController],
})
export class MinimalAppModule {} 