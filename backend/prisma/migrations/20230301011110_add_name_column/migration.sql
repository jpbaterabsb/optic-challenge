/*
  Warnings:

  - Added the required column `name` to the `VotingResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VotingResult" ADD COLUMN     "name" TEXT NOT NULL;
