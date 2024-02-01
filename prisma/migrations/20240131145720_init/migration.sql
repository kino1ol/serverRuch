/*
  Warnings:

  - You are about to drop the column `isEquipment` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "isEquipment",
ADD COLUMN     "isEquipmentConfiguration" BOOLEAN NOT NULL DEFAULT false;
