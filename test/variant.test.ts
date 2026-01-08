import { describe, it, expect, afterEach } from "bun:test"
import app from "../src"
import { logger } from "../src/Application/logging"
import { UserTest, ProductTest, VariantTest } from "./test-utils"

describe('POST /api/variants', () => {
    afterEach(async () => {
        await VariantTest.delete()
        await ProductTest.delete()
        await UserTest.delete()
    })

    it('should create variant successfully', async () => {
        await UserTest.create()
        await ProductTest.create()
        const product = await ProductTest.findByTitle("Test Product")
        expect(product).not.toBeNull()
        if (!product) throw new Error("Product not found")

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request('/api/variants', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: product.uuid,
                title: "New Variant",
                price: 200000,
                sku: "NEW-VARIANT-001",
                inventory_policy: "deny",
                option1: "Large",
                available: 30,
                cost: 100000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.title).toBe("New Variant")
        expect(body.data.price).toBe(200000)
        expect(body.data.sku).toBe("NEW-VARIANT-001")
        expect(body.data.available).toBe(30)
        expect(body.data.cost).toBe(100000)
        expect(body.data.inventory_policy).toBe("deny")
        expect(body.data.option1).toBe("Large")
    })

    it('should reject create variant if product not found', async () => {
        await UserTest.create()

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request('/api/variants', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: "invalid-uuid",
                title: "New Variant",
                price: 200000,
                sku: "NEW-VARIANT-001",
                inventory_policy: "deny",
                option1: "Large",
                available: 30,
                cost: 100000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(404)
        expect(body.errors).toBeDefined()
    })

    it('should reject create variant if SKU already exists', async () => {
        await UserTest.create()
        await ProductTest.create()
        const product = await ProductTest.findByTitle("Test Product")
        if (!product) throw new Error("Product not found")

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        // Create first variant
        await app.request('/api/variants', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: product.uuid,
                title: "First Variant",
                price: 200000,
                sku: "DUPLICATE-SKU",
                inventory_policy: "deny",
                option1: "Large",
                available: 30,
                cost: 100000
            })
        })

        // Try to create second variant with same SKU
        const response = await app.request('/api/variants', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: product.uuid,
                title: "Second Variant",
                price: 250000,
                sku: "DUPLICATE-SKU",
                inventory_policy: "deny",
                option1: "Extra Large",
                available: 30,
                cost: 100000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(400)
        expect(body.errors).toBeDefined()
    })

    it('should reject create variant if productId not provided', async () => {
        await UserTest.create()

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request('/api/variants', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "New Variant",
                price: 200000,
                sku: "NEW-VARIANT-001",
                inventory_policy: "deny",
                option1: "Large",
                available: 30,
                cost: 100000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(400)
        expect(body.errors).toBeDefined()
    })

    it('should reject create variant if unauthorized', async () => {
        await ProductTest.create()
        const product = await ProductTest.findByTitle("Test Product")
        if (!product) throw new Error("Product not found")

        const response = await app.request('/api/variants', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: product.uuid,
                title: "New Variant",
                price: 200000,
                sku: "NEW-VARIANT-001",
                inventory_policy: "deny",
                option1: "Large",
                available: 30,
                cost: 100000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(401)
        expect(body.errors).toBeDefined()
    })
})

describe('GET /api/variants/:uuid', () => {
    afterEach(async () => {
        await VariantTest.delete()
        await UserTest.delete()
    })

    it('should get variant by uuid successfully', async () => {
        const variant = await VariantTest.create()

        const response = await app.request(`/api/variants/${variant.uuid}`, {
            method: 'get'
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.uuid).toBe(variant.uuid)
        expect(body.data.title).toBe("Test Variant")
        expect(body.data.price).toBe(100000)
        expect(body.data.sku).toBe("TEST-VARIANT-001")
        expect(body.data.available).toBe(50)
        expect(body.data.cost).toBe(50000)
        expect(body.data.inventory_policy).toBe("deny")
        expect(body.data.option1).toBe("Standard")
    })

    it('should reject get variant if not found', async () => {
        const response = await app.request('/api/variants/invalid-uuid', {
            method: 'get'
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(404)
        expect(body.errors).toBeDefined()
    })
})

describe('PATCH /api/variants/:uuid', () => {
    afterEach(async () => {
        await VariantTest.delete()
        await UserTest.delete()
    })

    it('should update variant successfully', async () => {
        await UserTest.create()
        const variant = await VariantTest.create()

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request(`/api/variants/${variant.uuid}`, {
            method: 'patch',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                price: 120000,
                available: 30,
                cost: 100000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.uuid).toBe(variant.uuid)
        expect(body.data.price).toBe(120000)
        expect(body.data.available).toBe(30)
        expect(body.data.cost).toBe(100000)
    })

    it('should update variant title and sku successfully', async () => {
        await UserTest.create()
        const variant = await VariantTest.create()

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request(`/api/variants/${variant.uuid}`, {
            method: 'patch',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Updated Variant",
                sku: "UPDATED-VARIANT-001",
                option1: "Premium"
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.title).toBe("Updated Variant")
        expect(body.data.sku).toBe("UPDATED-VARIANT-001")
        expect(body.data.option1).toBe("Premium")
    })

    it('should reject update variant if not found', async () => {
        await UserTest.create()

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request('/api/variants/invalid-uuid', {
            method: 'patch',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                price: 120000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(404)
        expect(body.errors).toBeDefined()
    })

    it('should reject update variant if unauthorized', async () => {
        const variant = await VariantTest.create()

        const response = await app.request(`/api/variants/${variant.uuid}`, {
            method: 'patch',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                price: 120000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(401)
        expect(body.errors).toBeDefined()
    })
})
