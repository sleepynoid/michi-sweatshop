import { MiddlewareHandler } from "hono";
import { UserService } from "../service/user-service";
import { User } from "../model/user-model";
import { HTTPException } from "hono/http-exception";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HTTPException(401, { message: 'Unauthorized' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    const user = await UserService.get(token);

    c.set('user', user);
    await next();
};
