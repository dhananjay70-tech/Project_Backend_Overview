import { Request, Response } from "express";
import { asyncHandler, ApiSuccessResponse } from "../../utils";
import { HTTP_STATUS } from "../../constants";
import { logger } from "../../logger";
import * as productsService from "./products.service";
import type { CreateProductDto } from "./dto/create-products.dto";
import type { UpdateProductDto } from "./dto/update-products.dto";

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    logger.info("ProductsController.getAllProducts: entry");

    const products = await productsService.findAllProducts();

    logger.info("ProductsController.getAllProducts: exit", {
      count: products.length,
    });
    new ApiSuccessResponse("Products fetched successfully", products).send(
      res,
      HTTP_STATUS.OK
    );
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    logger.info("ProductsController.getProductById: entry", { id });

    const product = await productsService.findProductById(id);

    logger.info("ProductsController.getProductById: exit", { id });
    new ApiSuccessResponse("Product fetched successfully", product).send(
      res,
      HTTP_STATUS.OK
    );
  }
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body as CreateProductDto;
    logger.info("ProductsController.createProduct: entry", { body });

    const product = await productsService.createProduct({
      ...body,
      price: String(body.price),
    });

    logger.info("ProductsController.createProduct: exit", { id: product.id });
    new ApiSuccessResponse("Product created successfully", product).send(
      res,
      HTTP_STATUS.CREATED
    );
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const body = req.body as UpdateProductDto;
    logger.info("ProductsController.updateProduct: entry", { id, body });

    const updated = await productsService.updateProduct(id, body);

    logger.info("ProductsController.updateProduct: exit", { id });
    new ApiSuccessResponse("Product updated successfully", updated).send(
      res,
      HTTP_STATUS.OK
    );
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    logger.info("ProductsController.deleteProduct: entry", { id });

    await productsService.deleteProduct(id);

    logger.info("ProductsController.deleteProduct: exit", { id });
    new ApiSuccessResponse("Product deleted successfully", null).send(
      res,
      HTTP_STATUS.OK
    );
  }
);
