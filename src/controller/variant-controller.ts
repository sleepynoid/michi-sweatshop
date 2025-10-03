import { Hono } from "hono";
import { UpdateVariantRequest } from "../model/variant-model";
import { VariantService } from "../service/variant-service";

export const VariantController = new Hono()

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
