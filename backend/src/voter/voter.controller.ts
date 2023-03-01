import { Body, Controller, Get, Post } from '@nestjs/common';
import { Voter } from '@prisma/client';
import { Voter as VoterRequest } from './voter.request';
import { VoterService } from './voter.service';

@Controller('voters')
export class VoterController {
  constructor(private voterService: VoterService) {}
  @Post()
  async register(@Body() voter: VoterRequest) {
    return this.voterService.registerVoter(voter as Voter);
  }

  @Get()
  async getAllVoters() {
    return this.voterService.listVoters();
  }
}
