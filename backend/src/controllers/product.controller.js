import Product from "../models/product.model.js";

export async function createProduct(req, res) {
    try {
        const {
            name,
            description,
            price,
            stock,
            category,
            image,
        } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            image,
        });

        return res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Create product error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function getProducts(req, res) {
    try {
        const products = await Product.find();

        return res.status(200).json({
            message: "Products fetched successfully",
            products,
        });
    } catch (error) {
        console.error("Get products error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            product,
        });
    } catch (error) {
        console.error("Get product error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function updateProduct(req, res) {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            price,
            stock,
            category,
            image,
        } = req.body;

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                stock,
                category,
                image,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error("Update product error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

