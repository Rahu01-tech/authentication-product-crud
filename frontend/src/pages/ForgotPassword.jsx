import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import "./ForgotPassword.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const data = await forgotPassword(email);

            setMessage(data.message);
            setEmail("");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="forgot-page">
            <div className="forgot-background">
                <div className="forgot-glow forgot-glow-one"></div>
                <div className="forgot-glow forgot-glow-two"></div>
            </div>

            <div className="forgot-card">
                <div className="forgot-icon">
                    🔐
                </div>

                <div className="forgot-header">
                    <h1>Forgot Password?</h1>

                    <p>
                        No worries. Enter your registered email
                        and we'll help you reset your password.
                    </p>
                </div>

                <form
                    className="forgot-form"
                    onSubmit={handleSubmit}
                >
                    <div className="forgot-field">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="forgot-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}
                    </button>
                </form>

                {message && (
                    <div className="forgot-message success">
                        <span>✓</span>
                        <p>{message}</p>
                    </div>
                )}

                {error && (
                    <div className="forgot-message error">
                        <span>!</span>
                        <p>{error}</p>
                    </div>
                )}

                <div className="forgot-footer">
                    <span>Remember your password?</span>

                    <Link to="/">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;