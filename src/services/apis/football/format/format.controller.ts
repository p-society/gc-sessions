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
import { MatchFormatService } from './format.service';
import { CreateMatchFormatDtoType } from './format.dto';
import { RolesGuard } from '../../users/roles.guard';
import { Roles } from '../../users/decorator/roles.decorator';
import { UserRole } from '../../users/constants/user-role';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('football/formats')
export class FootballFormatController {
  constructor(private readonly formatService: MatchFormatService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createFormatDto: CreateMatchFormatDtoType) {
    return this.formatService._create(createFormatDto);
  }

  @Get()
  findAll() {
    return this.formatService._find({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formatService._get(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateFormatDto: Partial<CreateMatchFormatDtoType>,
  ) {
    return this.formatService._patch(id, updateFormatDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.formatService._remove(id, {}, req.user);
  }
}
