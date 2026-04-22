require('dotenv').config();
const mongoose = require('mongoose');
const Blog     = require('./models/Blog');

const POSTS = [
  {
    title: 'THE NEON GRID MANIFESTO',
    slug:  'the-neon-grid-manifesto',
    excerpt: 'In the sprawling datascape of modern development, every decision is a coordinate. We build not just software, but the architecture of thought itself — layered, recursive, and quietly beautiful.',
    content: '# THE NEON GRID MANIFESTO\n\nWe are the architects of invisible cities...',
    category: 'PHILOSOPHY', tags: ['code','design','manifesto'],
    readTime: 6, featured: true,
    publishedAt: new Date('2025-03-15'),
  },
  {
    title: 'MongoDB Atlas: Zero to Deployed in 10 Minutes',
    slug:  'mongodb-atlas-zero-to-deployed',
    excerpt: 'Skip the setup hell. Atlas gives you a cloud cluster, REST Data API, and global replication out of the box. Here\'s the fastest path from idea to production.',
    content: '# MongoDB Atlas Setup\n\nFirst, create a free M0 cluster...',
    category: 'BACKEND', tags: ['mongodb','atlas','nodejs'],
    readTime: 10,
    publishedAt: new Date('2025-02-28'),
  },
  {
    title: 'Crafting Neon Glow with Pure CSS',
    slug:  'cyberpunk-css-glow-effects',
    excerpt: 'box-shadow is your best friend in the neon age. Learn how to layer shadows, animate scanlines, and build a retro-futuristic UI that makes interfaces feel like they\'re from 2077.',
    content: '# Neon Glow in CSS\n\n```css\n.neon { box-shadow: 0 0 10px #00f0ff; }\n```',
    category: 'CSS', tags: ['css','design','animation'],
    readTime: 8,
    publishedAt: new Date('2025-02-14'),
  },
  {
    title: 'Async Patterns in 2025: Beyond Promise Chains',
    slug:  'javascript-async-patterns-2025',
    excerpt: 'Generators, async iterators, and the emerging patterns that will define how we handle concurrency in the next generation of JavaScript applications.',
    content: '# Async Patterns\n\nThe async/await syntax we know is just the beginning...',
    category: 'JS', tags: ['javascript','async','patterns'],
    readTime: 12,
    publishedAt: new Date('2025-01-30'),
  },
  {
    title: 'Migrating from Webpack to Vite',
    slug:  'webpack-to-vite-migration',
    excerpt: 'The build times alone will make you a believer. A practical guide to migrating a production Webpack setup to Vite with zero downtime.',
    content: '# Webpack → Vite\n\nInstall Vite: `npm install -D vite`...',
    category: 'BUILD', tags: ['vite','webpack','build'],
    readTime: 9,
    publishedAt: new Date('2025-01-20'),
  },
  {
    title: 'The Art of API Design',
    slug:  'the-art-of-api-design',
    excerpt: 'An API is a contract. Break it and you break trust. A deep dive into RESTful principles, versioning strategies, and the ergonomics of developer experience.',
    content: '# API Design Principles\n\nStart with the consumer\'s mental model...',
    category: 'BACKEND', tags: ['api','rest','design'],
    readTime: 14,
    publishedAt: new Date('2025-01-05'),
  },
  {
    title: 'GitHub Actions: Automate Everything',
    slug:  'github-actions-deploy-guide',
    excerpt: 'From lint checks to container builds to multi-environment deploys. GitHub Actions has become the backbone of modern CI/CD. Here\'s how to architect a bulletproof pipeline.',
    content: '# GitHub Actions\n\n```yaml\non:\n  push:\n    branches: [main]\n```',
    category: 'DEVOPS', tags: ['github','ci-cd','devops'],
    readTime: 11,
    publishedAt: new Date('2024-12-18'),
  },
  {
    title: 'Tailwind vs Vanilla CSS: The Honest Truth',
    slug:  'tailwind-vs-vanilla-css',
    excerpt: 'After shipping five production apps with each approach, the answer is nuanced. Context matters more than dogma. Here\'s what I actually think.',
    content: '# Tailwind vs CSS\n\nBoth are valid. Here\'s when to use each...',
    category: 'CSS', tags: ['tailwind','css','opinion'],
    readTime: 7,
    publishedAt: new Date('2024-12-01'),
  },
  {
    title: 'Terminal Productivity Unlocked',
    slug:  'terminal-productivity-unlocked',
    excerpt: 'Zsh plugins, custom aliases, fzf, tmux, and the muscle memory that will make you feel like a wizard in the shell. The terminal is not a tool — it\'s a language.',
    content: '# Terminal Setup\n\n## Zsh\n\nInstall oh-my-zsh first...',
    category: 'TOOLS', tags: ['terminal','cli','productivity'],
    readTime: 8,
    publishedAt: new Date('2024-11-15'),
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅  Connected to MongoDB Atlas');

    await Blog.deleteMany({});
    console.log('🗑   Cleared existing posts');

    const created = await Blog.insertMany(POSTS);
    console.log(`🌱  Seeded ${created.length} posts`);
  } catch (err) {
    console.error('❌  Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋  Disconnected');
    process.exit(0);
  }
}

seed();
