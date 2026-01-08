/*
  Warnings:

  - You are about to drop the column `inventory_quantity` on the `Variant` table. All the data in the column will be lost.
  - You are about to drop the `InventoryItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `available` to the `Variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add new columns with temporary default values
ALTER TABLE "public"."Variant" 
ADD COLUMN "available" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "cost" INTEGER NOT NULL DEFAULT 0;

-- Step 2: Copy data from InventoryItem to Variant
UPDATE "public"."Variant" v
SET 
  "available" = i."available",
  "cost" = i."cost"
FROM "public"."InventoryItem" i
WHERE v."uuid" = i."variantId";

-- Step 3: Drop the foreign key constraint
ALTER TABLE "public"."InventoryItem" DROP CONSTRAINT "InventoryItem_variantId_fkey";

-- Step 4: Drop the InventoryItem table
DROP TABLE "public"."InventoryItem";

-- Step 5: Drop the old inventory_quantity column
ALTER TABLE "public"."Variant" DROP COLUMN "inventory_quantity";
