/*
  Warnings:

  - You are about to drop the column `userId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_userId_fkey`;

-- DropIndex
DROP INDEX `Item_userId_fkey` ON `Item`;

-- AlterTable
ALTER TABLE `Item` DROP COLUMN `userId`;
