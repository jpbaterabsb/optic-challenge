-- CreateEnum
CREATE TYPE "State" AS ENUM ('PENDING', 'COMMITTED', 'ABORTED');

-- CreateTable
CREATE TABLE "Voter" (
    "address" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "state" "State" NOT NULL,
    "error" TEXT,

    CONSTRAINT "Voter_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "VotingResult" (
    "option" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "VotingResult_pkey" PRIMARY KEY ("option")
);
