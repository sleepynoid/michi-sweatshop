-- DropIndex
DROP INDEX "public"."Image_productId_position_key";

-- DropIndex
DROP INDEX "public"."Image_variantId_position_key";

-- CreateIndex
CREATE INDEX "Image_productId_position_idx" ON "public"."Image"("productId", "position");

-- CreateIndex
CREATE INDEX "Image_variantId_position_idx" ON "public"."Image"("variantId", "position");
