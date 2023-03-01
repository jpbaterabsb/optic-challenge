import { Body, Controller, Get, Post } from '@nestjs/common';
import { VotingResult } from '@prisma/client';
import { VotingResultRequest } from './voting-result.request';
import { VotingResultService } from './voting-result.service';

@Controller('voting-results')
export class VotingResultController {
  constructor(private service: VotingResultService) {}
  @Post()
  async register(@Body() request: VotingResultRequest) {
    return this.service.registerVotingResult(request as VotingResult);
  }

  @Get()
  async getAllVoters() {
    return this.service.listOptions();
  }
}
