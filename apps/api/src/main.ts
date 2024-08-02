/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const globalPrefix = 'api';
    const version = '1.0';
    app.setGlobalPrefix(globalPrefix);

    const port = process.env.PORT || 3000;

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Msg Converse API')
        .setDescription('The API of a Msg Converse')
        .setVersion(version)
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, swaggerDocument);

    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({ origin: '*' });
    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
