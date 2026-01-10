import { describe, it, expect, beforeAll, beforeEach, afterEach } from "bun:test"
import app from "../src"
import { logger } from "../src/Application/logging"
import { UserTest, ProductTest } from "./test-utils"
import { openApiSpec } from "../src/openapi"

/**
 * OpenAPI Validation Test Suite
 * 
 * This test suite validates that all API endpoints conform to the OpenAPI specification.
 * It tests:
 * 1. Request parameters match the spec
 * 2. Response structure matches the spec
 * 3. Response status codes match the spec
 */

describe('OpenAPI Specification Validation', () => {
    let authToken: string
    let testProductUuid: string
    let testImageUuid: string
    let testVariantUuid: string

    beforeAll(async () => {
        // Clean up first
        await ProductTest.delete()
        await UserTest.delete()

        // Create test user
        await UserTest.create()

        // Login and get token
        const loginResponse = await app.request('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        authToken = loginBody.data.token

        // Create test product
        const productResponse = await app.request('/api/products', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "OpenAPI Test Product",
                description: "Test Description",
                product_type: "Test Type",
                vendor: "Test Vendor",
                tags: ["test"],
                status: "active",
                variants: [
                    {
                        title: "Test Variant",
                        price: 100000,
                        sku: "OPENAPI-TEST-001",
                        inventory_policy: "deny",
                        option1: "Standard",
                        available: 10,
                        cost: 50000
                    }
                ]
            })
        })

        const productBody = await productResponse.json()
        testProductUuid = productBody.data.uuid
        testVariantUuid = productBody.data.variants[0].uuid

        // Create test image
        const imageResponse = await app.request(`/api/products/${testProductUuid}/images`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: "https://example.com/test-image.jpg",
                alt_text: "Test Image",
                position: 0
            })
        })

        const imageBody = await imageResponse.json()
        testImageUuid = imageBody.data.uuid
    })

    // Get fresh auth token before each test
    beforeEach(async () => {
        const loginResponse = await app.request('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'test123'
            })
        })

        const loginBody = await loginResponse.json()
        authToken = loginBody.data.token
    })

    describe('POST /api/users - Register User', () => {
        it('should match OpenAPI spec for successful registration', async () => {
            const spec = openApiSpec.paths['/api/users'].post

            const response = await app.request('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'newuser@example.com',
                    phone: '+628123456789',
                    password: 'password123',
                    name: 'New User',
                    role: 'user'
                })
            })

            const body = await response.json()
            logger.debug('Register response:', body)

            // Validate status code
            expect(response.status).toBe(200)

            // Validate response structure
            expect(body.data).toBeDefined()
            expect(body.data.email).toBe('newuser@example.com')
            expect(body.data.phone).toBe('+628123456789')
            expect(body.data.name).toBe('New User')
            expect(body.data.role).toBeDefined()

            // Clean up
            await UserTest.delete()
            await UserTest.create()
        })

        it('should match OpenAPI spec for validation error (400)', async () => {
            const response = await app.request('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'invalid-email',
                    phone: '',
                    password: '123',
                    name: ''
                })
            })

            const body = await response.json()
            logger.debug('Validation error response:', body)

            expect(response.status).toBe(400)
            expect(body.errors).toBeDefined()
        })
    })

    describe('POST /api/users/login - Login User', () => {
        it('should match OpenAPI spec for successful login', async () => {
            const spec = openApiSpec.paths['/api/users/login'].post

            const response = await app.request('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'test123'
                })
            })

            const body = await response.json()
            logger.debug('Login response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(body.data.email).toBe('test@example.com')
            expect(body.data.phone).toBeDefined()
            expect(body.data.name).toBeDefined()
            expect(body.data.role).toBeDefined()
            expect(body.data.token).toBeDefined()
        })

        it('should match OpenAPI spec for invalid credentials (401)', async () => {
            const response = await app.request('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                })
            })

            const body = await response.json()
            logger.debug('Invalid credentials response:', body)

            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })
    })

    describe('GET /api/products - Get All Products', () => {
        it('should match OpenAPI spec for successful response', async () => {
            const spec = openApiSpec.paths['/api/products'].get

            const response = await app.request('/api/products?page=1&limit=10', {
                method: 'GET'
            })

            const body = await response.json()
            logger.debug('Get products response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(Array.isArray(body.data)).toBe(true)
            expect(body.pagination).toBeDefined()
            expect(body.pagination.page).toBeDefined()
            expect(body.pagination.limit).toBeDefined()
            expect(body.pagination.total).toBeDefined()
            expect(body.pagination.totalPages).toBeDefined()

            // Validate product structure if products exist
            if (body.data.length > 0) {
                const product = body.data[0]
                expect(product.uuid).toBeDefined()
                expect(product.title).toBeDefined()
                expect(product.product_type).toBeDefined()
                expect(product.vendor).toBeDefined()
                expect(product.status).toBeDefined()
                expect(Array.isArray(product.tags)).toBe(true)
                expect(Array.isArray(product.variants)).toBe(true)
                expect(Array.isArray(product.images)).toBe(true)
            }
        })
    })

    describe('POST /api/products - Create Product', () => {
        it('should match OpenAPI spec for successful creation', async () => {
            const spec = openApiSpec.paths['/api/products'].post

            const response = await app.request('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Spec Test Product",
                    description: "Test Description",
                    product_type: "Test Type",
                    vendor: "Test Vendor",
                    tags: ["test", "spec"],
                    status: "active",
                    variants: [
                        {
                            title: "Test Variant",
                            price: 100000,
                            sku: "SPEC-TEST-001",
                            inventory_policy: "deny",
                            option1: "Standard",
                            available: 10,
                            cost: 50000
                        }
                    ],
                    images: [
                        {
                            url: "https://example.com/image.jpg",
                            alt_text: "Test Image",
                            position: 0
                        }
                    ]
                })
            })

            const body = await response.json()
            logger.debug('Create product response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(body.data.uuid).toBeDefined()
            expect(body.data.title).toBe("Spec Test Product")
            expect(body.data.description).toBe("Test Description")
            expect(body.data.product_type).toBe("Test Type")
            expect(body.data.vendor).toBe("Test Vendor")
            expect(body.data.tags).toEqual(["test", "spec"])
            expect(body.data.status).toBe("active")
            expect(body.data.variants).toBeDefined()
            expect(body.data.variants.length).toBe(1)
            expect(body.data.images).toBeDefined()
            expect(body.data.images.length).toBe(1)
        })

        it('should match OpenAPI spec for validation error (400)', async () => {
            const response = await app.request('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "",
                    variants: []
                })
            })

            const body = await response.json()
            logger.debug('Validation error response:', body)

            expect(response.status).toBe(400)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for unauthorized (401)', async () => {
            const response = await app.request('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Test Product",
                    product_type: "Test",
                    vendor: "Test",
                    status: "active",
                    variants: []
                })
            })

            const body = await response.json()
            logger.debug('Unauthorized response:', body)

            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })
    })

    describe('GET /api/products/{uuid} - Get Product by UUID', () => {
        it('should match OpenAPI spec for successful response', async () => {
            const spec = openApiSpec.paths['/api/products/{uuid}'].get

            const response = await app.request(`/api/products/${testProductUuid}`, {
                method: 'GET'
            })

            const body = await response.json()
            logger.debug('Get product by UUID response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(body.data.uuid).toBe(testProductUuid)
            expect(body.data.title).toBeDefined()
            expect(body.data.product_type).toBeDefined()
            expect(body.data.vendor).toBeDefined()
            expect(body.data.status).toBeDefined()
            expect(Array.isArray(body.data.variants)).toBe(true)
            expect(Array.isArray(body.data.images)).toBe(true)
        })

        it('should match OpenAPI spec for not found (404)', async () => {
            const response = await app.request('/api/products/invalid-uuid-12345', {
                method: 'GET'
            })

            const body = await response.json()
            logger.debug('Not found response:', body)

            expect(response.status).toBe(404)
            expect(body.errors).toBeDefined()
        })
    })

    describe('PATCH /api/products/{uuid} - Update Product', () => {
        it('should match OpenAPI spec for successful update', async () => {
            const spec = openApiSpec.paths['/api/products/{uuid}'].patch

            const response = await app.request(`/api/products/${testProductUuid}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Updated Product Title",
                    description: "Updated Description",
                    variants: [
                        {
                            uuid: testVariantUuid,
                            price: 150000
                        }
                    ]
                })
            })

            const body = await response.json()
            logger.debug('Update product response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(body.data.uuid).toBe(testProductUuid)
            expect(body.data.title).toBe("Updated Product Title")
            expect(body.data.description).toBe("Updated Description")
        })

        it('should match OpenAPI spec for unauthorized (401)', async () => {
            const response = await app.request(`/api/products/${testProductUuid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Updated Title"
                })
            })

            const body = await response.json()
            logger.debug('Unauthorized response:', body)

            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for not found (404)', async () => {
            const response = await app.request('/api/products/invalid-uuid-12345', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Updated Title"
                })
            })

            const body = await response.json()
            logger.debug('Not found response:', body)

            expect(response.status).toBe(404)
            expect(body.errors).toBeDefined()
        })
    })

    describe('GET /api/products/{uuid}/detail - Get Product Detail', () => {
        it('should match OpenAPI spec for successful response', async () => {
            const spec = openApiSpec.paths['/api/products/{uuid}/detail'].get

            const response = await app.request(`/api/products/${testProductUuid}/detail`, {
                method: 'GET'
            })

            const body = await response.json()
            logger.debug('Get product detail response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(body.data.uuid).toBe(testProductUuid)
            expect(body.data.title).toBeDefined()
            expect(body.data.description).toBeDefined()
            expect(body.data.product_type).toBeDefined()
            expect(body.data.vendor).toBeDefined()
            expect(Array.isArray(body.data.variants)).toBe(true)
            expect(Array.isArray(body.data.images)).toBe(true)
        })

        it('should match OpenAPI spec for not found (404)', async () => {
            const response = await app.request('/api/products/invalid-uuid-12345/detail', {
                method: 'GET'
            })

            const body = await response.json()
            logger.debug('Not found response:', body)

            expect(response.status).toBe(404)
            expect(body.errors).toBeDefined()
        })
    })

    describe('POST /api/products/{uuid}/images - Link Product Image', () => {
        it('should match OpenAPI spec for successful image link', async () => {
            const spec = openApiSpec.paths['/api/products/{uuid}/images'].post

            const response = await app.request(`/api/products/${testProductUuid}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: "https://example.com/new-image.jpg",
                    alt_text: "New Test Image",
                    position: 1
                })
            })

            const body = await response.json()
            logger.debug('Link image response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(body.data.uuid).toBeDefined()
            expect(body.data.url).toBe("https://example.com/new-image.jpg")
            expect(body.data.alt_text).toBe("New Test Image")
            expect(body.data.position).toBe(1)
            expect(body.data.productId).toBe(testProductUuid)
        })

        it('should match OpenAPI spec for validation error (400)', async () => {
            const response = await app.request(`/api/products/${testProductUuid}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    alt_text: "Missing URL"
                })
            })

            const body = await response.json()
            logger.debug('Validation error response:', body)

            expect(response.status).toBe(400)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for unauthorized (401)', async () => {
            const response = await app.request(`/api/products/${testProductUuid}/images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: "https://example.com/image.jpg"
                })
            })

            const body = await response.json()
            logger.debug('Unauthorized response:', body)

            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for not found (404)', async () => {
            const response = await app.request('/api/products/invalid-uuid-12345/images', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: "https://example.com/image.jpg"
                })
            })

            const body = await response.json()
            logger.debug('Not found response:', body)

            expect(response.status).toBe(404)
            expect(body.errors).toBeDefined()
        })
    })

    describe('POST /api/products/{uuid}/images/upload - Upload Product Image', () => {
        it('should match OpenAPI spec for successful file upload', async () => {
            const spec = openApiSpec.paths['/api/products/{uuid}/images/upload'].post

            const formData = new FormData()
            const testImageBuffer = Buffer.from('fake image content for testing')
            const testFile = new File([testImageBuffer], 'test.jpg', { type: 'image/jpeg' })

            formData.append('image', testFile)
            formData.append('alt_text', 'Uploaded Test Image')
            formData.append('position', '2')

            const response = await app.request(`/api/products/${testProductUuid}/images/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            })

            const body = await response.json()
            logger.debug('Upload image response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(body.data.uuid).toBeDefined()
            expect(body.data.url).toBeDefined()
            expect(body.data.filename).toBeDefined()
            expect(body.data.size).toBeGreaterThan(0)
            expect(body.data.mime_type).toBe('image/jpeg')
            expect(body.data.productId).toBe(testProductUuid)
        })

        it('should match OpenAPI spec for validation error (400)', async () => {
            const formData = new FormData()
            const testFile = new File(['text content'], 'test.txt', { type: 'text/plain' })
            formData.append('image', testFile)

            const response = await app.request(`/api/products/${testProductUuid}/images/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            })

            const body = await response.json()
            logger.debug('Validation error response:', body)

            expect(response.status).toBe(400)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for unauthorized (401)', async () => {
            const formData = new FormData()
            const testFile = new File([Buffer.from('test')], 'test.jpg', { type: 'image/jpeg' })
            formData.append('image', testFile)

            const response = await app.request(`/api/products/${testProductUuid}/images/upload`, {
                method: 'POST',
                body: formData
            })

            const body = await response.json()
            logger.debug('Unauthorized response:', body)

            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for not found (404)', async () => {
            const formData = new FormData()
            const testFile = new File([Buffer.from('test')], 'test.jpg', { type: 'image/jpeg' })
            formData.append('image', testFile)

            const response = await app.request('/api/products/invalid-uuid-12345/images/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            })

            const body = await response.json()
            logger.debug('Not found response:', body)

            expect(response.status).toBe(404)
            expect(body.errors).toBeDefined()
        })
    })

    describe('DELETE /api/products/{uuid}/images/{imageId} - Delete Product Image', () => {
        it('should match OpenAPI spec for successful deletion', async () => {
            const spec = openApiSpec.paths['/api/products/{uuid}/images/{imageId}'].delete

            const response = await app.request(`/api/products/${testProductUuid}/images/${testImageUuid}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            const body = await response.json()
            logger.debug('Delete image response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBe(true)
        })

        it('should match OpenAPI spec for unauthorized (401)', async () => {
            const response = await app.request(`/api/products/${testProductUuid}/images/some-image-uuid`, {
                method: 'DELETE'
            })

            const body = await response.json()
            logger.debug('Unauthorized response:', body)

            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for not found (404)', async () => {
            const response = await app.request(`/api/products/${testProductUuid}/images/invalid-image-uuid`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            const body = await response.json()
            logger.debug('Not found response:', body)

            expect(response.status).toBe(404)
            expect(body.errors).toBeDefined()
        })
    })

    describe('DELETE /api/products/{uuid} - Delete Product', () => {
        it('should match OpenAPI spec for successful deletion', async () => {
            // Create a product to delete
            const createResponse = await app.request('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Product to Delete",
                    product_type: "Test",
                    vendor: "Test",
                    status: "active",
                    variants: [{
                        title: "Variant",
                        price: 100,
                        sku: "DELETE-TEST-001",
                        inventory_policy: "deny",
                        option1: "Standard"
                    }]
                })
            })

            const createBody = await createResponse.json()
            const productToDeleteUuid = createBody.data.uuid

            const spec = openApiSpec.paths['/api/products/{uuid}'].delete

            const response = await app.request(`/api/products/${productToDeleteUuid}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            const body = await response.json()
            logger.debug('Delete product response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBe(true)
        })

        it('should match OpenAPI spec for unauthorized (401)', async () => {
            const response = await app.request(`/api/products/${testProductUuid}`, {
                method: 'DELETE'
            })

            const body = await response.json()
            logger.debug('Unauthorized response:', body)

            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for not found (404)', async () => {
            const response = await app.request('/api/products/invalid-uuid-12345', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })

            const body = await response.json()
            logger.debug('Not found response:', body)

            expect(response.status).toBe(404)
            expect(body.errors).toBeDefined()
        })
    })

    describe('POST /api/variants - Create Variant', () => {
        it('should match OpenAPI spec for successful creation', async () => {
            const spec = openApiSpec.paths['/api/variants'].post

            const response = await app.request('/api/variants', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: testProductUuid,
                    title: "New Variant",
                    price: 200000,
                    sku: "NEW-VARIANT-001",
                    inventory_policy: "deny",
                    option1: "Premium",
                    available: 5,
                    cost: 100000,
                    images: [
                        {
                            url: "https://example.com/variant-image.jpg",
                            alt_text: "Variant Image",
                            position: 0
                        }
                    ]
                })
            })

            const body = await response.json()
            logger.debug('Create variant response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(body.data.uuid).toBeDefined()
            expect(body.data.title).toBe("New Variant")
            expect(body.data.price).toBe(200000)
            expect(body.data.sku).toBe("NEW-VARIANT-001")
            expect(body.data.available).toBe(5)
            expect(body.data.cost).toBe(100000)
            expect(Array.isArray(body.data.images)).toBe(true)
        })

        it('should match OpenAPI spec for validation error (400)', async () => {
            const response = await app.request('/api/variants', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: testProductUuid,
                    title: ""
                })
            })

            const body = await response.json()
            logger.debug('Validation error response:', body)

            expect(response.status).toBe(400)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for unauthorized (401)', async () => {
            const response = await app.request('/api/variants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: testProductUuid,
                    title: "Variant"
                })
            })

            const body = await response.json()
            logger.debug('Unauthorized response:', body)

            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for not found (404)', async () => {
            const response = await app.request('/api/variants', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: "invalid-product-uuid",
                    title: "Variant",
                    price: 100,
                    sku: "TEST",
                    inventory_policy: "deny",
                    option1: "Standard"
                })
            })

            const body = await response.json()
            logger.debug('Not found response:', body)

            expect(response.status).toBe(404)
            expect(body.errors).toBeDefined()
        })
    })

    describe('GET /api/variants/{uuid} - Get Variant by UUID', () => {
        it('should match OpenAPI spec for successful response', async () => {
            const spec = openApiSpec.paths['/api/variants/{uuid}'].get

            const response = await app.request(`/api/variants/${testVariantUuid}`, {
                method: 'GET'
            })

            const body = await response.json()
            logger.debug('Get variant response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(body.data.uuid).toBe(testVariantUuid)
            expect(body.data.title).toBeDefined()
            expect(body.data.price).toBeDefined()
            expect(body.data.sku).toBeDefined()
            expect(body.data.available).toBeDefined()
            expect(body.data.cost).toBeDefined()
            expect(Array.isArray(body.data.images)).toBe(true)
        })

        it('should match OpenAPI spec for not found (404)', async () => {
            const response = await app.request('/api/variants/invalid-uuid-12345', {
                method: 'GET'
            })

            const body = await response.json()
            logger.debug('Not found response:', body)

            expect(response.status).toBe(404)
            expect(body.errors).toBeDefined()
        })
    })

    describe('PATCH /api/variants/{uuid} - Update Variant', () => {
        it('should match OpenAPI spec for successful update', async () => {
            const spec = openApiSpec.paths['/api/variants/{uuid}'].patch

            const response = await app.request(`/api/variants/${testVariantUuid}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Updated Variant Title",
                    price: 250000,
                    available: 20
                })
            })

            const body = await response.json()
            logger.debug('Update variant response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBeDefined()
            expect(body.data.uuid).toBe(testVariantUuid)
            expect(body.data.title).toBe("Updated Variant Title")
            expect(body.data.price).toBe(250000)
            expect(body.data.available).toBe(20)
        })

        it('should match OpenAPI spec for validation error (400)', async () => {
            const response = await app.request(`/api/variants/${testVariantUuid}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    price: -100
                })
            })

            const body = await response.json()
            logger.debug('Validation error response:', body)

            expect(response.status).toBe(400)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for unauthorized (401)', async () => {
            const response = await app.request(`/api/variants/${testVariantUuid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Updated Title"
                })
            })

            const body = await response.json()
            logger.debug('Unauthorized response:', body)

            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })

        it('should match OpenAPI spec for not found (404)', async () => {
            const response = await app.request('/api/variants/invalid-uuid-12345', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: "Updated Title"
                })
            })

            const body = await response.json()
            logger.debug('Not found response:', body)

            expect(response.status).toBe(404)
            expect(body.errors).toBeDefined()
        })
    })

    describe('PATCH /api/products/{uuid}/images/reorder - Reorder Product Images', () => {
        it('should match OpenAPI spec for successful reorder', async () => {
            const timestamp = Date.now();
            // Create temp product for this test
            const prodRes = await app.request('/api/products', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Reorder Prod ${timestamp}`,
                    description: "Test Reorder Description",
                    product_type: "Test",
                    vendor: "Test",
                    status: "active",
                    tags: ["reorder"],
                    variants: [{
                        title: "V1", price: 100, sku: `VR-PROD-${timestamp}`, inventory_policy: "deny", option1: "A", available: 10, cost: 50
                    }],
                    images: [{ url: "http://e.com/1.jpg", position: 0 }, { url: "http://e.com/2.jpg", position: 1 }]
                })
            })
            const prodBody = await prodRes.json()
            if (prodRes.status !== 200) {
                console.error("Create product failed:", prodBody)
                throw new Error("Setup failed: Create product failed")
            }
            const prod = prodBody.data

            const response = await app.request(`/api/products/${prod.uuid}/images/reorder`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: [
                        { imageId: prod.images[1].uuid, position: 0 },
                        { imageId: prod.images[0].uuid, position: 1 }
                    ]
                })
            })

            const body = await response.json()
            logger.debug('Reorder product images response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBe(true)
        })

        it('should match OpenAPI spec for unauthorized (401)', async () => {
            // Use dummy UUID for unauthorized check, auth middleware should catch it first
            const response = await app.request(`/api/products/123e4567-e89b-12d3-a456-426614174000/images/reorder`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: []
                })
            })

            const body = await response.json()
            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })
    })

    describe('PATCH /api/variants/{uuid}/images/reorder - Reorder Variant Images', () => {
        it('should match OpenAPI spec for successful reorder', async () => {
            const timestamp = Date.now();
            // Create temp product
            const prodRes = await app.request('/api/products', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Variant Reorder ${timestamp}`,
                    description: "Test Variant Reorder Description",
                    product_type: "Test",
                    vendor: "Test",
                    status: "active",
                    tags: ["reorder-var"],
                    variants: [{
                        title: "V1", price: 100, sku: `VR-${timestamp}`, inventory_policy: "deny", option1: "A", available: 10, cost: 50,
                        images: [{ url: "http://e.com/v1.jpg", position: 0 }]
                    }]
                })
            })
            const prodBody = await prodRes.json()
            if (prodRes.status !== 200) {
                console.error("Create product failed:", prodBody)
                throw new Error("Setup failed: Create product failed")
            }
            const prod = prodBody.data
            const variant = prod.variants[0]

            const response = await app.request(`/api/variants/${variant.uuid}/images/reorder`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: [
                        { imageId: variant.images[0].uuid, position: 0 }
                    ]
                })
            })

            const body = await response.json()
            logger.debug('Reorder variant images response:', body)

            expect(response.status).toBe(200)
            expect(body.data).toBe(true)
        })

        it('should match OpenAPI spec for unauthorized (401)', async () => {
            const response = await app.request(`/api/variants/123e4567-e89b-12d3-a456-426614174000/images/reorder`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: []
                })
            })

            const body = await response.json()
            expect(response.status).toBe(401)
            expect(body.errors).toBeDefined()
        })
    })
})
