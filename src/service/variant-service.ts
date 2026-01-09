import { prismaClient } from "../Application/database";
import { Variant, UpdateVariantRequest, CreateVariantRequest } from "../model/variant-model";
import { HTTPException } from "hono/http-exception";
import { validateUUID } from "../utils/uuid-validator";

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
}
