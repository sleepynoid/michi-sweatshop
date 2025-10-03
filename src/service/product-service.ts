import { prismaClient } from "../Application/database";
import { CreateProductRequest, ProductDetailResponse, ProductResponse, PaginatedProductsResponse, UpdateProductRequest } from "../model/product-model";
import { CreateVariantRequest, UpdateVariantRequest } from "../model/variant-model";
import { CreateInventoryItemRequest, UpdateInventoryItemRequest } from "../model/inventory-item-model";
import { ProductValidation } from "../validation/product-validation";
import { HTTPException } from "hono/http-exception";

export class ProductService {
    static async create(request: CreateProductRequest): Promise<ProductResponse> {
        request = ProductValidation.CREATE.parse(request);

        const product = await prismaClient.product.create({
            data: {
                title: request.title,
                description: request.description,
                product_type: request.product_type,
                vendor: request.vendor,
                tags: request.tags,
                status: request.status,
                published_at: new Date(),
                variants: {
                    create: request.variants.map(variant => ({
                        title: variant.title,
                        price: variant.price,
                        sku: variant.sku,
                        inventory_quantity: variant.inventory_item.available,
                        inventory_policy: variant.inventory_policy,
                        option1: variant.option1,
                        inventory_item: {
                            create: {
                                sku: variant.inventory_item.sku,
                                tracked: variant.inventory_item.tracked,
                                available: variant.inventory_item.available,
                                cost: variant.inventory_item.cost
                            }
                        }
                    }))
                }
            },
            include: {
                variants: {
                    include: {
                        inventory_item: true
                    }
                }
            }
        });

        return {
            uuid: product.uuid,
            title: product.title,
            description: product.description,
            product_type: product.product_type,
            vendor: product.vendor,
            tags: product.tags as string[],
            status: product.status,
            published_at: product.published_at,
            created_at: product.created_at,
            updated_at: product.updated_at,
            variants: product.variants.map(variant => ({
                uuid: variant.uuid,
                title: variant.title,
                price: variant.price,
                sku: variant.sku,
                inventory_quantity: variant.inventory_quantity,
                inventory_policy: variant.inventory_policy,
                option1: variant.option1,
                created_at: variant.created_at,
                updated_at: variant.updated_at
            }))
        };
    }

