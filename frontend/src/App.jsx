import { useEffect, useState } from "react";

import Signin from "./components/Signin";
import Signup from "./components/Signup";
import BlogPostForm from "./components/BlogPostForm";
import PostList from "./components/PostList";
import EditPost from "./components/EditPost";

const API = "http://localhost:8000/api";

function App() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState("signin");
    const [editingPost, setEditingPost] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");


    const loadPosts = async () => {
        try {
            const response = await fetch(`${API}/blogs`, {
                credentials: "include"
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            setPosts(data);

        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await fetch(`${API}/me`, {
                    credentials: "include"
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                setUser(data.user);
                setPage("home");

                loadPosts();

            } catch (error) {
                console.log(error);
            }
        };

        checkUser();
    }, []);


    const handleSignin = async (user_id, password) => {
        const response = await fetch(`${API}/signin`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                user_id,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return data.message;
        }

        setUser(data.user);
        setPage("home");

        await loadPosts();

        return "";
    };


    const handleSignup = async (user_id, password, name) => {
        const response = await fetch(`${API}/signup`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                user_id,
                password,
                name
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return data.message;
        }

        setPage("signin");

        return "";
    };


    const handleLogout = async () => {
        await fetch(`${API}/logout`, {
            method: "POST",
            credentials: "include"
        });

        setUser(null);
        setPosts([]);
        setPage("signin");
    };


    const createPost = async (postData) => {
        const response = await fetch(`${API}/blogs`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify(postData)
        });

        if (response.ok) {
            await loadPosts();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    };


    const updatePost = async (postData) => {
        const response = await fetch(
            `${API}/blogs/${editingPost.blog_id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify(postData)
            }
        );

        if (response.ok) {
            await loadPosts();

            setEditingPost(null);
            setPage("home");

        } else {
            const data = await response.json();
            alert(data.message);
        }
    };


    const deletePost = async (blogId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) {
            return;
        }

        const response = await fetch(
            `${API}/blogs/${blogId}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        if (response.ok) {
            await loadPosts();
        } else {
            const data = await response.json();
            alert(data.message);
        }
    };


    const startEdit = (post) => {
        setEditingPost(post);
        setPage("edit");
    };


    if (!user && page === "signin") {
        return (
            <Signin
                onSignin={handleSignin}
                goToSignup={() => setPage("signup")}
            />
        );
    }


    if (!user && page === "signup") {
        return (
            <Signup
                onSignup={handleSignup}
                goToSignin={() => setPage("signin")}
            />
        );
    }


    if (user && page === "edit" && editingPost) {
        return (
            <EditPost
                post={editingPost}
                onUpdate={updatePost}
                onCancel={() => {
                    setEditingPost(null);
                    setPage("home");
                }}
            />
        );
    }


    const filteredPosts = posts.filter((post) => {
        if (selectedCategory === "All") {
            return true;
        }

        return post.category === selectedCategory;
    });


    return (
        <div>

            <header className="header">

                <h1>My Blog</h1>

                <div className="user-area">

                    <span>
                        Signed in as <strong>{user?.name}</strong>
                    </span>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            <main className="container">

                <BlogPostForm
                    user={user}
                    onCreate={createPost}
                />


                <section className="filter-section">

                    <label>
                        Filter by Category:
                    </label>

                    <select
                        value={selectedCategory}
                        onChange={(event) =>
                            setSelectedCategory(event.target.value)
                        }
                    >
                        <option value="All">All</option>
                        <option value="Tech">Tech</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Education">Education</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Other">Other</option>
                    </select>

                </section>


                <PostList
                    posts={filteredPosts}
                    user={user}
                    onEdit={startEdit}
                    onDelete={deletePost}
                />

            </main>

        </div>
    );
}

export default App;