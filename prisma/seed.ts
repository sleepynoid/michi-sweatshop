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

    // 4. Create Products (without images to avoid CORS errors)

    // Product 1: Michi Premium T-Shirt
    const tshirt = await prisma.product.create({
        data: {
            title: "Michi Premium T-Shirt",
            description: "High quality cotton t-shirt with Michi logo. Perfect for casual wear and showing your support for Michi!",
            product_type: "Apparel",
            vendor: "Michi Merch",
            status: "active",
            tags: ["t-shirt", "clothing", "michi", "apparel"],
            variants: {
                create: [
                    {
                        title: "Size S - Black",
                        price: 150000,
                        sku: "TSHIRT-MICHI-S-BLK",
                        inventory_policy: "deny",
                        option1: "S",
                        available: 50,
                        cost: 80000
                    },
                    {
                        title: "Size M - Black",
                        price: 150000,
                        sku: "TSHIRT-MICHI-M-BLK",
                        inventory_policy: "deny",
                        option1: "M",
                        available: 75,
                        cost: 80000
                    },
                    {
                        title: "Size L - Black",
                        price: 160000,
                        sku: "TSHIRT-MICHI-L-BLK",
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
            description: "Ceramic mug for your daily coffee fix. Features cute Michi design!",
            product_type: "Accessories",
            vendor: "Mug Co",
            status: "active",
            tags: ["mug", "coffee", "accessories", "ceramic"],
            variants: {
                create: [
                    {
                        title: "Standard White",
                        price: 75000,
                        sku: "MUG-MICHI-WHT-001",
                        inventory_policy: "continue",
                        option1: "White",
                        available: 100,
                        cost: 30000
                    },
                    {
                        title: "Standard Black",
                        price: 75000,
                        sku: "MUG-MICHI-BLK-001",
                        inventory_policy: "continue",
                        option1: "Black",
                        available: 80,
                        cost: 30000
                    }
                ]
            }
        }
    });
    console.log(`Created product: ${mug.title}`);

    // Product 3: Michi Hoodie
    const hoodie = await prisma.product.create({
        data: {
            title: "Michi Cozy Hoodie",
            description: "Warm and comfortable hoodie with Michi embroidery. Perfect for cold weather!",
            product_type: "Apparel",
            vendor: "Michi Merch",
            status: "active",
            tags: ["hoodie", "clothing", "michi", "winter"],
            variants: {
                create: [
                    {
                        title: "Size M - Gray",
                        price: 350000,
                        sku: "HOODIE-MICHI-M-GRY",
                        inventory_policy: "deny",
                        option1: "M",
                        available: 25,
                        cost: 180000
                    },
                    {
                        title: "Size L - Gray",
                        price: 350000,
                        sku: "HOODIE-MICHI-L-GRY",
                        inventory_policy: "deny",
                        option1: "L",
                        available: 20,
                        cost: 180000
                    }
                ]
            }
        }
    });
    console.log(`Created product: ${hoodie.title}`);

    // Product 4: Michi Sticker Pack
    const stickers = await prisma.product.create({
        data: {
            title: "Michi Sticker Pack",
            description: "Set of 10 cute Michi stickers. Perfect for decorating your laptop, phone, or notebook!",
            product_type: "Accessories",
            vendor: "Sticker Studio",
            status: "active",
            tags: ["stickers", "accessories", "michi", "cute"],
            variants: {
                create: [
                    {
                        title: "Standard Pack",
                        price: 35000,
                        sku: "STICKER-MICHI-001",
                        inventory_policy: "continue",
                        option1: "Standard",
                        available: 200,
                        cost: 15000
                    }
                ]
            }
        }
    });
    console.log(`Created product: ${stickers.title}`);

    // Product 5: Michi Tote Bag
    const totebag = await prisma.product.create({
        data: {
            title: "Michi Canvas Tote Bag",
            description: "Eco-friendly canvas tote bag with Michi print. Great for shopping or daily use!",
            product_type: "Accessories",
            vendor: "Eco Bags Co",
            status: "active",
            tags: ["bag", "tote", "accessories", "eco-friendly"],
            variants: {
                create: [
                    {
                        title: "Natural Canvas",
                        price: 125000,
                        sku: "TOTE-MICHI-NAT-001",
                        inventory_policy: "deny",
                        option1: "Natural",
                        available: 60,
                        cost: 60000
                    }
                ]
            }
        }
    });
    console.log(`Created product: ${totebag.title}`);

    // Product 6: Michi Keychain
    const keychain = await prisma.product.create({
        data: {
            title: "Michi Acrylic Keychain",
            description: "Cute acrylic keychain featuring Michi character. Attach it to your keys, bag, or anywhere!",
            product_type: "Accessories",
            vendor: "Keychain Factory",
            status: "active",
            tags: ["keychain", "accessories", "michi", "cute"],
            variants: {
                create: [
                    {
                        title: "Standard",
                        price: 45000,
                        sku: "KEYCHAIN-MICHI-001",
                        inventory_policy: "continue",
                        option1: "Standard",
                        available: 150,
                        cost: 20000
                    }
                ]
            }
        }
    });
    console.log(`Created product: ${keychain.title}`);

    // Product 7: Michi Phone Case
    const phonecase = await prisma.product.create({
        data: {
            title: "Michi Phone Case",
            description: "Protective phone case with cute Michi design. Available for various phone models!",
            product_type: "Accessories",
            vendor: "Case Studio",
            status: "active",
            tags: ["phone-case", "accessories", "michi", "protection"],
            variants: {
                create: [
                    {
                        title: "iPhone 14",
                        price: 95000,
                        sku: "CASE-MICHI-IP14",
                        inventory_policy: "deny",
                        option1: "iPhone 14",
                        available: 40,
                        cost: 45000
                    },
                    {
                        title: "iPhone 15",
                        price: 95000,
                        sku: "CASE-MICHI-IP15",
                        inventory_policy: "deny",
                        option1: "iPhone 15",
                        available: 50,
                        cost: 45000
                    },
                    {
                        title: "Samsung S24",
                        price: 95000,
                        sku: "CASE-MICHI-S24",
                        inventory_policy: "deny",
                        option1: "Samsung S24",
                        available: 35,
                        cost: 45000
                    }
                ]
            }
        }
    });
    console.log(`Created product: ${phonecase.title}`);

    // Product 8: Michi Notebook
    const notebook = await prisma.product.create({
        data: {
            title: "Michi Spiral Notebook",
            description: "A5 spiral notebook with Michi cover design. Perfect for notes, sketches, or journaling!",
            product_type: "Stationery",
            vendor: "Paper Co",
            status: "active",
            tags: ["notebook", "stationery", "michi", "writing"],
            variants: {
                create: [
                    {
                        title: "Lined Paper",
                        price: 55000,
                        sku: "NOTEBOOK-MICHI-LINED",
                        inventory_policy: "continue",
                        option1: "Lined",
                        available: 120,
                        cost: 25000
                    },
                    {
                        title: "Blank Paper",
                        price: 55000,
                        sku: "NOTEBOOK-MICHI-BLANK",
                        inventory_policy: "continue",
                        option1: "Blank",
                        available: 80,
                        cost: 25000
                    }
                ]
            }
        }
    });
    console.log(`Created product: ${notebook.title}`);

    console.log("\n✅ Seeding finished successfully!");
    console.log(`Created 8 products without images (images can be uploaded via UI)`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
