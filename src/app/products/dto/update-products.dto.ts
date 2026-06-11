import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long").optional(),
  description: z.string().max(1000, "Description is too long").optional(),
  price: z
    .number()
    .positive("Price must be a positive number")
    .optional(),
  stock: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative")
    .optional(),
  isActive: z.boolean().optional(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
