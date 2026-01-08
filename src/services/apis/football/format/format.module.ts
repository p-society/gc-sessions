import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FootballFormatController } from './format.controller';
import { MatchFormatService } from './format.service';
import { MatchFormat, MatchFormatSchema } from './format.schema';
import { UsersModule } from '../../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../auth/constants/jwt-constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchFormat.name, schema: MatchFormatSchema },
    ]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [FootballFormatController],
  providers: [MatchFormatService],
  exports: [MatchFormatService],
})
export class FormatModule {}
