import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await registerUser(formData);

            navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="register-page">

            {/* ================= DECORATIONS ================= */}

            <div className="register-decoration register-decoration-one"></div>
            <div className="register-decoration register-decoration-two"></div>
            <div className="register-decoration register-decoration-three"></div>

            <section className="register-shell">

                {/* ================= LEFT VISUAL ================= */}

                <div className="register-visual">

                    <div className="register-visual-content">

                        {/* BRAND */}

                        <div className="register-brand">

                            <div className="register-logo-mark">
                                S
                            </div>

                            <div>
                                <h1>SkyShop</h1>
                                <span>
                                    PRODUCT MANAGEMENT
                                </span>
                            </div>

                        </div>

                        {/* TEXT */}

                        <div className="register-visual-text">

                            <span className="register-label">
                                BUILD YOUR STORE.
                            </span>

                            <h2>
                                Start managing
                                <br />
                                your products
                                <br />
                                <span>smarter.</span>
                            </h2>

                            <p>
                                Create your account and get
                                everything you need to organize
                                your products and inventory in
                                one beautiful workspace.
                            </p>

                        </div>

                        {/* ILLUSTRATION */}

                        <div className="register-illustration">

                            <div className="register-circle circle-one"></div>
                            <div className="register-circle circle-two"></div>
                            <div className="register-circle circle-three"></div>

                            <div className="register-dashboard">

                                <div className="dashboard-top">

                                    <span>
                                        SKYSHOP
                                    </span>

                                    <div className="dashboard-dots">
                                        <i></i>
                                        <i></i>
                                        <i></i>
                                    </div>

                                </div>

                                <div className="dashboard-content">

                                    <div className="dashboard-sidebar">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>

                                    <div className="dashboard-main">

                                        <div className="dashboard-title">
                                            <span></span>
                                            <span></span>
                                        </div>

                                        <div className="dashboard-cards">
                                            <div></div>
                                            <div></div>
                                            <div></div>
                                        </div>

                                        <div className="dashboard-chart">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* FLOATING ELEMENTS */}

                            <div className="register-floating floating-user">
                                <span>+</span>
                            </div>

                            <div className="register-floating floating-check">
                                <span>✓</span>
                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className="register-visual-footer">

                            <span>
                                © 2026 SkyShop
                            </span>

                            <span>
                                Secure • Simple • Powerful
                            </span>

                        </div>

                    </div>

                </div>

                {/* ================= RIGHT FORM ================= */}

                <div className="register-form-side">

                    <div className="register-form-wrapper">

                        {/* MOBILE BRAND */}

                        <div className="register-mobile-brand">

                            <div className="register-logo-mark">
                                S
                            </div>

                            <span>
                                SkyShop
                            </span>

                        </div>

                        {/* HEADING */}

                        <div className="register-heading">

                            <span className="register-welcome">
                                GET STARTED
                            </span>

                            <h2>
                                Register
                            </h2>

                            <p>
                                Create your account to start
                                managing your products.
                            </p>

                        </div>

                        {/* FORM */}

                        <form
                            className="register-form"
                            onSubmit={handleSubmit}
                        >

                            {/* NAME */}

                            <div className="register-field">

                                <label htmlFor="name">
                                    Full name
                                </label>

                                <div className="register-input-wrapper">

                                    <span className="register-field-icon">

                                        <svg
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <circle
                                                cx="12"
                                                cy="8"
                                                r="4"
                                            />

                                            <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                                        </svg>

                                    </span>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                        required
                                    />

                                </div>

                            </div>

                            {/* EMAIL */}

                            <div className="register-field">

                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div className="register-input-wrapper">

                                    <span className="register-field-icon">

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

                            {/* PASSWORD */}

                            <div className="register-field">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="register-input-wrapper">

                                    <span className="register-field-icon">

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
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        required
                                    />

                                </div>

                            </div>

                            {/* CONFIRM PASSWORD */}

                            <div className="register-field">

                                <label htmlFor="confirmPassword">
                                    Confirm password
                                </label>

                                <div className="register-input-wrapper">

                                    <span className="register-field-icon">

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
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        required
                                    />

                                </div>

                            </div>

                            {/* ERROR */}

                            {error && (
                                <div className="register-error">

                                    <span>!</span>

                                    <p>
                                        {error}
                                    </p>

                                </div>
                            )}

                            {/* BUTTON */}

                            <button
                                type="submit"
                                className="register-button"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="register-spinner"></span>

                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account

                                        <span>
                                            →
                                        </span>
                                    </>
                                )}

                            </button>

                        </form>

                        {/* LOGIN LINK */}

                        <div className="register-login">

                            <span>
                                Already have an account?
                            </span>

                            <Link to="/">
                                Login
                                <span>→</span>
                            </Link>

                        </div>

                        {/* SECURITY */}

                        <div className="register-security">

                            <span></span>

                            Your connection is secure

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Register;