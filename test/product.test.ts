import { describe, it, expect, afterEach } from "bun:test"
import app from "../src"
import { logger } from "../src/Application/logging"
import { UserTest, ProductTest } from "./test-utils"
import { CreateProductRequest } from "../src/model/product-model"

describe('POST /api/products', () => {
    afterEach(async () => {
        await ProductTest.delete()
    })

    it('should create product successfully', async () => {
        await UserTest.create()

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: 'test',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request('/api/products', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Figure",
                description: "Figure Kawai Kaela",
                product_type: "Collectible",
                vendor: "Kawai",
                tags: ["figure", "collectible", "kaela"],
                status: "active",
                variants: [
                    {
                        title: "Default Variant",
                        price: 800000,
                        sku: "FIG-KAELA-001",
                        inventory_policy: "deny",
                        option1: "Standard",
                        inventory_item: {
                            sku: "FIG-KAELA-001",
                            tracked: true,
                            available: 100,
                            cost: 500000
                        }
                    }
                ]
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.title).toBe("Figure")
        expect(body.data.description).toBe("Figure Kawai Kaela")
        expect(body.data.product_type).toBe("Collectible")
        expect(body.data.vendor).toBe("Kawai")
        expect(body.data.tags).toEqual(["figure", "collectible", "kaela"])
        expect(body.data.status).toBe("active")
        expect(body.data.variants).toBeDefined()
        expect(body.data.variants.length).toBe(1)
        expect(body.data.variants[0].title).toBe("Default Variant")
        expect(body.data.variants[0].price).toBe(800000)
        expect(body.data.variants[0].sku).toBe("FIG-KAELA-001")
        expect(body.data.variants[0].inventory_quantity).toBe(100)
    })

    it('should reject create product if request is invalid', async () => {
        await UserTest.create()

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: 'test',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request('/api/products', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "",
                description: "",
                product_type: "",
                vendor: "",
                tags: [],
                status: "",
                variants: []
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(400)
        expect(body.errors).toBeDefined()
    })

    it('should reject create product if unauthorized', async () => {
        const response = await app.request('/api/products', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Figure",
                description: "Figure Kawai Kaela",
                product_type: "Collectible",
                vendor: "Kawai",
                tags: ["figure", "collectible", "kaela"],
                status: "active",
                variants: [
                    {
                        title: "Default Variant",
                        price: 800000,
                        sku: "FIG-KAELA-001",
                        inventory_policy: "deny",
                        option1: "Standard",
                        inventory_item: {
                            sku: "FIG-KAELA-001",
                            tracked: true,
                            available: 100,
                            cost: 500000
                        }
                    }
                ]
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(401)
        expect(body.errors).toBeDefined()
    })
})

describe('GET /api/products', () => {
    afterEach(async () => {
        await ProductTest.delete()
        await UserTest.delete()
    })

    it('should get products successfully', async () => {
        await ProductTest.create()

        const response = await app.request('/api/products', {
            method: 'get'
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.length).toBeGreaterThan(0)
        expect(body.pagination).toBeDefined()
    })
})

describe('GET /api/products/:uuid', () => {
    afterEach(async () => {
        await ProductTest.delete()
        await UserTest.delete()
    })

    it('should get product by uuid successfully', async () => {
        await ProductTest.create()
        const product = await ProductTest.findByTitle('Test Product')

        const response = await app.request(`/api/products/${product!.uuid}`, {
            method: 'get'
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.title).toBe("Test Product")
    })

    it('should reject get product if not found', async () => {
        const response = await app.request('/api/products/invalid-uuid', {
            method: 'get'
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(404)
        expect(body.errors).toBeDefined()
    })

    it('should get product detail successfully', async () => {
        await ProductTest.create()
        const product = await ProductTest.findByTitle('Test Product')

        const response = await app.request(`/api/products/${product!.uuid}/detail`, {
            method: 'get'
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.title).toBe("Test Product")
        expect(body.data.description).toBe("Test Description")
        expect(body.data.product_type).toBe("Collectible")
        expect(body.data.variants).toBeDefined()
        expect(body.data.variants.length).toBe(1)
        expect(body.data.variants[0].inventory_item).toBeDefined()
    })
})

describe('PATCH /api/products/:uuid', () => {
    afterEach(async () => {
        await ProductTest.delete()
        await UserTest.delete()
    })

    it('should update product successfully', async () => {
        await UserTest.create()
        await ProductTest.create()
        const product = await ProductTest.findByTitle('Test Product')

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: 'test',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request(`/api/products/${product!.uuid}`, {
            method: 'patch',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Updated Product",
                variants: [
                    {
                        uuid: product!.variants[0].uuid,
                        price: 900000,
                        inventory_item: {
                            available: 90
                        }
                    }
                ]
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.title).toBe("Updated Product")
        expect(body.data.variants[0].price).toBe(900000)
        expect(body.data.variants[0].inventory_quantity).toBe(90)
    })
})

describe('DELETE /api/products/:uuid', () => {
    afterEach(async () => {
        await ProductTest.delete()
        await UserTest.delete()
    })

    it('should delete product successfully', async () => {
        await UserTest.create()
        await ProductTest.create()
        const product = await ProductTest.findByTitle('Test Product')

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: 'test',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request(`/api/products/${product!.uuid}`, {
            method: 'delete',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBe(true)
    })
})
