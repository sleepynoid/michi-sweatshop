import { Hono } from "hono";
import { CreateItemRequest, UpdateItemRequest } from "../model/item-model";
import { ItemService } from "../service/item-service";

export const ItemController = new Hono()

ItemController.post('/api/items', async (c) => {
    const request = await c.req.json() as CreateItemRequest

    const response = await ItemService.create(request)

    return c.json({
        data: response
    })
})

ItemController.get('/api/items', async (c) => {
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '10')

    const response = await ItemService.getAll(page, limit)

    return c.json(response)
})

ItemController.get('/api/items/:id', async (c) => {
    const itemId = c.req.param('id')

    const response = await ItemService.getById(itemId)

    return c.json({
        data: response
    })
})

ItemController.get('/api/items/:id/detail', async (c) => {
    const itemId = c.req.param('id')

    const response = await ItemService.getDetail(itemId)

    return c.json({
        data: response
    })
})

ItemController.patch('/api/items/:id', async (c) => {
    const itemId = c.req.param('id')
    const request = await c.req.json() as UpdateItemRequest

    const response = await ItemService.update(itemId, request)

    return c.json({
        data: response
    })
})

ItemController.delete('/api/items/:id', async (c) => {
    const itemId = c.req.param('id')

    const response = await ItemService.delete(itemId)

    return c.json({
        data: response
    })
})
