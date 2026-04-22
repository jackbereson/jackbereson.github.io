const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt:     { type: String, required: true, maxlength: 400 },
    content:     { type: String, default: '' },       // markdown body
    coverImage:  { type: String, default: '' },
    category:    { type: String, default: 'GENERAL', uppercase: true, trim: true },
    tags:        [{ type: String, lowercase: true, trim: true }],
    author:      { type: String, default: 'JB' },
    readTime:    { type: Number, default: 5 },        // minutes
    featured:    { type: Boolean, default: false },
    published:   { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Full-text search index on title + excerpt + content
BlogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Blog', BlogSchema);
