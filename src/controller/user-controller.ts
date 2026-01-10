import { Hono } from "hono";
import { LoginUserRequest, RegisterUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";
import { authMiddleware } from "../middleware/auth-middleware";

export const UserController = new Hono()

UserController.post('/api/users', async (c) => {
    const request = await c.req.json() as RegisterUserRequest

    const response = await UserService.register(request)

    return c.json({
        data: response
    })
})

UserController.post('/api/users/login', async (c) => {

    const request = await c.req.json() as LoginUserRequest

    const response = await UserService.login(request)

    return c.json({
        data: response
    })
})

UserController.get('/api/users', authMiddleware, async (c) => {
    const response = await UserService.list()
    return c.json({
        data: response
    })
})