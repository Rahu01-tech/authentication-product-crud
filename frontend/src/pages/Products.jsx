import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProducts, deleteProduct } from "../services/productService";
import { useAuth } from "../context/AuthContext";

import "./Products.css";

function Products() {
    const navigate = useNavigate();

    const {
        user,
        accessToken,
        refreshToken,
        logout,
    } = useAuth();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");



    useEffect(() => {
        async function fetchProducts() {
            try {
                setError("");

                const data = await getProducts();

                setProducts(data.products || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);


    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(
                products.map(
                    (product) => product.category
                )
            ),
        ];

        return ["All", ...uniqueCategories];
    }, [products]);


    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchValue) ||
                product.category
                    .toLowerCase()
                    .includes(searchValue);

            const matchesCategory =
                category === "All" ||
                product.category === category;

            return (
                matchesSearch &&
                matchesCategory
            );
        });
    }, [products, search, category]);

    /* =========================
       STATISTICS
    ========================= */

    const totalStock = products.reduce(
        (total, product) =>
            total + Number(product.stock),
        0
    );

    const inventoryValue = products.reduce(
        (total, product) =>
            total +
            Number(product.price) *
                Number(product.stock),
        0
    );

    /* =========================
       DELETE PRODUCT
    ========================= */

    async function handleDelete(productId) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            setError("");

            await deleteProduct(
                productId,
                accessToken,
                refreshToken
            );

            setProducts((previousProducts) =>
                previousProducts.filter(
                    (product) =>
                        product._id !== productId
                )
            );
        } catch (error) {
            setError(error.message);
        }
    }

    /* =========================
       LOGOUT
    ========================= */

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    /* =========================
       STOCK STATUS
    ========================= */

    function getStockStatus(stock) {
        if (stock === 0) {
            return {
                label: "Out of stock",
                className: "out-stock",
            };
        }

        if (stock <= 10) {
            return {
                label: "Low stock",
                className: "low-stock",
            };
        }

        return {
            label: "In stock",
            className: "in-stock",
        };
    }

    return (
        <div className="products-page">

            {/* =================================
                NAVBAR
            ================================= */}

            <nav className="products-navbar">

                <div
                    className="products-brand"
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    <div className="brand-icon">
                        S
                    </div>

                    <div className="brand-text">
                        <strong>SkyShop</strong>

                        <span>
                            PRODUCT MANAGEMENT
                        </span>
                    </div>
                </div>

                <div className="products-nav-links">

                    <button
                        className="nav-item active"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Products
                    </button>

                    <button
                        className="nav-item"
                        onClick={() =>
                            navigate("/products/new")
                        }
                    >
                        Add Product
                    </button>

                </div>

                <div className="products-nav-right">

                    <div className="user-profile">

                        <div className="user-avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </div>

                        <div className="user-details">
                            <strong>
                                {user?.name || "User"}
                            </strong>

                            <span>
                                {user?.email || ""}
                            </span>
                        </div>

                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* =================================
                MAIN CONTENT
            ================================= */}

            <main className="products-main">

                {/* HEADER */}

                <section className="products-heading">

                    <div>

                        <span className="heading-label">
                            INVENTORY
                        </span>

                        <h1>
                            Your Products
                        </h1>

                        <p>
                            Manage your products,
                            inventory and catalog
                            from one place.
                        </p>

                    </div>

                    <button
                        className="add-product-button"
                        onClick={() =>
                            navigate(
                                "/products/new"
                            )
                        }
                    >
                        <span>+</span>
                        Add Product
                    </button>

                </section>

                {/* =================================
                    STATISTICS
                ================================= */}

                <section className="stats-container">

                    <div className="stat-box">

                        <div className="stat-icon green">
                            ▦
                        </div>

                        <div>
                            <span>
                                Total Products
                            </span>

                            <strong>
                                {products.length}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-box">

                        <div className="stat-icon purple">
                            ◈
                        </div>

                        <div>
                            <span>
                                Categories
                            </span>

                            <strong>
                                {Math.max(
                                    categories.length - 1,
                                    0
                                )}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-box">

                        <div className="stat-icon orange">
                            ↗
                        </div>

                        <div>
                            <span>
                                Total Stock
                            </span>

                            <strong>
                                {totalStock}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-box">

                        <div className="stat-icon pink">
                            ₹
                        </div>

                        <div>
                            <span>
                                Inventory Value
                            </span>

                            <strong>
                                ₹
                                {inventoryValue.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>
                        </div>

                    </div>

                </section>

                {/* =================================
                    TOOLBAR
                ================================= */}

                <section className="products-toolbar">

                    <div>
                        <h2>
                            Product Inventory
                        </h2>

                        <p>
                            {filteredProducts.length}{" "}
                            products found
                        </p>
                    </div>

                    <div className="product-filters">

                        <div className="search-box">

                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                        >
                            {categories.map(
                                (item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                </section>

                {/* ERROR */}

                {error && (
                    <div className="products-error">
                        {error}
                    </div>
                )}

                {/* =================================
                    LOADING
                ================================= */}

                {loading && (
                    <div className="products-message">

                        <div className="spinner"></div>

                        <h3>
                            Loading products...
                        </h3>

                    </div>
                )}

                {/* =================================
                    EMPTY
                ================================= */}

                {!loading &&
                    products.length === 0 && (
                        <div className="products-message">

                            <div className="empty-product-icon">
                                ▦
                            </div>

                            <h3>
                                No products yet
                            </h3>

                            <p>
                                Start building your
                                inventory by adding
                                your first product.
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/products/new"
                                    )
                                }
                            >
                                Add Product
                            </button>

                        </div>
                    )}

                {/* =================================
                    NO SEARCH RESULTS
                ================================= */}

                {!loading &&
                    products.length > 0 &&
                    filteredProducts.length === 0 && (
                        <div className="products-message">

                            <div className="empty-product-icon">
                                ⌕
                            </div>

                            <h3>
                                No products found
                            </h3>

                            <p>
                                Try changing your
                                search or category.
                            </p>

                        </div>
                    )}

                {/* =================================
                    PRODUCT CARDS
                ================================= */}

                {!loading &&
                    filteredProducts.length > 0 && (

                        <section className="products-grid">

                            {filteredProducts.map(
                                (product) => {

                                    const stockStatus =
                                        getStockStatus(
                                            Number(
                                                product.stock
                                            )
                                        );

                                    return (
                                        <article
                                            className="product-card"
                                            key={
                                                product._id
                                            }
                                        >

                                            {/* IMAGE */}

                                            <div className="product-image">

                                                {product.image ? (
                                                    <img
                                                        src={
                                                            product.image
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                    />
                                                ) : (
                                                    <div className="image-placeholder">
                                                        {product.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>
                                                )}

                                                <span
                                                    className={`product-status ${stockStatus.className}`}
                                                >
                                                    <i></i>
                                                    {
                                                        stockStatus.label
                                                    }
                                                </span>

                                            </div>

                                            {/* CARD CONTENT */}

                                            <div className="product-card-content">

                                                <div className="product-card-top">

                                                    <span className="product-category">
                                                        {
                                                            product.category
                                                        }
                                                    </span>

                                                    <span className="product-id">
                                                        #
                                                        {product._id.slice(
                                                            -6
                                                        )}
                                                    </span>

                                                </div>

                                                <h3>
                                                    {
                                                        product.name
                                                    }
                                                </h3>

                                                <p className="product-description">
                                                    {
                                                        product.description
                                                    }
                                                </p>

                                                {/* PRICE / STOCK */}

                                                <div className="product-meta">

                                                    <div>
                                                        <span>
                                                            PRICE
                                                        </span>

                                                        <strong>
                                                            ₹
                                                            {Number(
                                                                product.price
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>
                                                            STOCK
                                                        </span>

                                                        <strong>
                                                            {
                                                                product.stock
                                                            }{" "}
                                                            units
                                                        </strong>
                                                    </div>

                                                </div>

                                                {/* ACTIONS */}

                                                <div className="product-actions">

                                                    <button
                                                        className="edit-product"
                                                        onClick={() =>
                                                            navigate(
                                                                `/products/edit/${product._id}`
                                                            )
                                                        }
                                                    >
                                                        Edit Product
                                                    </button>

                                                    <button
                                                        className="delete-product"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </section>
                    )}

                {/* FOOTER */}

                <footer className="products-footer">

                    <span>
                        © 2026 SkyShop
                    </span>

                    <span>
                        Secure • Simple • Powerful
                    </span>

                </footer>

            </main>

        </div>
    );
}

export default Products;