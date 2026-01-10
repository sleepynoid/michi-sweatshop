import { Hono } from "hono";
import { CreateVariantRequest, UpdateVariantRequest } from "../model/variant-model";
import { VariantService } from "../service/variant-service";
import { HTTPException } from "hono/http-exception";

export const VariantController = new Hono()

VariantController.post('/api/variants', async (c) => {
    const request = await c.req.json() as CreateVariantRequest

    const response = await VariantService.create(request)

    return c.json({
        data: response
    })
})

VariantController.get('/api/variants/:uuid', async (c) => {
    const variantId = c.req.param('uuid')

    const response = await VariantService.getById(variantId)

    return c.json({
        data: response
    })
})

VariantController.patch('/api/variants/:uuid', async (c) => {
    const variantId = c.req.param('uuid')
    const request = await c.req.json() as UpdateVariantRequest

    const response = await VariantService.update(variantId, request)

    return c.json({
        data: response
    })
})

VariantController.post('/api/variants/:uuid/images/upload', async (c) => {
    const variantId = c.req.param('uuid')

    // Parse FormData
    const formData = await c.req.formData()
    const file = formData.get('image') as File
    const altText = formData.get('alt_text') as string
    const position = formData.get('position') as string

    if (!file) {
        throw new HTTPException(400, { message: 'No file uploaded' })
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
        throw new HTTPException(400, { message: 'File must be an image' })
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
        throw new HTTPException(400, { message: 'File too large (max 2MB)' })
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload via service
    const response = await VariantService.uploadImageFile(variantId, {
        buffer,
        filename: file.name,
        mimeType: file.type,
        altText,
        position: position ? parseInt(position) : undefined
    })

    return c.json({ data: response })
})

VariantController.patch('/api/variants/:uuid/images/reorder', async (c) => {
    const variantId = c.req.param('uuid')
    const body = await c.req.json() as { items: { imageId: string, position: number }[] }

    const response = await VariantService.reorderImages(variantId, body.items)

    return c.json({
        data: response
    })
})

VariantController.delete('/api/variants/:uuid/images/:imageId', async (c) => {
    const variantId = c.req.param('uuid')
    const imageId = c.req.param('imageId')

    const response = await VariantService.deleteImage(variantId, imageId)

    return c.json({
        data: response
    })
})
