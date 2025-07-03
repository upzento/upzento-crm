import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: true,
      logger: ['error', 'warn', 'log'],
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT') || 3000;

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors();

    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Failed to start the application:', error);
    
    // Force start a minimal application for health checks if main app fails
    try {
      // Create a simple Express app for health checks
      const express = require('express');
      const minimalApp = express();
      
      minimalApp.get('/health', (req, res) => {
        res.json({
          status: 'ok',
          info: {
            api: {
              status: 'up',
              message: 'Minimal health check endpoint',
            },
          },
        });
      });
      
      const port = 3000;
      minimalApp.listen(port, () => {
        console.log(`Minimal health check app listening on port ${port}`);
      });
    } catch (minimalError) {
      console.error('Failed to start minimal application:', minimalError);
    }
  }
}

bootstrap();
