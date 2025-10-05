import { Hono } from "hono";
import { CreateVariantRequest, UpdateVariantRequest } from "../model/variant-model";
import { VariantService } from "../service/variant-service";

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
