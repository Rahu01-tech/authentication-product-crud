import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import "./EditProduct.css";

function EditProduct() {
    const { id } = useParams();
    const { accessToken, refreshToken } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await getProductById(id);
                const product = data.product;

                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    category: product.category,
                    image: product.image || "",
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

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
        setSaving(true);

        try {
            const data = await updateProduct(
                id,
                formData,
                accessToken,
                refreshToken
            );

            console.log("Product updated:", data);

            navigate("/products");
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="edit-product-loading">
                <div className="edit-loading-spinner"></div>
                <p>Loading product...</p>
            </div>
        );
    }

    if (error && !formData.name) {
        return (
            <div className="edit-product-error-page">
                <div className="edit-error-card">
                    <div className="edit-error-icon">!</div>

                    <h2>Unable to load product</h2>

                    <p>{error}</p>

                    <button
                        onClick={() => navigate("/products")}
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-product-page">

            <nav className="edit-product-navbar">

                <div
                    className="edit-product-brand"
                    onClick={() => navigate("/products")}
                >
                    <div className="edit-brand-icon">
                        S
                    </div>

                    <div>
                        <strong>SkyShop</strong>

                        <span>
                            PRODUCT MANAGEMENT
                        </span>
                    </div>
                </div>

                <button
                    className="edit-back-button"
                    onClick={() => navigate("/products")}
                >
                    ← Back to Products
                </button>

            </nav>

            <main className="edit-product-main">

                <div className="edit-product-heading">

                    <div>
                        <span className="edit-heading-label">
                            INVENTORY
                        </span>

                        <h1>Edit Product</h1>

                        <p>
                            Update the information of your existing product.
                        </p>
                    </div>

                    <div className="edit-product-id">
                        <span>PRODUCT ID</span>
                        <strong>#{id.slice(-6)}</strong>
                    </div>

                </div>

                <div className="edit-product-layout">

                    <div className="edit-form-card">

                        <div className="edit-form-header">

                            <div>
                                <h2>Product Information</h2>

                                <p>
                                    Modify the details below and save your changes.
                                </p>
                            </div>

                            <div className="edit-status">
                                <span></span>
                                EDITING
                            </div>

                        </div>

                        {error && (
                            <div className="edit-product-error">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            <div className="edit-form-row">

                                <div className="edit-form-group">
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

                                <div className="edit-form-group">
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

                            <div className="edit-form-group">

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

                            <div className="edit-form-row">

                                <div className="edit-form-group">
                                    <label>
                                        Price
                                    </label>

                                    <div className="edit-input-symbol">
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

                                <div className="edit-form-group">
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

                            <div className="edit-form-group">

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
                                    Update the direct URL of your product image.
                                </small>

                            </div>

                            <div className="edit-form-actions">

                                <button
                                    type="button"
                                    className="edit-cancel-button"
                                    onClick={() =>
                                        navigate("/products")
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="edit-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving Changes..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>

                    </div>

                    <div className="edit-preview-card">

                        <div className="edit-preview-top">

                            <span>
                                LIVE PREVIEW
                            </span>

                            <div className="preview-edit-dot">
                                <span></span>
                                LIVE
                            </div>

                        </div>

                        <div className="edit-preview-image">

                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt={formData.name}
                                />
                            ) : (
                                <div className="edit-preview-placeholder">
                                    <span>＋</span>
                                    <p>Product Image</p>
                                </div>
                            )}

                        </div>

                        <div className="edit-preview-content">

                            <div className="edit-preview-category-row">

                                <span className="edit-preview-category">
                                    {formData.category || "CATEGORY"}
                                </span>

                                <span className="edit-preview-id">
                                    #{id.slice(-6)}
                                </span>

                            </div>

                            <h3>
                                {formData.name || "Product Name"}
                            </h3>

                            <p>
                                {formData.description ||
                                    "Your product description will appear here."}
                            </p>

                            <div className="edit-preview-meta">

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

                            <div className="edit-preview-note">
                                Changes are reflected in the preview instantly.
                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default EditProduct;