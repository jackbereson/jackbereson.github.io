const express = require('express');
const slugify  = require('slugify');
const Blog     = require('../models/Blog');

const router = express.Router();

// GET /api/blogs — list with pagination, tag & category filter, text search
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, tag, category, search, featured } = req.query;
    const query = { published: true };

    if (tag)      query.tags     = { $in: [tag.toLowerCase()] };
    if (category) query.category = category.toUpperCase();
    if (featured) query.featured = featured === 'true';
    if (search)   query.$text    = { $search: search };

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('-content -__v')
      .sort({ featured: -1, publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Collect all unique tags from the full dataset for filter UI
    const tagAgg = await Blog.aggregate([
      { $match: { published: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags' } },
      { $sort: { _id: 1 } },
    ]);
    const tags = tagAgg.map(t => t._id);

    res.json({
      blogs,
      tags,
      pagination: {
        total,
        page:  parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/blogs/:slug — single post
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true }).select('-__v');
    if (!blog) return res.status(404).json({ error: 'Post not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/blogs — create
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    const slug = slugify(title, { lower: true, strict: true });
    const blog = await Blog.create({ ...req.body, slug });
    res.status(201).json(blog);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug already exists' });
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/blogs/:slug — update
router.put('/:slug', async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.title) update.slug = slugify(update.title, { lower: true, strict: true });

    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      update,
      { new: true, runValidators: true }
    );
    if (!blog) return res.status(404).json({ error: 'Post not found' });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/blogs/:slug — delete
router.delete('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Deleted', slug: req.params.slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
