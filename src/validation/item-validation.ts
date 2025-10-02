import { z } from 'zod';

export class ItemValidation {
  static readonly CREATE = z.object({
    name: z.string().min(1, 'Name must not be blank').max(100, 'Name too long'),
    description: z.string().optional(),
    price: z.number().positive('Price must be a positive number'),
  });

  static readonly UPDATE = z.object({
    name: z.string().min(1, 'Name must not be blank').max(100, 'Name too long').optional(),
    description: z.string().optional(),
    price: z.number().positive('Price must be a positive number').optional(),
  });
}

export type CreateItemRequest = z.infer<typeof ItemValidation.CREATE>;
export type UpdateItemRequest = z.infer<typeof ItemValidation.UPDATE>;
