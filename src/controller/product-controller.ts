import { Hono } from "hono";
import { CreateProductRequest, UpdateProductRequest } from "../model/product-model";
import { CreateImageRequest } from "../model/image-model";
import { ProductService } from "../service/product-service";
import { HTTPException } from "hono/http-exception";
// import { authMiddleware } from "../middleware/auth-middleware";

export const ProductController = new Hono()

ProductController.post('/api/products', async (c) => {
    const request = await c.req.json() as CreateProductRequest

    const response = await ProductService.create(request)

    return c.json({
        data: response
    })
})

ProductController.get('/api/products', async (c) => {
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '10')

    const response = await ProductService.getAll(page, limit)

    return c.json(response)
})

ProductController.get('/api/products/:uuid', async (c) => {
    const productId = c.req.param('uuid')

    const response = await ProductService.getById(productId)

    return c.json({
        data: response
    })
})

ProductController.get('/api/products/:uuid/detail', async (c) => {
    const productId = c.req.param('uuid')

    const response = await ProductService.getDetail(productId)

    return c.json({
        data: response
    })
})

ProductController.patch('/api/products/:uuid', async (c) => {
    const productId = c.req.param('uuid')
    const request = await c.req.json() as UpdateProductRequest

    const response = await ProductService.update(productId, request)

    return c.json({
        data: response
    })
})

ProductController.delete('/api/products/:uuid', async (c) => {
    const productId = c.req.param('uuid')

    const response = await ProductService.delete(productId)

    return c.json({
        data: response
    })
})

ProductController.post('/api/products/:uuid/images', async (c) => {
    const productId = c.req.param('uuid')
    const request = await c.req.json() as CreateImageRequest

    const response = await ProductService.uploadImage(productId, request)

    return c.json({
        data: response
    })
})

ProductController.post('/api/products/:uuid/images/upload', async (c) => {
    const productId = c.req.param('uuid')

    // Parse FormData
    const formData = await c.req.formData()
    const file = formData.get('image') as File
    const altText = formData.get('alt_text') as string
    const position = formData.get('position') as string

    if (!file) {
        throw new HTTPException(400, { message: 'No file uploaded' })
    }

    // Validasi file
    if (!file.type.startsWith('image/')) {
        throw new HTTPException(400, { message: 'File must be an image' })
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
        throw new HTTPException(400, { message: 'File too large (max 2MB)' })
    }

    // Convert ke buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload via service
    const response = await ProductService.uploadImageFile(productId, {
        buffer,
        filename: file.name,
        mimeType: file.type,
        altText,
        position: position ? parseInt(position) : undefined
    })

    return c.json({ data: response })
})
