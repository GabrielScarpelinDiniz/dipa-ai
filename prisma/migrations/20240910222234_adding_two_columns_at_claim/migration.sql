/*
  Warnings:

  - Added the required column `claimServiceCategory` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relatedDisease` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "claimServiceCategory" TEXT NOT NULL,
ADD COLUMN     "relatedDisease" TEXT NOT NULL;
