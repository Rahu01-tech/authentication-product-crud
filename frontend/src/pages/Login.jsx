import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
            const data = await loginUser(formData);

            login(data.user, data.accessToken);

            navigate("/products");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <div className="login-decoration decoration-one"></div>
            <div className="login-decoration decoration-two"></div>
            <div className="login-decoration decoration-three"></div>
            <div className="login-decoration decoration-four"></div>

            <section className="login-shell">
                <div className="login-visual">
                    <div className="visual-content">
                        <div className="skyshop-logo">
                            <div className="skyshop-logo-mark">S</div>

                            <div>
                                <h1>SkyShop</h1>
                                <span>PRODUCT MANAGEMENT</span>
                            </div>
                        </div>

                        <div className="visual-text">
                            <span className="visual-label">
                                YOUR STORE. YOUR CONTROL.
                            </span>

                            <h2>
                                Manage your
                                <br />
                                products
                                <br />
                                <span>beautifully.</span>
                            </h2>

                            <p>
                                Keep your products organized, track your
                                inventory and manage your store from one
                                beautiful workspace.
                            </p>
                        </div>

                        <div className="store-illustration">
                            <div className="illustration-circle circle-large"></div>
                            <div className="illustration-circle circle-medium"></div>
                            <div className="illustration-circle circle-small"></div>

                            <div className="shop-building">
                                <div className="shop-roof"></div>

                                <div className="shop-front">
                                    <div className="shop-sign">
                                        SKYSHOP
                                    </div>

                                    <div className="shop-window">
                                        <div className="product-box product-box-one"></div>
                                        <div className="product-box product-box-two"></div>
                                        <div className="product-box product-box-three"></div>
                                    </div>

                                    <div className="shop-door"></div>
                                </div>
                            </div>

                            <div className="floating-box box-one">
                                <span>+</span>
                            </div>

                            <div className="floating-box box-two">
                                <span>✓</span>
                            </div>

                            <div className="floating-chart">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>

                        <div className="visual-footer">
                            <span>© 2026 SkyShop</span>
                            <span>Secure • Simple • Powerful</span>
                        </div>
                    </div>
                </div>

                <div className="login-form-side">
                    <div className="login-form-wrapper">
                        <div className="mobile-brand">
                            <div className="skyshop-logo-mark">S</div>
                            <span>SkyShop</span>
                        </div>

                        <div className="login-heading">
                            <span className="welcome-label">
                                WELCOME BACK
                            </span>

                            <h2>Login</h2>

                            <p>
                                Sign in to continue managing your products.
                            </p>
                        </div>

                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="login-field">
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div className="login-input-wrapper">
                                    <span className="field-icon">
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M4 6h16v12H4z" />
                                            <path d="m4 7 8 6 8-6" />
                                        </svg>
                                    </span>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="login-field">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">
                                    <span className="field-icon">
                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <rect
                                                x="5"
                                                y="10"
                                                width="14"
                                                height="10"
                                                rx="2"
                                            />
                                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                        </svg>
                                    </span>

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>

                                <div className="login-forgot-password">
                                    <Link to="/forgot-password">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {error && (
                                <div className="login-error">
                                    <span className="error-icon">!</span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="login-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Login
                                        <span className="login-arrow">
                                            →
                                        </span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="login-register">
                            <span>Don't have an account?</span>

                            <Link to="/register">
                                Register Now
                                <span>→</span>
                            </Link>
                        </div>

                        <div className="login-security">
                            <span className="security-dot"></span>
                            Your connection is secure
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login;