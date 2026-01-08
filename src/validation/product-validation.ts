import { z } from 'zod';

export class ProductValidation {
  static readonly CREATE = z.object({
    title: z.string().min(1, 'Title must not be blank').max(255, 'Title too long'),
    description: z.string().min(1, 'Description must not be blank'),
    product_type: z.string().min(1, 'Product type must not be blank'),
    vendor: z.string().min(1, 'Vendor must not be blank'),
    tags: z.array(z.string()),
    status: z.string().min(1, 'Status must not be blank'),
    variants: z.array(z.object({
      title: z.string().min(1, 'Variant title must not be blank'),
      price: z.number().int().positive('Price must be a positive number'),
      sku: z.string().min(1, 'SKU must not be blank'),
      inventory_policy: z.string().min(1, 'Inventory policy must not be blank'),
      option1: z.string().min(1, 'Option1 must not be blank'),
      available: z.number().int().min(0, 'Available must be non-negative'),
      cost: z.number().int().min(0, 'Cost must be non-negative')
    })).min(1, 'At least one variant is required')
  });

  static readonly UPDATE = z.object({
    title: z.string().min(1, 'Title must not be blank').max(255, 'Title too long').optional(),
    description: z.string().min(1, 'Description must not be blank').optional(),
    product_type: z.string().min(1, 'Product type must not be blank').optional(),
    vendor: z.string().min(1, 'Vendor must not be blank').optional(),
    tags: z.array(z.string()).optional(),
    status: z.string().min(1, 'Status must not be blank').optional(),
    variants: z.array(z.object({
      uuid: z.string().min(1, 'Variant UUID must not be blank'),
      title: z.string().min(1, 'Variant title must not be blank').optional(),
      price: z.number().int().positive('Price must be a positive number').optional(),
      sku: z.string().min(1, 'SKU must not be blank').optional(),
      inventory_policy: z.string().min(1, 'Inventory policy must not be blank').optional(),
      option1: z.string().min(1, 'Option1 must not be blank').optional(),
      available: z.number().int().min(0, 'Available must be non-negative').optional(),
      cost: z.number().int().min(0, 'Cost must be non-negative').optional()
    })).optional()
  });
}

export type CreateProductRequest = z.infer<typeof ProductValidation.CREATE>;
export type UpdateProductRequest = z.infer<typeof ProductValidation.UPDATE>;
