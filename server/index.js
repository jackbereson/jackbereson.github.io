require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const helmet   = require('helmet');

const blogRoutes = require('./routes/blogs');

const app  = express();
const PORT = process.env.PORT || 3001;

/* ─── MIDDLEWARE ─────────────────────────────────── */
app.use(helmet());
app.use(express.json());

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, same-origin)
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    cb(new Error(`CORS: ${origin} not allowed`));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

/* ─── ROUTES ─────────────────────────────────────── */
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));
app.use('/api/blogs', blogRoutes);

// 404 catch-all
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

/* ─── MONGODB ATLAS CONNECTION ───────────────────── */
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌  MONGODB_URI not set. Copy .env.example → .env and fill in your Atlas URI.');
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    console.log('✅  Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀  API running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
