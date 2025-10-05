-- CreateTable
CREATE TABLE `Image` (
    `uuid` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `alt_text` VARCHAR(191) NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `variantId` VARCHAR(191) NULL,

    UNIQUE INDEX `Image_productId_position_key`(`productId`, `position`),
    UNIQUE INDEX `Image_variantId_position_key`(`variantId`, `position`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `Variant`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
