import { body, param } from "express-validator";

export const createProductValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ min: 2 })
        .withMessage("Product name must be at least 2 characters long"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Product description is required"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a valid number greater than or equal to 0"),

    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    body("image")
        .optional()
        .trim()
        .isURL()
        .withMessage("Image must be a valid URL"),
];

export const updateProductValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid product ID"),

    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Product name must be at least 2 characters long"),

    body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Product description cannot be empty"),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a valid number greater than or equal to 0"),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),

    body("category")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Category cannot be empty"),

    body("image")
        .optional()
        .trim()
        .isURL()
        .withMessage("Image must be a valid URL"),
];

export const productIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid product ID"),
];