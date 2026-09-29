import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProducts, deleteProduct } from "../services/productService";
import { useAuth } from "../context/AuthContext";

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
                products.map((product) => product.category)
            ),
        ];

        return ["All", ...uniqueCategories];
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText) ||
                product.category
                    .toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                category === "All" ||
                product.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, category]);

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

    async function handleLogout() {
        await logout();
        navigate("/");
    }

    function getStockStatus(stock) {
        if (stock === 0) {
            return {
                label: "Out of stock",
                className: "stock-danger",
            };
        }

        if (stock <= 10) {
            return {
                label: "Low stock",
                className: "stock-warning",
            };
        }

        return {
            label: "In stock",
            className: "stock-success",
        };
    }

    return (
        <div className="shop-dashboard">

            {/* ================= NAVBAR ================= */}

            <nav className="shop-navbar">

                <div className="navbar-left">

                    <div
                        className="shop-logo"
                        onClick={() => navigate("/products")}
                    >
                        <span>S</span>

                        <div>
                            <strong>SkyShop</strong>
                            <small>PRODUCT MANAGEMENT</small>
                        </div>
                    </div>

                    <div className="navbar-links">

                        <button
                            className="navbar-link active"
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Products
                        </button>

                        <button
                            className="navbar-link"
                            onClick={() =>
                                navigate("/products/new")
                            }
                        >
                            Add Product
                        </button>

                    </div>

                </div>

                <div className="navbar-right">

                    <div className="navbar-user">

                        <div className="navbar-avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </div>

                        <div className="navbar-user-info">
                            <strong>
                                {user?.name || "User"}
                            </strong>

                            <span>
                                {user?.email || "Account"}
                            </span>
                        </div>

                    </div>

                    <div className="navbar-divider"></div>

                    <button
                        className="navbar-logout"
                        onClick={handleLogout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </nav>

            {/* ================= MAIN ================= */}

            <main className="shop-main">

                {/* HERO */}

                <section className="dashboard-intro">

                    <div>
                        <p className="intro-label">
                            INVENTORY OVERVIEW
                        </p>

                        <h1>
                            Manage your products.
                        </h1>

                        <p className="intro-text">
                            Keep your catalog organized,
                            monitor inventory and manage
                            every product from one place.
                        </p>
                    </div>

                    <button
                        className="primary-add-button"
                        onClick={() =>
                            navigate("/products/new")
                        }
                    >
                        <span>＋</span>
                        Add New Product
                    </button>

                </section>

                {/* ================= STATS ================= */}

                <section className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-top">
                            <span>Total Products</span>

                            <div className="stat-symbol">
                                ▦
                            </div>
                        </div>

                        <strong>
                            {products.length}
                        </strong>

                        <small>
                            Products in catalog
                        </small>

                    </div>

                    <div className="stat-card">

                        <div className="stat-top">
                            <span>Categories</span>

                            <div className="stat-symbol purple">
                                ◈
                            </div>
                        </div>

                        <strong>
                            {Math.max(
                                categories.length - 1,
                                0
                            )}
                        </strong>

                        <small>
                            Active categories
                        </small>

                    </div>

                    <div className="stat-card">

                        <div className="stat-top">
                            <span>Total Stock</span>

                            <div className="stat-symbol orange">
                                ↗
                            </div>
                        </div>

                        <strong>
                            {totalStock}
                        </strong>

                        <small>
                            Units available
                        </small>

                    </div>

                    <div className="stat-card">

                        <div className="stat-top">
                            <span>Inventory Value</span>

                            <div className="stat-symbol pink">
                                ₹
                            </div>
                        </div>

                        <strong>
                            ₹
                            {inventoryValue.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                        <small>
                            Current stock value
                        </small>

                    </div>

                </section>

                {/* ================= PRODUCT PANEL ================= */}

                <section className="inventory-panel">

                    <div className="inventory-header">

                        <div>
                            <h2>
                                Product inventory
                            </h2>

                            <p>
                                {filteredProducts.length}{" "}
                                products displayed
                            </p>
                        </div>

                        <div className="inventory-controls">

                            <div className="product-search">

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

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="dashboard-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}

                    {/* LOADING */}

                    {loading && (
                        <div className="dashboard-state">

                            <div className="loading-spinner"></div>

                            <h3>
                                Loading products
                            </h3>

                            <p>
                                Fetching your inventory...
                            </p>

                        </div>
                    )}

                    {/* EMPTY */}

                    {!loading &&
                        products.length === 0 && (
                            <div className="dashboard-state">

                                <div className="empty-icon">
                                    ▦
                                </div>

                                <h3>
                                    Your catalog is empty
                                </h3>

                                <p>
                                    Add your first product
                                    to start building your
                                    inventory.
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

                    {/* NO SEARCH RESULTS */}

                    {!loading &&
                        products.length > 0 &&
                        filteredProducts.length === 0 && (
                            <div className="dashboard-state">

                                <div className="empty-icon">
                                    ⌕
                                </div>

                                <h3>
                                    No products found
                                </h3>

                                <p>
                                    Try another search term
                                    or category.
                                </p>

                            </div>
                        )}

                    {/* TABLE */}

                    {!loading &&
                        filteredProducts.length > 0 && (
                            <div className="table-wrapper">

                                <table className="product-table">

                                    <thead>
                                        <tr>
                                            <th>
                                                PRODUCT
                                            </th>

                                            <th>
                                                CATEGORY
                                            </th>

                                            <th>
                                                PRICE
                                            </th>

                                            <th>
                                                STOCK
                                            </th>

                                            <th>
                                                STATUS
                                            </th>

                                            <th>
                                                ACTIONS
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {filteredProducts.map(
                                            (product) => {

                                                const stockStatus =
                                                    getStockStatus(
                                                        Number(
                                                            product.stock
                                                        )
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            product._id
                                                        }
                                                    >

                                                        <td>

                                                            <div className="product-info">

                                                                <div className="product-thumbnail">

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
                                                                        <span>
                                                                            {product.name
                                                                                ?.charAt(
                                                                                    0
                                                                                )
                                                                                ?.toUpperCase()}
                                                                        </span>
                                                                    )}

                                                                </div>

                                                                <div>
                                                                    <strong>
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </strong>

                                                                    <small>
                                                                        ID:{" "}
                                                                        {product._id.slice(
                                                                            -8
                                                                        )}
                                                                    </small>
                                                                </div>

                                                            </div>

                                                        </td>

                                                        <td>
                                                            <span className="category-tag">
                                                                {
                                                                    product.category
                                                                }
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <strong className="product-price">
                                                                ₹
                                                                {Number(
                                                                    product.price
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            <span className="stock-number">
                                                                {
                                                                    product.stock
                                                                }
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <span
                                                                className={`stock-status ${stockStatus.className}`}
                                                            >
                                                                <i></i>
                                                                {
                                                                    stockStatus.label
                                                                }
                                                            </span>
                                                        </td>

                                                        <td>

                                                            <div className="table-actions">

                                                                <button
                                                                    className="edit-btn"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/products/edit/${product._id}`
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    className="delete-btn"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            product._id
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                </section>

                {/* FOOTER */}

                <footer className="shop-footer">

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