import { prismaClient } from "../Application/database";
import { Variant, UpdateVariantRequest } from "../model/variant-model";
import { HTTPException } from "hono/http-exception";

export class VariantService {
    static async update(variantId: string, request: UpdateVariantRequest): Promise<Variant> {
        const variant = await prismaClient.variant.findFirst({
            where: {
                uuid: variantId
            },
            include: {
                inventory_item: true
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
                inventory_quantity: request.inventory_item?.available ?? variant.inventory_quantity
            },
            include: {
                inventory_item: true
            }
        });

        // Update inventory item if provided
        if (request.inventory_item && variant.inventory_item) {
            await prismaClient.inventoryItem.update({
                where: { uuid: variant.inventory_item.uuid },
                data: {
                    sku: request.inventory_item.sku ?? variant.inventory_item.sku,
                    tracked: request.inventory_item.tracked ?? variant.inventory_item.tracked,
                    available: request.inventory_item.available ?? variant.inventory_item.available,
                    cost: request.inventory_item.cost ?? variant.inventory_item.cost
                }
            });
        }

        // Fetch updated variant with inventory item
        const finalVariant = await prismaClient.variant.findFirst({
            where: { uuid: variantId },
            include: {
                inventory_item: true
            }
        });

        if (!finalVariant) {
            throw new HTTPException(404, { message: "Variant not found" });
        }

        return {
            uuid: finalVariant.uuid,
            title: finalVariant.title,
            price: finalVariant.price,
            sku: finalVariant.sku,
            inventory_quantity: finalVariant.inventory_quantity,
            inventory_policy: finalVariant.inventory_policy,
            option1: finalVariant.option1,
            created_at: finalVariant.created_at,
            updated_at: finalVariant.updated_at,
            inventory_item: finalVariant.inventory_item ? {
                uuid: finalVariant.inventory_item.uuid,
                sku: finalVariant.inventory_item.sku,
                tracked: finalVariant.inventory_item.tracked,
                available: finalVariant.inventory_item.available,
                cost: finalVariant.inventory_item.cost,
                created_at: finalVariant.inventory_item.created_at,
                updated_at: finalVariant.inventory_item.updated_at
            } : undefined
        };
    }

    static async getById(variantId: string): Promise<Variant> {
        const variant = await prismaClient.variant.findFirst({
            where: {
                uuid: variantId
            },
            include: {
                inventory_item: true
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
            inventory_quantity: variant.inventory_quantity,
            inventory_policy: variant.inventory_policy,
            option1: variant.option1,
            created_at: variant.created_at,
            updated_at: variant.updated_at,
            inventory_item: variant.inventory_item ? {
                uuid: variant.inventory_item.uuid,
                sku: variant.inventory_item.sku,
                tracked: variant.inventory_item.tracked,
                available: variant.inventory_item.available,
                cost: variant.inventory_item.cost,
                created_at: variant.inventory_item.created_at,
                updated_at: variant.inventory_item.updated_at
            } : undefined
        };
    }
}
