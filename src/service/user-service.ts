import { exceptions } from "winston";
import { prismaClient } from "../Application/database";
import { LoginUserRequest, LoginUserResponse, RegisterUserRequest, toUserRespons, UserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { HTTPException } from "hono/http-exception"

export class UserService {
    static async register(request: RegisterUserRequest): Promise<UserResponse> {
        // validasi dengan zod
        request = UserValidation.REGISTER.parse(request)
        // check db apakah duplikat
        const duplicateUser = await prismaClient.user.count({
            where: {
                username: request.username
            }
        })
        if (duplicateUser != 0) {
            throw new HTTPException(400, {
                message: "username already exist"
            })
        }
        // hash pass pake bycrypt
        request.password = await Bun.password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10
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
                username: request.username
            }
        })

        if (!isUserExist) {
            throw new HTTPException(401, {
                message: "username or password wrong"
            })
        }

        const isPasswordValid = await Bun.password.verify(request.password, isUserExist.password)

        if (!isPasswordValid) {
            throw new HTTPException(401, {
                message: "username or password wrong"
            })
        }

        const token = crypto.randomUUID()

        return {
            ...toUserRespons(isUserExist),
            token
        }
    }
}
