import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlobalService } from 'src/common/global-service';
import { MatchFormat, MatchFormatDocument } from './format.schema';
import { CreateMatchFormatDtoType } from './format.dto';

@Injectable()
export class MatchFormatService extends GlobalService<
  MatchFormat,
  MatchFormatDocument
> {
  constructor(
    @InjectModel(MatchFormat.name)
    private matchFormatModel: Model<MatchFormatDocument>,
  ) {
    super(matchFormatModel);
  }
}
