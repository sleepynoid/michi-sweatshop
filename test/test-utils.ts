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

export class ItemTest {
    static async create() {
        await prismaClient.item.create({
            data: {
                name: "Test Item",
                description: "Test Description",
                price: 100000,
            }
        })
    }

    static async delete() {
        await prismaClient.item.deleteMany({
            where: {
                name: {
                    in: ["Test Item", "Figure", "Updated Item"]
                }
            }
        })
    }

    static async findByName(name: string) {
        return await prismaClient.item.findFirst({
            where: {
                name: name
            }
        })
    }
}
