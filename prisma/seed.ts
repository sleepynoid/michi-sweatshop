import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // 1. Clean up existing data
    await prisma.image.deleteMany();
    await prisma.variant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // 2. Create Admin User
    const adminPassword = await Bun.password.hash("admin123", {
        algorithm: "bcrypt",
        cost: 4
    });

    const admin = await prisma.user.create({
        data: {
            email: "admin@michi.com",
            name: "Admin Michi",
            password: adminPassword,
            phone: "081234567890",
            role: "admin"
        }
    });

    console.log(`Created user: ${admin.email}`);

    // 3. Create normal User
    const userPassword = await Bun.password.hash("user123", {
        algorithm: "bcrypt",
        cost: 4
    });

    const user = await prisma.user.create({
        data: {
            email: "user@michi.com",
            name: "User Michi",
            password: userPassword,
            phone: "081234567891",
            role: "user"
        }
    });
    console.log(`Created user: ${user.email}`);


    // 4. Create Products

    // Product 1: Michi Premium T-Shirt
    const tshirt = await prisma.product.create({
        data: {
            title: "Michi Premium T-Shirt",
            description: "High quality cotton t-shirt with Michi logo",
            product_type: "Apparel",
            vendor: "Michi Merch",
            status: "active",
            tags: ["t-shirt", "clothing", "michi"],
            variants: {
                create: [
                    {
                        title: "Size S",
                        price: 150000,
                        sku: "TSHIRT-MICHI-S",
                        inventory_policy: "deny",
                        option1: "S",
                        available: 50,
                        cost: 80000
                    },
                    {
                        title: "Size M",
                        price: 150000,
                        sku: "TSHIRT-MICHI-M",
                        inventory_policy: "deny",
                        option1: "M",
                        available: 50,
                        cost: 80000
                    },
                    {
                        title: "Size L",
                        price: 160000,
                        sku: "TSHIRT-MICHI-L",
                        inventory_policy: "deny",
                        option1: "L",
                        available: 30,
                        cost: 85000
                    }
                ]
            }
        }
    });
    console.log(`Created product: ${tshirt.title}`);

    // Product 2: Michi Coffee Mug
    const mug = await prisma.product.create({
        data: {
            title: "Michi Coffee Mug",
            description: "Ceramic mug for your daily coffee fix",
            product_type: "Accessories",
            vendor: "Mug Co",
            status: "active",
            tags: ["mug", "coffee", "accessories"],
            variants: {
                create: [
                    {
                        title: "Standard White",
                        price: 75000,
                        sku: "MUG-MICHI-001",
                        inventory_policy: "continue",
                        option1: "White",
                        available: 100,
                        cost: 30000
                    }
                ]
            }
        }
    });
    console.log(`Created product: ${mug.title}`);

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
