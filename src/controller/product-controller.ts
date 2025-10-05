import { Hono } from "hono";
import { CreateProductRequest, UpdateProductRequest } from "../model/product-model";
import { CreateImageRequest } from "../model/image-model";
import { ProductService } from "../service/product-service";
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
