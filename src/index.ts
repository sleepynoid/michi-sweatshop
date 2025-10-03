import { Hono } from 'hono'
import { UserController } from './controller/user-controller'
import { ItemController } from './controller/item-controller'
import { authMiddleware } from './middleware/auth-middleware'
import { Scalar } from '@scalar/hono-api-reference'
import { openApiSpec } from './openapi'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'
import { logger } from 'hono/logger'

const app = new Hono()

app.use(logger())
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/openapi.json', (c) => {
  return c.json(openApiSpec)
})

app.get('/docs', Scalar({
  spec: {
    url: '/openapi.json'
  }
}))

app.route('/', UserController)

// Apply auth to item routes, but make all GET requests exceptions
app.use('/api/items', (c, next) => {
  if (c.req.method !== 'GET') {
    return authMiddleware(c, next)
  }
  return next()
})  // POST /api/items requires auth, GET doesn't
app.use('/api/items/:id', (c, next) => {
  if (c.req.method !== 'GET') {
    return authMiddleware(c, next)
  }
  return next()
})  // PATCH, DELETE /api/items/:id require auth, GET doesn't
// GET /api/items/:id/detail doesn't require auth (no middleware applied)

app.route('/', ItemController)

app.onError(async (err, c) => {
  if (err instanceof HTTPException) {
    c.status(err.status)
    return c.json({
      errors: err.message
    })
  } else if (err instanceof ZodError) {
    c.status(400)
    return c.json({
      errors: err.issues.map(issue => ({
        field: issue.path[0] as string,
        message: issue.message
      }))
    })
  } else {
    c.status(500)
    return c.json({
      errors: err.message
    })
  }
})

export default app