    static async getAll(page: number = 1, limit: number = 10): Promise<PaginatedProductsResponse> {
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            prismaClient.product.findMany({
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    variants: true
                }
            }),
            prismaClient.product.count()
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: products.map(product => ({
                uuid: product.uuid,
                title: product.title,
                description: product.description,
                product_type: product.product_type,
                vendor: product.vendor,
                tags: product.tags as string[],
                status: product.status,
                published_at: product.published_at,
                created_at: product.created_at,
                updated_at: product.updated_at,
                variants: product.variants.map(variant => ({
                    uuid: variant.uuid,
                    title: variant.title,
                    price: variant.price,
                    sku: variant.sku,
                    inventory_quantity: variant.inventory_quantity,
                    inventory_policy: variant.inventory_policy,
                    option1: variant.option1,
                    created_at: variant.created_at,
                    updated_at: variant.updated_at
                }))
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }

    static async getById(productId: string): Promise<ProductResponse> {
        const product = await prismaClient.product.findFirst({
            where: {
                uuid: productId
            },
            include: {
                variants: true
            }
        });

        if (!product) {
            throw new HTTPException(404, { message: "Product not found" });
        }

        return {
            uuid: product.uuid,
            title: product.title,
            description: product.description,
            product_type: product.product_type,
            vendor: product.vendor,
            tags: product.tags as string[],
            status: product.status,
            published_at: product.published_at,
            created_at: product.created_at,
            updated_at: product.updated_at,
            variants: product.variants.map(variant => ({
                uuid: variant.uuid,
                title: variant.title,
                price: variant.price,
                sku: variant.sku,
                inventory_quantity: variant.inventory_quantity,
                inventory_policy: variant.inventory_policy,
                option1: variant.option1,
                created_at: variant.created_at,
                updated_at: variant.updated_at
            }))
        };
    }

    static async getDetail(productId: string): Promise<ProductDetailResponse> {
        const product = await prismaClient.product.findFirst({
            where: {
                uuid: productId
            },
            include: {
                variants: {
                    include: {
                        inventory_item: true
                    }
                }
            }
        });

        if (!product) {
            throw new HTTPException(404, { message: "Product not found" });
        }

        return {
            uuid: product.uuid,
            title: product.title,
            description: product.description,
            product_type: product.product_type,
            vendor: product.vendor,
            tags: product.tags as string[],
            status: product.status,
            published_at: product.published_at,
            created_at: product.created_at,
            updated_at: product.updated_at,
            variants: product.variants.map(variant => ({
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
            }))
        };
    }

    static async update(productId: string, request: UpdateProductRequest): Promise<ProductResponse> {
        request = ProductValidation.UPDATE.parse(request);

        const product = await prismaClient.product.findFirst({
            where: {
                uuid: productId,
            },
            include: {
                variants: {
                    include: {
                        inventory_item: true
                    }
                }
            }
        });

        if (!product) {
            throw new HTTPException(404, { message: "Product not found" });
        }

        // Update product
        const updatedProduct = await prismaClient.product.update({
            where: { uuid: productId },
            data: {
                title: request.title ?? product.title,
                description: request.description ?? product.description,
                product_type: request.product_type ?? product.product_type,
                vendor: request.vendor ?? product.vendor,
                tags: request.tags ?? (product.tags as string[]),
                status: request.status ?? product.status
            },
            include: {
                variants: {
                    include: {
                        inventory_item: true
                    }
                }
            }
        });

        // Update variants if provided
        if (request.variants) {
            for (const variantReq of request.variants) {
                const existingVariant = product.variants.find(v => v.uuid === variantReq.uuid);
                if (existingVariant) {
                    await prismaClient.variant.update({
                        where: { uuid: variantReq.uuid },
                        data: {
                            title: variantReq.title ?? existingVariant.title,
                            price: variantReq.price ?? existingVariant.price,
                            sku: variantReq.sku ?? existingVariant.sku,
                            inventory_policy: variantReq.inventory_policy ?? existingVariant.inventory_policy,
                            option1: variantReq.option1 ?? existingVariant.option1,
                            inventory_quantity: variantReq.inventory_item?.available ?? existingVariant.inventory_quantity
                        }
                    });

                    if (variantReq.inventory_item && existingVariant.inventory_item) {
                        await prismaClient.inventoryItem.update({
                            where: { uuid: existingVariant.inventory_item.uuid },
                            data: {
                                sku: variantReq.inventory_item.sku ?? existingVariant.inventory_item.sku,
                                tracked: variantReq.inventory_item.tracked ?? existingVariant.inventory_item.tracked,
                                available: variantReq.inventory_item.available ?? existingVariant.inventory_item.available,
                                cost: variantReq.inventory_item.cost ?? existingVariant.inventory_item.cost
                            }
                        });
                    }
                }
            }
        }

        // Refetch updated product
        const finalProduct = await prismaClient.product.findFirst({
            where: { uuid: productId },
            include: {
                variants: true
            }
        });

        if (!finalProduct) {
            throw new HTTPException(404, { message: "Product not found" });
        }

        return {
            uuid: finalProduct.uuid,
            title: finalProduct.title,
            description: finalProduct.description,
            product_type: finalProduct.product_type,
            vendor: finalProduct.vendor,
            tags: finalProduct.tags as string[],
            status: finalProduct.status,
            published_at: finalProduct.published_at,
            created_at: finalProduct.created_at,
            updated_at: finalProduct.updated_at,
            variants: finalProduct.variants.map(variant => ({
                uuid: variant.uuid,
                title: variant.title,
                price: variant.price,
                sku: variant.sku,
                inventory_quantity: variant.inventory_quantity,
                inventory_policy: variant.inventory_policy,
                option1: variant.option1,
                created_at: variant.created_at,
                updated_at: variant.updated_at
            }))
        };
    }

    static async delete(productId: string): Promise<boolean> {
        const product = await prismaClient.product.findFirst({
            where: {
                uuid: productId
            }
        });

        if (!product) {
            throw new HTTPException(404, { message: "Product not found" });
        }

        await prismaClient.product.delete({
            where: { uuid: productId }
        });

        return true;
    }
}
