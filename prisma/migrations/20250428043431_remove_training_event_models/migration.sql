/*
  Warnings:

  - You are about to drop the `EventParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `EventParticipant` DROP FOREIGN KEY `EventParticipant_coachId_fkey`;

-- DropForeignKey
ALTER TABLE `EventParticipant` DROP FOREIGN KEY `EventParticipant_eventId_fkey`;

-- DropTable
DROP TABLE `EventParticipant`;

-- DropTable
DROP TABLE `TrainingEvent`;
