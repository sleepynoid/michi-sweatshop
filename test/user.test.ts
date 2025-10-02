import { describe, it, expect, afterEach } from "bun:test"
import app from "../src"
import { json } from "zod"
import { logger } from "../src/Application/logging"
import { UserTest } from "./test-utils"
import { password } from "bun"

describe('POST /api/users', () => {
    afterEach(async () => {
        UserTest.delete()
    })

    it('should reject register new user if request is invalid', async () => {
        const response = await app.request('/api/users', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: "",
                password: "",
                name: ""
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(400)
        expect(body.errors).toBeDefined()
    });

    it('should reject register new user if user already exists', async () => {
        await UserTest.create()

        const response = await app.request('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username: "test",
                name: "test",
                password: "test123"
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(400)
        expect(body.errors).toBeDefined()
    })

    it('should register new user successfully', async () => {
        const response = await app.request('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username: "test",
                name: "test",
                password: "test123"
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.username).toBe("test")
        expect(body.data.name).toBe("test")
    })
})

describe('POST /api/users/login' ,() => {
    afterEach(async () => {
        UserTest.delete()
    })

    it('should login existing user successfully', async () => {

        await UserTest.create()

        const response = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: 'test',
                password: 'test123'
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.username).toBe('test')
        expect(body.data.name).toBe('test')
        expect(body.data.token).toBeDefined()
    })

    it('should reject login for non-existing username ', async () => {
        await UserTest.create()

        const response = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: 'paijo',
                password: 'test123'
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(401)
        expect(body.errors).toBeDefined()
    })

    it('should reject login for non-existing password ', async () => {
        await UserTest.create()

        const response = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username: 'test',
                password: 'test12345'
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(401)
        expect(body.errors).toBeDefined()
    }) 
})
