import { prismaClient } from "../Application/database";
import { Variant, UpdateVariantRequest, CreateVariantRequest } from "../model/variant-model";
import { Image } from "../model/image-model";
import { HTTPException } from "hono/http-exception";
import { validateUUID } from "../utils/uuid-validator";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import path = require("path");

export class VariantService {
    static async create(request: CreateVariantRequest): Promise<Variant> {
        if (!request.productId) {
            throw new HTTPException(400, { message: "productId is required to create a variant" });
        }

        // Validate productId UUID format
        validateUUID(request.productId, "Product");

        // Check if product exists
        const product = await prismaClient.product.findFirst({
            where: {
                uuid: request.productId
            }
        });

        if (!product) {
            throw new HTTPException(404, { message: "Product not found" });
        }

        // Check if SKU is unique
        const existingVariant = await prismaClient.variant.findFirst({
            where: {
                sku: request.sku
            }
        });

        if (existingVariant) {
            throw new HTTPException(400, { message: "SKU already exists" });
        }

        // Create variant first
        const variant = await prismaClient.variant.create({
            data: {
                title: request.title,
                price: request.price,
                sku: request.sku,
                available: request.available,
                cost: request.cost,
                inventory_policy: request.inventory_policy,
                option1: request.option1,
                productId: request.productId
            }
        });

        // Create images separately with both productId and variantId
        if (request.images && request.images.length > 0) {
            await prismaClient.image.createMany({
                data: request.images.map((image, index) => ({
                    url: image.url,
                    alt_text: image.alt_text,
                    position: image.position ?? index,
                    productId: request.productId!,
                    variantId: variant.uuid
                }))
            });
        }

        // Fetch variant with images
        const variantWithImages = await prismaClient.variant.findUnique({
            where: { uuid: variant.uuid },
            include: { images: true }
        });

        if (!variantWithImages) {
            throw new HTTPException(500, { message: "Failed to create variant" });
        }

        return {
            uuid: variantWithImages.uuid,
            title: variantWithImages.title,
            price: variantWithImages.price,
            sku: variantWithImages.sku,
            available: variantWithImages.available,
            cost: variantWithImages.cost,
            inventory_policy: variantWithImages.inventory_policy,
            option1: variantWithImages.option1,
            created_at: variantWithImages.created_at,
            updated_at: variantWithImages.updated_at,
            images: variantWithImages.images
        };
    }

    static async update(variantId: string, request: UpdateVariantRequest): Promise<Variant> {
        // Validate variantId UUID format
        validateUUID(variantId, "Variant");

        const variant = await prismaClient.variant.findFirst({
            where: {
                uuid: variantId
            }
        });

        if (!variant) {
            throw new HTTPException(404, { message: "Variant not found" });
        }

        // Update variant
        const updatedVariant = await prismaClient.variant.update({
            where: { uuid: variantId },
            data: {
                title: request.title ?? variant.title,
                price: request.price ?? variant.price,
                sku: request.sku ?? variant.sku,
                inventory_policy: request.inventory_policy ?? variant.inventory_policy,
                option1: request.option1 ?? variant.option1,
                available: request.available ?? variant.available,
                cost: request.cost ?? variant.cost
            },
            include: {
                images: true
            }
        });

        return {
            uuid: updatedVariant.uuid,
            title: updatedVariant.title,
            price: updatedVariant.price,
            sku: updatedVariant.sku,
            available: updatedVariant.available,
            cost: updatedVariant.cost,
            inventory_policy: updatedVariant.inventory_policy,
            option1: updatedVariant.option1,
            created_at: updatedVariant.created_at,
            updated_at: updatedVariant.updated_at,
            images: updatedVariant.images
        };
    }

    static async getById(variantId: string): Promise<Variant> {
        // Validate variantId UUID format
        validateUUID(variantId, "Variant");

        const variant = await prismaClient.variant.findFirst({
            where: {
                uuid: variantId
            },
            include: {
                images: true
            }
        });

        if (!variant) {
            throw new HTTPException(404, { message: "Variant not found" });
        }

        return {
            uuid: variant.uuid,
            title: variant.title,
            price: variant.price,
            sku: variant.sku,
            available: variant.available,
            cost: variant.cost,
            inventory_policy: variant.inventory_policy,
            option1: variant.option1,
            created_at: variant.created_at,
            updated_at: variant.updated_at,
            images: variant.images
        };
    }

