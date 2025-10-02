import { prismaClient } from "../src/Application/database";

export class UserTest {
    static async create() {
        await prismaClient.user.create({
            data: {
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
