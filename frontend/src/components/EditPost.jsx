import { useState } from "react";

function EditPost({
    post,
    onUpdate,
    onCancel
}) {
    const [title, setTitle] = useState(post.title);
    const [body, setBody] = useState(post.body);
    const [category, setCategory] = useState(
        post.category || "Other"
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        await onUpdate({
            title,
            body,
            category
        });
    };

    return (
        <div className="auth-page">

            <div className="edit-card">

                <h1>Edit Post</h1>

                <form onSubmit={handleSubmit}>

                    <label>Blog Title</label>

                    <input
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        required
                    />

                    <label>Category</label>

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                    >
                        <option value="Tech">Tech</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Education">Education</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Other">Other</option>
                    </select>

                    <label>Blog</label>

                    <textarea
                        rows="8"
                        value={body}
                        onChange={(event) =>
                            setBody(event.target.value)
                        }
                        required
                    />

                    <div className="post-buttons">

                        <button type="submit">
                            Save Changes
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditPost;