import { prismaClient } from "../Application/database";
import { CreateItemRequest, ItemDetailResponse, ItemResponse, PaginatedItemsResponse, UpdateItemRequest } from "../model/item-model";
import { ItemValidation } from "../validation/item-validation";
import { HTTPException } from "hono/http-exception";

export class ItemService {
    static async create(request: CreateItemRequest): Promise<ItemResponse> {
        request = ItemValidation.CREATE.parse(request);

        const item = await prismaClient.item.create({
            data: {
                uuid: crypto.randomUUID(),
                name: request.name,
                description: request.description || "",
                price: request.price,
            }
        });

        return {
            uuid: item.uuid,
            name: item.name,
            description: item.description,
            price: item.price,
            // userId: item.userId,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        };
    }

    static async getAll(page: number = 1, limit: number = 10): Promise<PaginatedItemsResponse> {
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            prismaClient.item.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prismaClient.item.count()
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: items.map(item => ({
                uuid: item.uuid,
                name: item.name,
                description: item.description,
                price: item.price,
                // userId: item.userId,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }

    static async getById(itemId: string): Promise<ItemResponse> {
        const item = await prismaClient.item.findFirst({
            where: {
                uuid: itemId
            }
        });

        if (!item) {
            throw new HTTPException(404, { message: "Item not found" });
        }

        return {
            uuid: item.uuid,
            name: item.name,
            description: item.description,
            price: item.price,
            // userId: item.userId,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        };
    }

    static async getDetail(itemId: string): Promise<ItemDetailResponse> {
        const item = await prismaClient.item.findFirst({
            where: {
                uuid: itemId
            }
        });

        if (!item) {
            throw new HTTPException(404, { message: "Item not found" });
        }

        return {
            id: item.uuid,
            name: item.name,
            description: item.description,
            price: item.price,
            // user: item.user,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        };
    }

    static async update(itemId: string, request: UpdateItemRequest): Promise<ItemResponse> {
        request = ItemValidation.UPDATE.parse(request);

        const item = await prismaClient.item.findFirst({
            where: {
                uuid: itemId,
            }
        });

        if (!item) {
            throw new HTTPException(404, { message: "Item not found" });
        }

        const updatedItem = await prismaClient.item.update({
            where: { uuid: itemId },
            data: {
                name: request.name ?? item.name,
                description: request.description ?? item.description,
                price: request.price ?? item.price
            }
        });

        return {
            uuid: updatedItem.uuid,
            name: updatedItem.name,
            description: updatedItem.description,
            price: updatedItem.price,
            // userId: updatedItem.userId,
            createdAt: updatedItem.createdAt,
            updatedAt: updatedItem.updatedAt
        };
    }

    static async delete(itemId: string): Promise<boolean> {
        const item = await prismaClient.item.findFirst({
            where: {
                uuid: itemId
            }
        });

        if (!item) {
            throw new HTTPException(404, { message: "Item not found" });
        }

        await prismaClient.item.delete({
            where: { uuid: itemId }
        });

        return true;
    }
}
