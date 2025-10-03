/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Item` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `uuid` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uuid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Item` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `uuid` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`uuid`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `uuid` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`uuid`);
