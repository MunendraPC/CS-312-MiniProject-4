import { useState } from "react";

function BlogPostForm({ user, onCreate }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [category, setCategory] = useState("Tech");

    const handleSubmit = async (event) => {
        event.preventDefault();

        await onCreate({
            title,
            body,
            category
        });

        setTitle("");
        setBody("");
        setCategory("Tech");
    };

    return (
        <section className="form-card">

            <h2>Create a Post</h2>

            <p>
                Posting as <strong>{user.name}</strong>
            </p>

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
                    rows="6"
                    value={body}
                    onChange={(event) =>
                        setBody(event.target.value)
                    }
                    required
                />

                <button type="submit">
                    Create Post
                </button>

            </form>

        </section>
    );
}

export default BlogPostForm;