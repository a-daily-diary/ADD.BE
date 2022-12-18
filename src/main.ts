import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { HttpApiExceptionFilter } from './common/exceptions/http-api-exceptions.filter';

class Application {
  private logger = new Logger(Application.name);
  private DEV_MODE: boolean;
  private PORT: string;
  private corsOriginList: string[];

  constructor(private server: NestExpressApplication) {
    this.server = server;

    if (!process.env.SECRET_KEY) this.logger.error('🔥Set "SECRET" env');
    this.DEV_MODE = process.env.NODE_ENV === 'production';
    this.PORT = process.env.PORT || '5000';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];
  }

  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });
    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
    ); // 해당 interceptor를 통해 exclude 데코레이터가 붙은 필드를 조회 결과에서 제외해준다.
    this.server.useGlobalFilters(new HttpApiExceptionFilter());
  }

  async bootstrap() {
    await this.setUpGlobalMiddleware();
    await this.server.listen(this.PORT);
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }

  errorLog(error: string) {
    this.logger.error(`🆘 Server error ${error}`);
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Application(server);

  await app.bootstrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
