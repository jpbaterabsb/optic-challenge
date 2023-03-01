import { VotingResult } from '@prisma/client';

export type VotingResultResponse = Partial<VotingResult> & {
  votes?: number;
};
