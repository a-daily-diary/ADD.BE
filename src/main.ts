import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import * as path from 'path';
import { AppModule } from './app.module';
import { HttpApiExceptionFilter } from './common/exceptions/http-api-exceptions.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';

class Application {
  private logger = new Logger(Application.name);
  private DEV_MODE: boolean;
  private PORT: string;
  private corsOriginList: string | boolean | RegExp | (string | RegExp)[];
  private ADMIN_USER: string;
  private ADMIN_PASSWORD: string;

  constructor(private server: NestExpressApplication) {
    this.server = server;

    if (!process.env.SECRET_KEY) this.logger.error('🔥Set "SECRET" env');
    this.DEV_MODE = process.env.NODE_ENV === 'production';
    this.PORT = process.env.PORT || '5000';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : true;
    this.ADMIN_USER = process.env.ADMIN_USER || 'admin';
    this.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
  }

  private setUpBasicAuth() {
    this.server.use(
      ['/docs', '/docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [this.ADMIN_USER]: this.ADMIN_PASSWORD,
        },
      }),
    );
  }

  private setUpOpenAPIMiddleware() {
    SwaggerModule.setup(
      'docs',
      this.server,
      SwaggerModule.createDocument(
        this.server,
        new DocumentBuilder()
          .setTitle('A Daily Diary - API')
          .setDescription('TypeORM In Nest')
          .setVersion('0.0.1')
          .addBearerAuth(
            {
              type: 'http',
              scheme: 'bearer',
              name: 'JWT',
              in: 'header',
            },
            'access-token',
          )
          .build(),
      ),
    );
  }

  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });
    this.setUpBasicAuth();
    this.setUpOpenAPIMiddleware();
    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    this.server.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.server.get(Reflector)),
    ); // 해당 interceptor를 통해 exclude 데코레이터가 붙은 필드를 조회 결과에서 제외해준다.
    this.server.useGlobalInterceptors(new SuccessInterceptor());
    this.server.useGlobalFilters(new HttpApiExceptionFilter());
    this.server.useWebSocketAdapter(new IoAdapter(this.server));
    this.server.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
      prefix: '/media',
    });
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
