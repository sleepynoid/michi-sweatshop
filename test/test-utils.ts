import { prismaClient } from "../src/Application/database";

export class UserTest {
    static async create() {
        // Delete first to avoid unique constraint errors
        await prismaClient.user.deleteMany({
            where: {
                email: "test@example.com"
            }
        })

        // Then create fresh user
        await prismaClient.user.create({
            data: {
                email: "test@example.com",
                phone: "+628123456789",
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
                email: "test@example.com"
            }
        })
    }

    static async findByUsername(username: string) {
        return await prismaClient.user.findUnique({
            where: {
                email: username
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
                        available: 50,
                        cost: 50000,
                        inventory_policy: "deny",
                        option1: "Standard"
                    }
                }
            },
            include: {
                variants: true
            }
        })
    }

    static async delete() {
        // Delete variants first to avoid foreign key issues
        await prismaClient.variant.deleteMany({
            where: {
                sku: {
                    in: ["TEST-001", "FIG-KAELA-001", "UPDATED-SKU"]
                }
            }
        })

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
                        available: 50,
                        cost: 50000,
                        inventory_policy: "deny",
                        option1: "Standard"
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
            }
        })
    }
}
