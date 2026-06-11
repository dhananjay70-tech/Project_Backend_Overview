import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be a positive number"),
  stock: z
    .number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative")
    .default(0),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
