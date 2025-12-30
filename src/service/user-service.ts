import { exceptions } from "winston";
import { prismaClient } from "../Application/database";
import { LoginUserRequest, LoginUserResponse, RegisterUserRequest, toUserRespons, UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception"

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        request = UserValidation.REGISTER.parse(request)

        // Check email duplicate
        const duplicateEmail = await prismaClient.user.count({
            where: {
                email: request.email
            }
        })
        if (duplicateEmail != 0) {
            throw new HTTPException(400, {
                message: "email already exist"
            })
        }
        // hash pass pake bycrypt
        request.password = await Bun.password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 4
        })
        // save ke db
        const user = await prismaClient.user.create({
            data: request
        })

        // return
        return toUserRespons(user)
    }

    static async login(request: LoginUserRequest): Promise<LoginUserResponse> {
        request = UserValidation.LOGIN.parse(request)

        const isUserExist = await prismaClient.user.findUnique({
            where: {
                email: request.email
            }
        })

        if (!isUserExist) {
            throw new HTTPException(401, {
                message: "email or password wrong"
            })
        }

        const isPasswordValid = await Bun.password.verify(request.password, isUserExist.password)

        if (!isPasswordValid) {
            throw new HTTPException(401, {
                message: "email or password wrong"
            })
        }

        const token = crypto.randomUUID()

        // Update user with token
        await prismaClient.user.update({
            where: { uuid: isUserExist.uuid },
            data: { token }
        })

        return {
            ...toUserRespons(isUserExist),
            token
        }
    }

    static async get(token: string): Promise<UserResponse> {
        const user = await prismaClient.user.findFirst({
            where: { token }
        });

        if (!user) {
            throw new HTTPException(401, { message: "Unauthorized" });
        }

        return toUserRespons(user);
    }
}
