import { describe, it, expect, afterEach, beforeEach } from "bun:test"
import app from "../src"
import { logger } from "../src/Application/logging"
import { UserTest, ProductTest } from "./test-utils"
import { CreateProductRequest } from "../src/model/product-model"

describe('POST /api/products', () => {
    afterEach(async () => {
        await ProductTest.delete()
        await UserTest.delete()
    })

    beforeEach(async () => {
        await ProductTest.delete()
        await UserTest.delete()
    })


    it('should create product successfully', async () => {
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
                        available: 30,
                        cost: 100000
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
        expect(body.data.variants[0].available).toBe(30)
    })

    it('should create product with images successfully', async () => {
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

        const response = await app.request('/api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Product with Images",
                description: "Test Description",
                product_type: "Test Type",
                vendor: "Test Vendor",
                tags: ["test"],
                status: "active",
                variants: [
                    {
                        title: "Default Variant",
                        price: 100000,
                        sku: "PROD-IMG-001",
                        inventory_policy: "deny",
                        option1: "Standard",
                        available: 10,
                        cost: 50000
                    }
                ],
                images: [
                    {
                        url: "http://example.com/image1.jpg",
                        alt_text: "Image 1",
                        position: 1
                    }
                ]
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data.images).toBeDefined()
        expect(body.data.images.length).toBe(1)
        expect(body.data.images[0].url).toBe("http://example.com/image1.jpg")
        expect(body.data.images[0].alt_text).toBe("Image 1")
    })

it('should reject create product if request is invalid', async () => {
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
                    available: 30,
                    cost: 100000
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
        expect(body.data.variants[0].available).toBe(50)
        expect(body.data.variants[0].cost).toBe(50000)
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
                email: 'test@example.com',
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
                        available: 30,
                        cost: 100000
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
        expect(body.data.variants[0].available).toBe(30)
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
                email: 'test@example.com',
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

describe('POST /api/products/:uuid/images', () => {
    afterEach(async () => {
        await ProductTest.delete()
        await UserTest.delete()
    })

    it('should upload image successfully', async () => {
        await UserTest.create()
        await ProductTest.create()
        const product = await ProductTest.findByTitle('Test Product')

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        const response = await app.request(`/api/products/${product!.uuid}/images`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: "https://example.com/image1.jpg",
                alt_text: "Product Image 1",
                position: 0
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.url).toBe("https://example.com/image1.jpg")
        expect(body.data.alt_text).toBe("Product Image 1")
        expect(body.data.position).toBe(0)
        expect(body.data.productId).toBe(product!.uuid)
    })

    it('should upload image with auto position successfully', async () => {
        await UserTest.create()
        await ProductTest.create()
        const product = await ProductTest.findByTitle('Test Product')

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        // Upload first image
        await app.request(`/api/products/${product!.uuid}/images`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: "https://example.com/image1.jpg",
                alt_text: "Product Image 1"
            })
        })

        // Upload second image without position (should auto-assign position 1)
        const response = await app.request(`/api/products/${product!.uuid}/images`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: "https://example.com/image2.jpg",
                alt_text: "Product Image 2"
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.url).toBe("https://example.com/image2.jpg")
        expect(body.data.alt_text).toBe("Product Image 2")
        expect(body.data.position).toBe(1)
        expect(body.data.productId).toBe(product!.uuid)
    })

    it('should reject upload image if product not found', async () => {
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

        const response = await app.request('/api/products/invalid-uuid/images', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: "https://example.com/image1.jpg",
                alt_text: "Product Image 1"
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(404)
        expect(body.errors).toBeDefined()
    })

    it('should reject upload image if unauthorized', async () => {
        await ProductTest.create()
        const product = await ProductTest.findByTitle('Test Product')

        const response = await app.request(`/api/products/${product!.uuid}/images`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: "https://example.com/image1.jpg",
                alt_text: "Product Image 1"
            })
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(401)
        expect(body.errors).toBeDefined()
    })

    it('should upload image file successfully', async () => {
        await UserTest.create()
        await ProductTest.create()
        const product = await ProductTest.findByTitle('Test Product')

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        // Create FormData
        const formData = new FormData()

        // Create test file
        const testImageBuffer = Buffer.from('fake image content for testing')
        const testFile = new File([testImageBuffer], 'test.jpg', { type: 'image/jpeg' })

        formData.append('image', testFile)
        formData.append('alt_text', 'Test Image')
        formData.append('position', '0')

        const response = await app.request(`/api/products/${product!.uuid}/images/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(200)
        expect(body.data).toBeDefined()
        expect(body.data.url).toContain('/uploads/products/')
        expect(body.data.filename).toBeDefined()
        expect(body.data.size).toBeGreaterThan(0)
        expect(body.data.mime_type).toBe('image/jpeg')
    })

    it('should reject upload file if not an image', async () => {
        await UserTest.create()
        await ProductTest.create()
        const product = await ProductTest.findByTitle('Test Product')

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        // Create FormData with non-image file
        const formData = new FormData()
        const testFile = new File(['test text content'], 'test.txt', { type: 'text/plain' })

        formData.append('image', testFile)

        const response = await app.request(`/api/products/${product!.uuid}/images/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(400)
        expect(body.errors).toBeDefined()
    })

    it('should reject upload file if no file provided', async () => {
        await UserTest.create()
        await ProductTest.create()
        const product = await ProductTest.findByTitle('Test Product')

        const loginResponse = await app.request('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        const token = loginBody.data.token

        // Create FormData without file
        const formData = new FormData()
        formData.append('alt_text', 'Test Image')

        const response = await app.request(`/api/products/${product!.uuid}/images/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        const body = await response.json()
        logger.debug(body)

        expect(response.status).toBe(400)
        expect(body.errors).toBeDefined()
    })
})
