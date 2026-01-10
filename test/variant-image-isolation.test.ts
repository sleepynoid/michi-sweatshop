import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import app from '../src/index'
import { UserTest, ProductTest } from './test-utils'

describe('Variant Image Isolation', () => {
    beforeAll(async () => {
        await UserTest.delete()
        await ProductTest.delete()
    })

    afterAll(async () => {
        await UserTest.delete()
        await ProductTest.delete()
    })

    it('should not show variant images in product images list', async () => {
        // 1. Create user and product
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

        // 2. Get product details to find variant
        const detailResponse = await app.request(`/api/products/${product.uuid}/detail`)
        const detailBody = await detailResponse.json()
        const variant = detailBody.data.variants[0]

        // 3. Upload image to VARIANT
        const formData = new FormData()
        formData.append('image', new Blob([Buffer.from('variant image')], { type: 'image/jpeg' }), 'variant.jpg')
        formData.append('alt_text', 'Variant Image')

        const uploadResponse = await app.request(`/api/variants/${variant.uuid}/images/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        expect(uploadResponse.status).toBe(200)
        const uploadBody = await uploadResponse.json()
        expect(uploadBody.data.position).toBe(0)

        // 4. Get product details again
        const updatedDetailResponse = await app.request(`/api/products/${product.uuid}/detail`)
        const updatedDetailBody = await updatedDetailResponse.json()

        // 5. Verify variant has the image
        const updatedVariant = updatedDetailBody.data.variants[0]
        expect(updatedVariant.images.length).toBe(1)
        expect(updatedVariant.images[0].alt_text).toBe('Variant Image')

        // 6. CRITICAL: Verify product does NOT have the variant image
        const productImages = updatedDetailBody.data.images
        expect(productImages.length).toBe(0) // Product should have NO images

        // Double check: no image should have the variant's image alt_text
        const hasVariantImage = productImages.some((img: any) => img.alt_text === 'Variant Image')
        expect(hasVariantImage).toBe(false)
    })

    it('should keep product and variant images separate', async () => {
        // Clean up from previous test
        await UserTest.delete()
        await ProductTest.delete()

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

        const detailResponse = await app.request(`/api/products/${product.uuid}/detail`)
        const detailBody = await detailResponse.json()
        const variant = detailBody.data.variants[0]

        // Upload to PRODUCT
        const productFormData = new FormData()
        productFormData.append('image', new Blob([Buffer.from('product image')], { type: 'image/jpeg' }), 'product.jpg')
        productFormData.append('alt_text', 'Product Image')

        await app.request(`/api/products/${product.uuid}/images/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: productFormData
        })

        // Upload to VARIANT
        const variantFormData = new FormData()
        variantFormData.append('image', new Blob([Buffer.from('variant image')], { type: 'image/jpeg' }), 'variant.jpg')
        variantFormData.append('alt_text', 'Variant Image')

        await app.request(`/api/variants/${variant.uuid}/images/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: variantFormData
        })

        // Verify separation
        const finalResponse = await app.request(`/api/products/${product.uuid}/detail`)
        const finalBody = await finalResponse.json()

        // Product should have ONLY product image
        expect(finalBody.data.images.length).toBe(1)
        expect(finalBody.data.images[0].alt_text).toBe('Product Image')

        // Variant should have ONLY variant image
        expect(finalBody.data.variants[0].images.length).toBe(1)
        expect(finalBody.data.variants[0].images[0].alt_text).toBe('Variant Image')
    })
})
