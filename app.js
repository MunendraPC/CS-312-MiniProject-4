require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Pool } = require("pg");

const app = express();
const PORT = 8000;


// PostgreSQL connection
const db = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});


// Middleware
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));


// TEST
app.get("/api/test", (req, res) => {
    res.json({
        message: "React is connected to Express!"
    });
});


// CURRENT USER
app.get("/api/me", (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Not signed in."
        });
    }

    res.json({
        user: req.session.user
    });
});


// SIGN UP
app.post("/api/signup", async (req, res) => {

    const { user_id, password, name } = req.body;

    try {

        const existingUser = await db.query(
            "SELECT * FROM users WHERE user_id = $1",
            [user_id]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "That user ID is already taken."
            });
        }

        await db.query(
            `INSERT INTO users
            (user_id, password, name)
            VALUES ($1, $2, $3)`,
            [
                user_id,
                password,
                name
            ]
        );

        res.json({
            message: "Account created successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error creating account."
        });
    }
});


// SIGN IN
app.post("/api/signin", async (req, res) => {

    const { user_id, password } = req.body;

    try {

        const result = await db.query(
            `SELECT *
             FROM users
             WHERE user_id = $1
             AND password = $2`,
            [
                user_id,
                password
            ]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Incorrect user ID or password."
            });
        }

        req.session.user = result.rows[0];

        res.json({
            message: "Signed in successfully.",
            user: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error signing in."
        });
    }
});


// LOGOUT
app.post("/api/logout", (req, res) => {

    req.session.destroy(() => {

        res.json({
            message: "Logged out."
        });

    });
});


// GET ALL BLOGS
app.get("/api/blogs", async (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please sign in."
        });
    }

    try {

        const result = await db.query(
            `SELECT *
             FROM blogs
             ORDER BY date_created DESC`
        );

        res.json(result.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error loading blogs."
        });
    }
});


// CREATE BLOG
app.post("/api/blogs", async (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please sign in."
        });
    }

    const { title, body, category } = req.body;

    try {

        const result = await db.query(
            `INSERT INTO blogs
            (
                creator_name,
                creator_user_id,
                title,
                body,
                date_created,
                category
            )
            VALUES
            ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5)
            RETURNING *`,
            [
                req.session.user.name,
                req.session.user.user_id,
                title,
                body,
                category
            ]
        );

        res.json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error creating blog."
        });
    }
});


// UPDATE BLOG
app.put("/api/blogs/:id", async (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please sign in."
        });
    }

    const blogId = req.params.id;
    const { title, body, category } = req.body;

    try {

        const result = await db.query(
            `UPDATE blogs
             SET title = $1,
                 body = $2,
                 category = $3
             WHERE blog_id = $4
             AND creator_user_id = $5
             RETURNING *`,
            [
                title,
                body,
                category,
                blogId,
                req.session.user.user_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                message: "You can only edit your own posts."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error updating blog."
        });
    }
});


// DELETE BLOG
app.delete("/api/blogs/:id", async (req, res) => {

    if (!req.session.user) {
        return res.status(401).json({
            message: "Please sign in."
        });
    }

    const blogId = req.params.id;

    try {

        const result = await db.query(
            `DELETE FROM blogs
             WHERE blog_id = $1
             AND creator_user_id = $2
             RETURNING *`,
            [
                blogId,
                req.session.user.user_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                message: "You can only delete your own posts."
            });
        }

        res.json({
            message: "Blog deleted."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Error deleting blog."
        });
    }
});


app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});