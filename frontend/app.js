const API_URL = "http://localhost:5000/api";
let token = "";

// REGISTER
async function register() {
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (data.token) {
        token = data.token;
        alert("Registered successfully!");
    } else {
        alert(data.message || "Registration failed");
    }
}

// LOGIN
async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.token) {
        token = data.token;
        alert("Login successful!");
        fetchBlogs();
    } else {
        alert(data.message || "Login failed");
    }
}

// CREATE BLOG
async function createBlog() {
    const title = document.getElementById("blogTitle").value;
    const content = document.getElementById("blogContent").value;

    const res = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
    });

    if (res.ok) {
        alert("Blog created!");
        fetchBlogs();
    } else {
        alert("Error creating blog");
    }
}

// FETCH BLOGS
async function fetchBlogs() {
    const res = await fetch(`${API_URL}/blogs`);
    const blogs = await res.json();

    const blogsDiv = document.getElementById("blogs");
    blogsDiv.innerHTML = "";

    blogs.forEach(async (blog) => {
        const template = document.getElementById("blogTemplate").content.cloneNode(true);
        template.querySelector(".blog-title").textContent = blog.title;
        template.querySelector(".blog-content").textContent = blog.content;

        const commentsList = template.querySelector(".comments-list");

        // Fetch comments for this blog
        const commentsRes = await fetch(`${API_URL}/comments/${blog.id}`);
        const comments = await commentsRes.json();
        comments.forEach(comment => {
            const div = document.createElement("div");
            div.className = "comment";
            div.textContent = comment.content;
            commentsList.appendChild(div);
        });

        // If logged in, show comment form
        if (token) {
            const commentForm = template.querySelector(".comment-form");
            commentForm.style.display = "block";
            const input = commentForm.querySelector(".comment-input");
            const btn = commentForm.querySelector(".comment-btn");

            btn.addEventListener("click", async () => {
                if (!input.value.trim()) return alert("Comment cannot be empty");
                const res = await fetch(`${API_URL}/comments/${blog.id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ content: input.value })
                });
                if (res.ok) {
                    input.value = "";
                    fetchBlogs(); // Refresh comments
                } else {
                    alert("Error posting comment");
                }
            });
        }

        blogsDiv.appendChild(template);
    });
}

// Load blogs on page load
fetchBlogs();
