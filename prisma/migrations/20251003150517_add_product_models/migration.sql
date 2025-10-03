/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `uuid` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`uuid`);

-- DropTable
DROP TABLE `Item`;

-- CreateTable
CREATE TABLE `Product` (
    `uuid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `handle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `product_type` VARCHAR(191) NOT NULL,
    `vendor` VARCHAR(191) NOT NULL,
    `tags` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Variant` (
    `uuid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `inventory_quantity` INTEGER NOT NULL,
    `inventory_policy` VARCHAR(191) NOT NULL,
    `option1` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryItem` (
    `uuid` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `tracked` BOOLEAN NOT NULL,
    `available` INTEGER NOT NULL,
    `cost` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `variantId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `InventoryItem_variantId_key`(`variantId`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Variant` ADD CONSTRAINT `Variant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `Variant`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
