import express from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/product.controller.js";

import {
    createProductValidator,
    updateProductValidator,
    productIdValidator,
} from "../validators/product.validator.js";

import { validate } from "../middleware/validation.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post(
    "/",
    authenticate,
    createProductValidator,
    validate,
    createProduct
);


router.get(
    "/",
    getProducts
);

router.get(
    "/:id",
    productIdValidator,
    validate,
    getProductById
);


router.put(
    "/:id",
    authenticate,
    updateProductValidator,
    validate,
    updateProduct
);


router.delete(
    "/:id",
    authenticate,
    productIdValidator,
    validate,
    deleteProduct
);

export default router;