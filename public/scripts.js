document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.getElementById('posts');
    const searchForm = document.getElementById('searchForm');

    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        // Submit the form data to the server
        const response = await fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            // If the post is added successfully, reload the posts
            loadPosts();
            postForm.reset();
        } else {
            console.error('Failed to add post');
        }
    });

    // Function to load and display posts
    const loadPosts = async () => {
        // Fetch posts from the server
        const response = await fetch('/posts');
        const posts = await response.json();

        // Display posts on the page
        postsContainer.innerHTML = '';
        posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <button onclick="editPost('${post._id}', '${post.title}', '${post.content}')">Edit</button>
                <button onclick="deletePost('${post._id}')">Delete</button>
                <hr>
            `;
            postsContainer.appendChild(postElement);
        });
    };

    // Load posts when the page loads
    loadPosts();

    // Function to edit a post
    window.editPost = async (postId, currentTitle, currentContent) => {
        const newTitle = prompt('Enter the new title:', currentTitle);
        const newContent = prompt('Enter the new content:', currentContent);

        if (newTitle !== null && newContent !== null) {
            await fetch(`/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            });

            // Fetch and display updated posts
            loadPosts();
        }
    };

    // Function to delete a post
    window.deletePost = async (postId) => {
        const confirmDelete = confirm('Are you sure you want to delete this post?');

        if (confirmDelete) {
            await fetch(`/posts/${postId}`, {
                method: 'DELETE',
            });

            // Fetch and display updated posts
            loadPosts();
        }
    };

    // Search functionality
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const searchTerm = document.getElementById('search').value;

        if (searchTerm.trim() !== '') {
            const response = await fetch(`/posts?title=${encodeURIComponent(searchTerm)}`);
            const matchingPosts = await response.json();

            postsContainer.innerHTML = '';
            matchingPosts.forEach((post) => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <hr>
                `;
                postsContainer.appendChild(postElement);
            });
        } else {
            // If the search term is empty, reload all posts
            loadPosts();
        }
    });
});