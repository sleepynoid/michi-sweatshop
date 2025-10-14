import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { UserController } from './controller/user-controller'
import { ProductController } from './controller/product-controller'
import { VariantController } from './controller/variant-controller'
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

// Apply auth middleware to protected routes
app.use('/api/products', (c, next) => {
  if (c.req.method === 'POST') {
    return authMiddleware(c, next)
  }
  return next()
})  // POST requires auth, GET doesn't

app.use('/api/products/:uuid', (c, next) => {
  if (c.req.method !== 'GET') {
    return authMiddleware(c, next)
  }
  return next()
})  // PATCH, DELETE require auth, GET doesn't

app.use('/api/products/:uuid/images', (c, next) => {
  if (c.req.method === 'POST') {
    return authMiddleware(c, next)
  }
  return next()
})  // POST requires auth

app.use('/api/products/:uuid/images/upload', (c, next) => {
  if (c.req.method === 'POST') {
    return authMiddleware(c, next)
  }
  return next()
})  // POST requires auth

app.use('/api/variants', (c, next) => {
  if (c.req.method === 'POST') {
    return authMiddleware(c, next)
  }
  return next()
})  // POST requires auth

app.use('/api/variants/:uuid', (c, next) => {
  if (c.req.method !== 'GET') {
    return authMiddleware(c, next)
  }
  return next()
})  // PATCH, DELETE require auth, GET doesn't

// Serve uploaded images
app.use('/uploads/*', serveStatic({ root: './' }))

app.route('/', ProductController)
app.route('/', VariantController)

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