    static async uploadImageFile(
        variantId: string,
        request: {
            buffer: Buffer;
            filename: string;
            mimeType: string;
            altText?: string;
            position?: number;
        }
    ): Promise<Image> {
        // Validate variantId UUID format
        validateUUID(variantId, "Variant");

        // Validate variant exists and get productId
        const variant = await prismaClient.variant.findFirst({
            where: { uuid: variantId }
        });
        if (!variant) {
            throw new HTTPException(404, { message: "Variant not found" });
        }

        const productId = variant.productId;

        // Generate unique filename
        const fileExtension = path.extname(request.filename);
        const uniqueFilename = `${randomUUID()}${fileExtension}`;

        // Ensure upload directory exists (same as product images)
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        const productDir = path.join(uploadDir, 'products', productId);
        await fs.mkdir(productDir, { recursive: true });

        // Save file
        const filePath = path.join(productDir, uniqueFilename);
        await fs.writeFile(filePath, request.buffer);

        // Get file stats
        const stats = await fs.stat(filePath);

        // Use SELECT FOR UPDATE to lock rows and prevent race conditions
        const image = await prismaClient.$transaction(async (tx) => {
            // Lock the variant row to prevent concurrent position conflicts
            // This works even when there are no images yet
            await tx.$queryRaw`
                SELECT uuid 
                FROM "Variant" 
                WHERE uuid = ${variantId}::uuid
                FOR UPDATE
            `;

            // Now safely get max position (variant is locked)
            const maxPositionResult = await tx.$queryRaw<Array<{ max: number | null }>>`
                SELECT MAX(position) as max
                FROM "Image" 
                WHERE "variantId" = ${variantId}::uuid
            `;

            const maxPosition = maxPositionResult[0]?.max;
            const nextPosition = maxPosition !== null ? maxPosition + 1 : 0;

            // Create image with calculated position
            return await tx.image.create({
                data: {
                    url: `/uploads/products/${productId}/${uniqueFilename}`,
                    alt_text: request.altText,
                    position: request.position ?? nextPosition,
                    productId,
                    variantId,
                    filename: uniqueFilename,
                    size: stats.size,
                    mime_type: request.mimeType
                }
            });
        });

        return {
            uuid: image.uuid,
            url: image.url,
            alt_text: image.alt_text,
            position: image.position,
            created_at: image.created_at,
            updated_at: image.updated_at,
            productId: image.productId,
            variantId: image.variantId,
            filename: image.filename || uniqueFilename,
            size: image.size || stats.size,
            mime_type: image.mime_type || request.mimeType
        };
    }

    static async deleteImage(variantId: string, imageId: string): Promise<boolean> {
        // Validate UUIDs
        validateUUID(variantId, "Variant");
        validateUUID(imageId, "Image");

        // Check if variant exists
        const variant = await prismaClient.variant.findFirst({
            where: { uuid: variantId }
        });

        if (!variant) {
            throw new HTTPException(404, { message: "Variant not found" });
        }

        // Find the image
        const image = await prismaClient.image.findFirst({
            where: {
                uuid: imageId,
                variantId: variantId
            }
        });

        if (!image) {
            throw new HTTPException(404, { message: "Image not found" });
        }

        // If image is stored locally (starts with /uploads/), delete the file
        if (image.url.startsWith('/uploads/') && image.filename) {
            const uploadDir = process.env.UPLOAD_DIR || './uploads';
            const productId = variant.productId;
            const filePath = path.join(uploadDir, 'products', productId, image.filename);

            try {
                await fs.unlink(filePath);
            } catch (error) {
                // File might not exist, continue with database deletion
                console.warn(`Could not delete file: ${filePath}`);
            }
        }

        // Delete from database
        await prismaClient.image.delete({
            where: { uuid: imageId }
        });

        return true;
    }

    static async reorderImages(
        variantId: string,
        updates: Array<{ imageId: string; position: number }>
    ): Promise<boolean> {
        validateUUID(variantId, "Variant");

        // Validate variant exists
        const variant = await prismaClient.variant.findFirst({
            where: { uuid: variantId }
        });

        if (!variant) {
            throw new HTTPException(404, { message: "Variant not found" });
        }

        // Use transaction for batch update
        await prismaClient.$transaction(async (tx) => {
            for (const item of updates) {
                validateUUID(item.imageId, "Image");

                // Update each image position
                // Note: We check variantId to ensure image belongs to this variant
                await tx.image.updateMany({
                    where: {
                        uuid: item.imageId,
                        variantId: variantId
                    },
                    data: { position: item.position }
                });
            }
        });

        return true;
    }
}
