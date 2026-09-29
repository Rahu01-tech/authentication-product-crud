import { useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import "./ResetPassword.css";
import { resetPassword } from "../services/authService";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [message, setMessage] = useState("");
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

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const data = await resetPassword(
                token,
                formData
            );

            setMessage(data.message);

            setFormData({
                password: "",
                confirmPassword: "",
            });

            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="reset-page">
            <div className="reset-background">
                <div className="reset-glow reset-glow-one"></div>
                <div className="reset-glow reset-glow-two"></div>
            </div>

            <div className="reset-card">
                <div className="reset-icon">
                    🔑
                </div>

                <div className="reset-header">
                    <h1>Reset Password</h1>

                    <p>
                        Create a new password for your account.
                        Make sure it's strong and easy for you to
                        remember.
                    </p>
                </div>

                <form
                    className="reset-form"
                    onSubmit={handleSubmit}
                >
                    <div className="reset-field">
                        <label htmlFor="password">
                            New Password
                        </label>

                        <div className="reset-input-wrapper">
                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="reset-field">
                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <div className="reset-input-wrapper">
                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                {showConfirmPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="reset-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"}
                    </button>
                </form>

                {message && (
                    <div className="reset-message success">
                        <span>✓</span>
                        <p>{message}</p>
                    </div>
                )}

                {error && (
                    <div className="reset-message error">
                        <span>!</span>
                        <p>{error}</p>
                    </div>
                )}

                <div className="reset-footer">
                    <span>Remember your password?</span>

                    <Link to="/">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;