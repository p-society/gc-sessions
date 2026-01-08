import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './services/apis/auth/auth.module';
import { AdapterModule } from './services/redis/adapter/adapter.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from './services/redis/redis.module';
import { UsersModule } from './services/apis/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReactionsModule } from './services/apis/reactions/reactions.module';
import { ProfilesModule } from './services/apis/profiles/profiles.module';
import { QueueModule } from './services/bullmq/queue.module';
import { BullModule } from '@nestjs/bullmq';
import { MatchesModule } from './services/apis/matches/matches.module';
import { SquadModule } from './services/apis/squad/squad.module';
import { SquadPlayerModule } from './services/apis/squadPlayer/squadPlayer.module';
import { TeamModule } from './services/apis/team/team.module';
import { TeamPlayerModule } from './services/apis/teamPlayer/teamPlayer.module';
import { GenerateOtpModule } from './services/apis/otp/generateOtp.module';
import { MailerModule } from './services/apis/mailer/mailer.module';
import { MatchGatewayModule } from './services/gateways/match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    RedisModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    QueueModule,
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    AdapterModule,
    MatchesModule,
    SquadModule,
    SquadPlayerModule,
    TeamModule,
    TeamPlayerModule,
    ProfilesModule,
    ReactionsModule,
    GenerateOtpModule,
    MailerModule,
    MatchGatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
