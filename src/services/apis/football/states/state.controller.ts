import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MatchStateService } from './state.service';
import { CreateMatchStateDtoType } from './state.dto';
import { RolesGuard } from '../../users/roles.guard';
import { Roles } from '../../users/decorator/roles.decorator';
import { UserRole } from '../../users/constants/user-role';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('football/states')
export class FootballStateController {
  constructor(private readonly stateService: MatchStateService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createStateDto: CreateMatchStateDtoType) {
    return this.stateService._create(createStateDto);
  }

  @Get(':matchId/state')
  getMatchState(@Param('matchId') matchId: string) {
    return this.stateService._get(matchId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateStateDto: Partial<CreateMatchStateDtoType>,
  ) {
    return this.stateService._patch(id, updateStateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.stateService._remove(id, {}, req.user);
  }
}
