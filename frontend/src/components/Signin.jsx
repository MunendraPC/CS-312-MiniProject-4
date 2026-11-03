import { useState } from "react";

function Signin({ onSignin, goToSignup }) {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const error = await onSignin(userId, password);

        setMessage(error);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h1>Sign In</h1>

                {message && (
                    <p className="error">
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <label>User ID</label>

                    <input
                        type="text"
                        value={userId}
                        onChange={(event) =>
                            setUserId(event.target.value)
                        }
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Sign In
                    </button>

                </form>

                <p>Don't have an account?</p>

                <button
                    className="secondary-button"
                    onClick={goToSignup}
                >
                    Sign Up
                </button>

            </div>
        </div>
    );
}

export default Signin;