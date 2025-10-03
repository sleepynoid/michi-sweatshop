/*
  Warnings:

  - You are about to drop the column `handle` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `handle`;

-- CreateIndex
CREATE UNIQUE INDEX `Variant_sku_key` ON `Variant`(`sku`);
