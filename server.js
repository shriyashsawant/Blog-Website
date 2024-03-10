const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Post schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Post = mongoose.model('Post', postSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add a new post
app.post('/posts', async (req, res) => {
    const { title, content } = req.body;

    try {
        const newPost = new Post({ title, content });
        await newPost.save();
        res.status(201).json({ message: 'Post added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit a post
app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        await Post.findByIdAndUpdate(id, { title, content });
        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a post
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Post.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

