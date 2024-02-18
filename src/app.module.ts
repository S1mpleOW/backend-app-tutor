import appConfig from './config/app.config';
import authConfig from './auth/config/auth.config';
import databaseConfig from './database/config/database.config';
import fileConfig from './files/config/file.config';
import mailConfig from './mail/config/mail.config';
import path from 'path';
import { AllConfigType } from './config/config.type';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './database/config/database-config.type';
import { DataSource, DataSourceOptions } from 'typeorm';
import { FilesModule } from './files/files.module';
import { HeaderResolver } from 'nestjs-i18n';
import { HomeModule } from './home/home.module';
import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { LearnersModule } from './learners/learners.module';
import { MailerModule } from './mailer/mailer.module';
import { MailModule } from './mail/mail.module';
import { Module } from '@nestjs/common';
import { MongooseConfigService } from './database/mongoose-config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionModule } from './session/session.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
      envFilePath: ['.env'],
    }),
    (databaseConfig() as DatabaseConfig).isDocumentDatabase
      ? MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
        })
      : TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
          dataSourceFactory: async (options: DataSourceOptions) => {
            return new DataSource(options).initialize();
          },
        }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    LearnersModule,
    UsersModule,
    FilesModule,
    AuthModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
  ],
})
export class AppModule {}
