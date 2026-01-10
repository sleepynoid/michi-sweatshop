import { prismaClient } from "../Application/database";
import { CreateProductRequest, ProductDetailResponse, ProductResponse, PaginatedProductsResponse, UpdateProductRequest } from "../model/product-model";
import { CreateVariantRequest, UpdateVariantRequest } from "../model/variant-model";
import { CreateImageRequest, Image } from "../model/image-model";
import { ProductValidation } from "../validation/product-validation";
import { HTTPException } from "hono/http-exception";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";
import path = require("path");
import { validateUUID } from "../utils/uuid-validator";

export class ProductService {
    static async create(request: CreateProductRequest): Promise<ProductResponse> {
        request = ProductValidation.CREATE.parse(request);

        const productUuid = randomUUID();

        const product = await prismaClient.product.create({
            data: {
                uuid: productUuid,
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
                        available: variant.available,
                        cost: variant.cost,
                        inventory_policy: variant.inventory_policy,
                        option1: variant.option1,
                        images: variant.images ? {
                            create: variant.images.map((image, index) => ({
                                url: image.url,
                                alt_text: image.alt_text,
                                position: image.position ?? index,
                                productId: productUuid
                                // variantId will be set automatically by Prisma nested create
                            }))
                        } : undefined
                    }))
                },
                images: request.images ? {
                    create: request.images.map((image, index) => ({
                        url: image.url,
                        alt_text: image.alt_text ?? undefined,
                        position: image.position ?? index
                    }))
                } : undefined
            },
            include: {
                variants: {
                    include: {
                        images: true
                    }
                },
                images: true
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
            images: product.images,
            variants: product.variants.map(variant => ({
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
                    variants: {
                        include: {
                            images: true
                        }
                    },
                    images: true
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
                images: product.images,
                variants: product.variants.map(variant => ({
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
        // Validate productId UUID format
        validateUUID(productId, "Product");

        const product = await prismaClient.product.findFirst({
            where: {
                uuid: productId
            },
            include: {
                variants: {
                    include: {
                        images: true
                    }
                },
                images: true
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
            images: product.images,
            variants: product.variants.map(variant => ({
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
            }))
        };
    }

    static async getDetail(productId: string): Promise<ProductDetailResponse> {
        // Validate productId UUID format
        validateUUID(productId, "Product");

        const product = await prismaClient.product.findFirst({
            where: {
                uuid: productId
            },
            include: {
                variants: {
                    include: {
                        images: true
                    }
                },
                images: true
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
            images: product.images,
            variants: product.variants.map(variant => ({
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
            }))
        };
    }

    static async update(productId: string, request: UpdateProductRequest): Promise<ProductResponse> {
        request = ProductValidation.UPDATE.parse(request);

        // Validate productId UUID format
        validateUUID(productId, "Product");

        const product = await prismaClient.product.findFirst({
            where: {
                uuid: productId,
            },
            include: {
                variants: true
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
                variants: true,
                images: true
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
                            available: variantReq.available ?? existingVariant.available,
                            cost: variantReq.cost ?? existingVariant.cost
                        }
                    });
                }
            }
        }

        // Refetch updated product with images
        const finalProduct = await prismaClient.product.findFirst({
            where: { uuid: productId },
            include: {
                variants: true,
                images: true
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
            images: finalProduct.images,
            variants: finalProduct.variants.map(variant => ({
                uuid: variant.uuid,
                title: variant.title,
                price: variant.price,
                sku: variant.sku,
                available: variant.available,
                cost: variant.cost,
                inventory_policy: variant.inventory_policy,
                option1: variant.option1,
                created_at: variant.created_at,
                updated_at: variant.updated_at
            }))
        };
    }

    static async delete(productId: string): Promise<boolean> {
        // Validate productId UUID format
        validateUUID(productId, "Product");

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

    static async uploadImage(productId: string, request: CreateImageRequest): Promise<Image> {
        // Validate productId UUID format
        validateUUID(productId, "Product");

        const product = await prismaClient.product.findFirst({
            where: {
                uuid: productId
            }
        });

        if (!product) {
            throw new HTTPException(404, { message: "Product not found" });
        }

        // Get the next position for the image - find max position and add 1
        const maxPositionImage = await prismaClient.image.findFirst({
            where: { productId: productId },
            orderBy: { position: 'desc' },
            select: { position: true }
        });
        const nextPosition = maxPositionImage ? maxPositionImage.position + 1 : 0;

        const image = await prismaClient.image.create({
            data: {
                url: request.url,
                alt_text: request.alt_text,
                position: request.position ?? nextPosition,
                productId: productId
            }
        });

        return {
            uuid: image.uuid,
            url: image.url,
            alt_text: image.alt_text,
            position: image.position,
            created_at: image.created_at,
            updated_at: image.updated_at,
            productId: image.productId,
            variantId: image.variantId
        };
    }

    static async uploadImageFile(
        productId: string,
        request: {
            buffer: Buffer;
            filename: string;
            mimeType: string;
            altText?: string;
            position?: number;
        }
    ): Promise<Image> {
        // Validate productId UUID format
        validateUUID(productId, "Product");

        // Validate product exists
        const product = await prismaClient.product.findFirst({
            where: { uuid: productId }
        });
        if (!product) {
            throw new HTTPException(404, { message: "Product not found" });
        }

        // Generate unique filename
        const fileExtension = path.extname(request.filename);
        const uniqueFilename = `${randomUUID()}${fileExtension}`;

        // Ensure upload directory exists
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        const productDir = path.join(uploadDir, 'products', productId);
        await fs.mkdir(productDir, { recursive: true });

        // Save file
        const filePath = path.join(productDir, uniqueFilename);
        await fs.writeFile(filePath, request.buffer);

        // Get file stats
        const stats = await fs.stat(filePath);

        // Use SELECT FOR UPDATE to lock rows and prevent race conditions
        // Lock the parent product row to serialize access for position calculation
        const image = await prismaClient.$transaction(async (tx) => {
            // Lock the product row to prevent concurrent position conflicts
            // This works even when there are no images yet (unlike locking image rows)
            await tx.$queryRaw`
                SELECT uuid 
                FROM "Product" 
                WHERE uuid = ${productId}::uuid
                FOR UPDATE
            `;

            // Now safely get max position (product is locked, serializing all uploads)
            const maxPositionResult = await tx.$queryRaw<Array<{ max: number | null }>>`
                SELECT MAX(position) as max
                FROM "Image" 
                WHERE "productId" = ${productId}::uuid
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

    static async deleteImage(productId: string, imageId: string): Promise<boolean> {
        // Validate UUIDs
        validateUUID(productId, "Product");
        validateUUID(imageId, "Image");

        // Check if product exists
        const product = await prismaClient.product.findFirst({
            where: { uuid: productId }
        });

        if (!product) {
            throw new HTTPException(404, { message: "Product not found" });
        }

        // Find the image
        const image = await prismaClient.image.findFirst({
            where: {
                uuid: imageId,
                productId: productId
            }
        });

        if (!image) {
            throw new HTTPException(404, { message: "Image not found" });
        }

        // If image is stored locally (starts with /uploads/), delete the file
        if (image.url.startsWith('/uploads/') && image.filename) {
            const uploadDir = process.env.UPLOAD_DIR || './uploads';
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
        productId: string,
        updates: Array<{ imageId: string; position: number }>
    ): Promise<boolean> {
        validateUUID(productId, "Product");

        // Validate product exists
        const product = await prismaClient.product.findFirst({
            where: { uuid: productId }
        });

        if (!product) {
            throw new HTTPException(404, { message: "Product not found" });
        }

        // Use transaction for batch update
        await prismaClient.$transaction(async (tx) => {
            for (const item of updates) {
                validateUUID(item.imageId, "Image");

                // Update each image position
                // Note: We check productId to ensure image belongs to this product
                await tx.image.updateMany({
                    where: {
                        uuid: item.imageId,
                        productId: productId
                    },
                    data: { position: item.position }
                });
            }
        });

        return true;
    }
}
