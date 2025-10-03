import { prismaClient } from "../src/Application/database";

export class UserTest {
    static async create() {
        await prismaClient.user.upsert({
            where: { username: "test" },
            update: {},
            create: {
                username: "test",
                name: "test",
                password: await Bun.password.hash("test123", {
                    algorithm: "bcrypt",
                    cost: 10
                }),
            }
        })
    }

    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: "test"
            }
        })
    }

    static async findByUsername(username: string) {
        return await prismaClient.user.findUnique({
            where: {
                username: username
            }
        })
    }
}

export class ProductTest {
    static async create() {
        await prismaClient.product.create({
            data: {
                title: "Test Product",
                description: "Test Description",
                product_type: "Collectible",
                vendor: "Test Vendor",
                tags: ["test", "product"],
                status: "active",
                published_at: new Date(),
                variants: {
                    create: {
                        title: "Test Variant",
                        price: 100000,
                        sku: "TEST-001",
                        inventory_quantity: 50,
                        inventory_policy: "deny",
                        option1: "Standard",
                        inventory_item: {
                            create: {
                                sku: "TEST-001",
                                tracked: true,
                                available: 50,
                                cost: 50000
                            }
                        }
                    }
                }
            },
            include: {
                variants: true
            }
        })
    }

    static async delete() {
        await prismaClient.product.deleteMany({
            where: {
                title: {
                    in: ["Test Product", "Figure", "Updated Product"]
                }
            }
        })
    }

    static async findByTitle(title: string) {
        return await prismaClient.product.findFirst({
            where: {
                title: title
            },
            include: {
                variants: true
            }
        })
    }
}

export class VariantTest {
    static async create() {
        const product = await prismaClient.product.create({
            data: {
                title: "Test Product for Variant",
                description: "Test Description",
                product_type: "Collectible",
                vendor: "Test Vendor",
                tags: ["test", "product"],
                status: "active",
                published_at: new Date(),
                variants: {
                    create: {
                        title: "Test Variant",
                        price: 100000,
                        sku: "TEST-VARIANT-001",
                        inventory_quantity: 50,
                        inventory_policy: "deny",
                        option1: "Standard",
                        inventory_item: {
                            create: {
                                sku: "TEST-VARIANT-001",
                                tracked: true,
                                available: 50,
                                cost: 50000
                            }
                        }
                    }
                }
            },
            include: {
                variants: true
            }
        })
        return product.variants[0]
    }

    static async delete() {
        await prismaClient.product.deleteMany({
            where: {
                title: "Test Product for Variant"
            }
        })
    }

    static async findBySku(sku: string) {
        return await prismaClient.variant.findFirst({
            where: {
                sku: sku
            },
            include: {
                inventory_item: true
            }
        })
    }
}
