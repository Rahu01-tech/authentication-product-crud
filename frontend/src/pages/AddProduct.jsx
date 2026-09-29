import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import "./AddProduct.css";

function AddProduct() {
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await createProduct(formData, accessToken);

            console.log("Product created:", data);

            navigate("/products");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="add-product-page">

            <nav className="add-product-navbar">
                <div
                    className="add-product-brand"
                    onClick={() => navigate("/products")}
                >
                    <div className="add-brand-icon">S</div>

                    <div>
                        <strong>SkyShop</strong>
                        <span>PRODUCT MANAGEMENT</span>
                    </div>
                </div>

                <button
                    className="back-products-button"
                    onClick={() => navigate("/products")}
                >
                    ← Back to Products
                </button>
            </nav>

            <main className="add-product-main">

                <div className="add-product-heading">
                    <div>
                        <span className="add-heading-label">
                            INVENTORY
                        </span>

                        <h1>Add New Product</h1>

                        <p>
                            Add a new product to your inventory.
                        </p>
                    </div>
                </div>

                <div className="add-product-layout">

                    <div className="product-form-card">

                        <div className="form-card-header">
                            <div>
                                <h2>Product Information</h2>
                                <p>
                                    Enter the details of your new product.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="add-product-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g. Electronics"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="form-group">
                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your product..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-row">

                                <div className="form-group">
                                    <label>
                                        Price
                                    </label>

                                    <div className="input-with-symbol">
                                        <span>₹</span>

                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Stock
                                    </label>

                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>

                            </div>

                            <div className="form-group">
                                <label>
                                    Product Image URL
                                </label>

                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/product.jpg"
                                />

                                <small>
                                    Add a direct URL to your product image.
                                </small>
                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="cancel-product-button"
                                    onClick={() =>
                                        navigate("/products")
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="create-product-button"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create Product"}
                                </button>

                            </div>

                        </form>
                    </div>

                    <div className="product-preview-card">

                        <span className="preview-label">
                            PREVIEW
                        </span>

                        <div className="preview-image">
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Product preview"
                                />
                            ) : (
                                <div className="preview-placeholder">
                                    <span>＋</span>
                                    <p>Product Image</p>
                                </div>
                            )}
                        </div>

                        <div className="preview-content">

                            <span className="preview-category">
                                {formData.category || "CATEGORY"}
                            </span>

                            <h3>
                                {formData.name || "Product Name"}
                            </h3>

                            <p>
                                {formData.description ||
                                    "Your product description will appear here."}
                            </p>

                            <div className="preview-meta">

                                <div>
                                    <span>PRICE</span>

                                    <strong>
                                        ₹{formData.price || "0"}
                                    </strong>
                                </div>

                                <div>
                                    <span>STOCK</span>

                                    <strong>
                                        {formData.stock || "0"} units
                                    </strong>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}

export default AddProduct;