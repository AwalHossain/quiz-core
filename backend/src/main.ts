import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "*",
  });
  const options = new DocumentBuilder()
    .setTitle("MCQ API")
    .setDescription("The MCQ API description")
    .setVersion("1.0")
    .addTag("MCQ")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

    // Verify DATABASE_URL is loaded
    console.log('DATABASE_URL exists:');
  

  await app.listen(8000);
}
bootstrap();
