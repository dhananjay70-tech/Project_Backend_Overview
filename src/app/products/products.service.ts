import { eq } from "drizzle-orm";
import { getDb } from "../../config/database.config";
import { products, type Product, type NewProduct } from "./products.schema";
import { logger } from "../../logger";
import { NotFoundError } from "../../utils";
import type { UpdateProductDto } from "./dto/update-products.dto";

export const findAllProducts = async (): Promise<Product[]> => {
  logger.debug("ProductsService.findAllProducts: entry");

  const db = getDb();
  const result = await db.select().from(products);

  logger.debug("ProductsService.findAllProducts: exit", {
    count: result.length,
  });
  return result;
};

export const findProductById = async (id: string): Promise<Product> => {
  logger.debug("ProductsService.findProductById: entry", { id });

  const db = getDb();
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!product) {
    logger.warn("ProductsService.findProductById: product not found", { id });
    throw new NotFoundError(`Product with id '${id}' not found`);
  }

  logger.debug("ProductsService.findProductById: exit", { id });
  return product;
};

export const createProduct = async (data: NewProduct): Promise<Product> => {
  logger.debug("ProductsService.createProduct: entry", { data });

  const db = getDb();
  const [created] = await db.insert(products).values(data).returning();

  logger.debug("ProductsService.createProduct: exit", { id: created.id });
  return created;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductDto
): Promise<Product> => {
  logger.debug("ProductsService.updateProduct: entry", { id, data });

  // Ensure product exists
  await findProductById(id);

  const db = getDb();

  // Build a properly-typed Drizzle update payload.
  // Drizzle's `numeric` column expects `string` not `number`.
  const updatePayload: Partial<{
    name: string;
    description: string | null;
    price: string;
    stock: number;
    isActive: boolean;
    updatedAt: Date;
  }> = { updatedAt: new Date() };

  if (data.name !== undefined) updatePayload.name = data.name;
  if (data.description !== undefined) updatePayload.description = data.description ?? null;
  if (data.price !== undefined) updatePayload.price = String(data.price);
  if (data.stock !== undefined) updatePayload.stock = data.stock;
  if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

  const [updated] = await db
    .update(products)
    .set(updatePayload)
    .where(eq(products.id, id))
    .returning();

  logger.debug("ProductsService.updateProduct: exit", { id });
  return updated;
};

export const deleteProduct = async (id: string): Promise<void> => {
  logger.debug("ProductsService.deleteProduct: entry", { id });

  // Ensure product exists before deleting
  await findProductById(id);

  const db = getDb();
  await db.delete(products).where(eq(products.id, id));

  logger.debug("ProductsService.deleteProduct: exit", { id });
};
