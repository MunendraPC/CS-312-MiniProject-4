import { useState } from "react";

function Signup({ onSignup, goToSignin }) {
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const error = await onSignup(
            userId,
            password,
            name
        );

        setMessage(error);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <h1>Sign Up</h1>

                {message && (
                    <p className="error">
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Name</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />

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
                        Create Account
                    </button>

                </form>

                <p>Already have an account?</p>

                <button
                    className="secondary-button"
                    onClick={goToSignin}
                >
                    Sign In
                </button>

            </div>
        </div>
    );
}

export default Signup;