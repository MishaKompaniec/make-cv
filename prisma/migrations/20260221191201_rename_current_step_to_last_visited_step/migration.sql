/*
  Warnings:

  - You are about to drop the column `currentStep` on the `Cv` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cv" DROP COLUMN "currentStep",
ADD COLUMN     "lastVisitedStep" TEXT NOT NULL DEFAULT 'choose-template';
