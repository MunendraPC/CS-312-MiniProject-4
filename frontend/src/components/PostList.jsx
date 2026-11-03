function PostList({
    posts,
    user,
    onEdit,
    onDelete
}) {
    return (
        <section>

            <h2>All Posts</h2>

            {posts.length === 0 && (
                <div className="post-card">
                    <p>No posts found.</p>
                </div>
            )}

            {posts.map((post) => (

                <article
                    className="post-card"
                    key={post.blog_id}
                >

                    <h3>
                        {post.title}
                    </h3>

                    <p>
                        <strong>By:</strong>{" "}
                        {post.creator_name}
                    </p>

                    <p>
                        <strong>Category:</strong>{" "}
                        {post.category}
                    </p>

                    <p>
                        <strong>Created:</strong>{" "}
                        {new Date(
                            post.date_created
                        ).toLocaleString()}
                    </p>

                    <p className="post-body">
                        {post.body}
                    </p>

                    {post.creator_user_id === user.user_id && (

                        <div className="post-buttons">

                            <button
                                onClick={() =>
                                    onEdit(post)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="delete-button"
                                onClick={() =>
                                    onDelete(post.blog_id)
                                }
                            >
                                Delete
                            </button>

                        </div>

                    )}

                </article>

            ))}

        </section>
    );
}

export default PostList;