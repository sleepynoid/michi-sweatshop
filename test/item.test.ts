import { describe, it, expect, afterEach } from "bun:test"
import app from "../src"
import { logger } from "../src/Application/logging"
import { UserTest, ItemTest } from "./test-utils"

describe('POST /api/items', () => {
    afterEach(async () => {
        await ItemTest.delete()
    })

    it('should create item successfully', async () => {
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

        const response = await app.request('/api/items', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Figure",
                description: "Figure Kawai Kaela",
                price: 800000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.name).toBe("Figure")
        expect(body.data.description).toBe("Figure Kawai Kaela")
        expect(body.data.price).toBe(800000)
    })

    it('should reject create item if request is invalid', async () => {
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

        const response = await app.request('/api/items', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "",
                price: -1000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(400)
        expect(body.errors).toBeDefined()
    })

    it('should reject create item if unauthorized', async () => {
        const response = await app.request('/api/items', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Figure",
                price: 800000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(401)
        expect(body.errors).toBeDefined()
    })
})

describe('GET /api/items', () => {
    afterEach(async () => {
        await ItemTest.delete()
        await UserTest.delete()
    })

    it('should get items successfully', async () => {
        await ItemTest.create()

        const response = await app.request('/api/items', {
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

describe('GET /api/items/:id', () => {
    afterEach(async () => {
        await ItemTest.delete()
        await UserTest.delete()
    })

    it('should get item by id successfully', async () => {
        await ItemTest.create()
        const item = await ItemTest.findByName('Test Item')

        const response = await app.request(`/api/items/${item!.uuid}`, {
            method: 'get'
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.name).toBe("Test Item")
    })

    it('should reject get item if not found', async () => {
        const response = await app.request('/api/items/999', {
            method: 'get'
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(404)
        expect(body.errors).toBeDefined()
    })

    it('should get item detail successfully', async () => {
        await ItemTest.create()
        const item = await ItemTest.findByName('Test Item')

        const response = await app.request(`/api/items/${item!.uuid}/detail`, {
            method: 'get'
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.name).toBe("Test Item")
        expect(body.data.description).toBe("Test Description")
        expect(body.data.price).toBe(100000)
    })
})

describe('PATCH /api/items/:id', () => {
    afterEach(async () => {
        await ItemTest.delete()
        await UserTest.delete()
    })

    it('should update item successfully', async () => {
        await UserTest.create()
        const user = await UserTest.findByUsername('test')
        await ItemTest.create()
        const item = await ItemTest.findByName('Test Item')

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: 'test',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request(`/api/items/${item!.uuid}`, {
            method: 'patch',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Updated Item",
                price: 900000
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.name).toBe("Updated Item")
        expect(body.data.price).toBe(900000)
    })
})

describe('DELETE /api/items/:id', () => {
    afterEach(async () => {
        await ItemTest.delete()
        await UserTest.delete()
    })

    it('should delete item successfully', async () => {
        await UserTest.create()
        const user = await UserTest.findByUsername('test')
        await ItemTest.create()
        const item = await ItemTest.findByName('Test Item')

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: 'test',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request(`/api/items/${item!.uuid}`, {
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
