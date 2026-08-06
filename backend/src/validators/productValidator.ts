import { body } from "express-validator";

export const productValidation = [

    body("name")
        .notEmpty()
        .withMessage("Product name is required"),

    body("slug")
        .notEmpty()
        .withMessage("Slug is required"),

    body("price")
        .isNumeric()
        .withMessage("Price must be a number"),

    body("stock")
        .isNumeric()
        .withMessage("Stock must be numeric"),

    body("category")
        .notEmpty()
        .withMessage("Category is required"),

];