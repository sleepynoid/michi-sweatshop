-- CreateTable
CREATE TABLE "public"."User" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."Product" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "product_type" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."Variant" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "inventory_quantity" INTEGER NOT NULL,
    "inventory_policy" TEXT NOT NULL,
    "option1" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "productId" UUID NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."InventoryItem" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sku" TEXT NOT NULL,
    "tracked" BOOLEAN NOT NULL,
    "available" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "variantId" UUID NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "productId" UUID,
    "variantId" UUID,
    "filename" TEXT,
    "size" INTEGER,
    "mime_type" TEXT,
    "width" INTEGER,
    "height" INTEGER,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_sku_key" ON "public"."Variant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_variantId_key" ON "public"."InventoryItem"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_productId_position_key" ON "public"."Image"("productId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Image_variantId_position_key" ON "public"."Image"("variantId", "position");

-- AddForeignKey
ALTER TABLE "public"."Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InventoryItem" ADD CONSTRAINT "InventoryItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."Variant"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "public"."Variant"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
