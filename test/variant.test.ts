import { describe, it, expect, afterEach } from "bun:test"
import app from "../src"
import { logger } from "../src/Application/logging"
import { UserTest, VariantTest } from "./test-utils"

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
        expect(body.data.inventory_quantity).toBe(50)
        expect(body.data.inventory_policy).toBe("deny")
        expect(body.data.option1).toBe("Standard")
        expect(body.data.inventory_item).toBeDefined()
        expect(body.data.inventory_item.sku).toBe("TEST-VARIANT-001")
        expect(body.data.inventory_item.available).toBe(50)
        expect(body.data.inventory_item.tracked).toBe(true)
        expect(body.data.inventory_item.cost).toBe(50000)
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
                username: 'test',
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
                inventory_item: {
                    available: 75,
                    cost: 60000
                }
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.uuid).toBe(variant.uuid)
        expect(body.data.price).toBe(120000)
        expect(body.data.inventory_quantity).toBe(75)
        expect(body.data.inventory_item.available).toBe(75)
        expect(body.data.inventory_item.cost).toBe(60000)
    })

    it('should update variant title and sku successfully', async () => {
        await UserTest.create()
        const variant = await VariantTest.create()

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: 'test',
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
                username: 'test',
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
