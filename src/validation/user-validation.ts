import { z } from 'zod';

export class UserValidation {
  static readonly REGISTER = z.object({
    email: z.string().email('Invalid email format').min(1, 'Email must not be blank').max(100, 'Email too long'),
    phone: z.string().min(1, 'Phone must not be blank').max(20, 'Phone too long'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
    name: z.string().min(1, 'Name must not be blank').max(100, 'Name too long'),
    role: z.string().optional().default('user'),
  });

  static readonly LOGIN = z.object({
    email: z.string().email('Invalid email format').min(1, 'Email must not be blank'),
    password: z.string().min(1, 'Password must not be blank'),
  });

  static readonly UPDATE = z.object({
    email: z.string().email('Invalid email format').min(1, 'Email must not be blank').max(100, 'Email too long').optional(),
    phone: z.string().min(1, 'Phone must not be blank').max(20, 'Phone too long').optional(),
    name: z.string().min(1, 'Name must not be blank').max(100, 'Name too long').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long').optional(),
    role: z.string().optional(),
  });

  static readonly TOKEN = z.object({
    authorization: z.string().regex(/^Bearer .+$/, 'Invalid authorization header format'),
  });
}

export type RegisterUserRequest = z.infer<typeof UserValidation.REGISTER>;
export type LoginUserRequest = z.infer<typeof UserValidation.LOGIN>;
export type UpdateUserRequest = z.infer<typeof UserValidation.UPDATE>;
export type TokenRequest = z.infer<typeof UserValidation.TOKEN>;
