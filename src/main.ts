import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppConfigService } from "./app-config/app-config.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setting up Swagger
  const options = new DocumentBuilder()
    .setTitle('Spotter API')
    .setDescription('Support Management of Beat Sheets, Beats and Acts ')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(AppConfigService);
  const port = configService.config.servicePort;
  await app.listen(port);
  console.log("Service listening to port", port);
}

bootstrap();
