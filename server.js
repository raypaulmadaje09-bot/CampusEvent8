import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= SECURITY ================= */

app.use(cors());
app.use(helmet());

app.use(express.json({ limit: '20mb' }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/* ================= STATIC BUILD ================= */

app.use(express.static(path.join(__dirname, 'dist')));

/* ================= DATABASE ================= */

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* ================= AUTH MIDDLEWARE ================= */

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

/* ================= HEALTH ================= */

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'CampusPulse Server Running' });
});

/* ================= AUTH ================= */

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const [existing] = await pool.query(
      'SELECT * FROM users WHERE email=?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    await pool.query(
      `INSERT INTO users (id, name, email, password, role, avatar, canRequestEvents)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, email, hashedPassword, 'Student', '', 0]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email=?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= CONFIG ================= */

app.get('/api/config', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM site_config WHERE id = 1'
    );

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= EVENTS ================= */

app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM events ORDER BY date DESC'
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', authenticate, authorize('Admin', 'MasterAdmin'), async (req, res) => {
  try {
    const e = req.body;
    const id = uuidv4();

    await pool.query(
      `INSERT INTO events
      (id, title, description, date, startTime, endTime, location, category, organizer, attendees, image, isPopular, isLive, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        e.title,
        e.description,
        e.date,
        e.startTime,
        e.endTime,
        e.location,
        e.category,
        e.organizer,
        0,
        e.image,
        e.isPopular || 0,
        e.isLive || 0,
        e.status || 'Pending',
      ]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= USERS ================= */

app.get('/api/users', authenticate, authorize('MasterAdmin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, avatar, canRequestEvents FROM users'
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= FEEDBACK ================= */

app.post('/api/feedback', async (req, res) => {
  try {
    const m = req.body;
    const id = uuidv4();

    await pool.query(
      `INSERT INTO feedback (id, senderName, senderEmail, subject, message, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, m.senderName, m.senderEmail, m.subject, m.message, 'new']
    );

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= SPA FALLBACK (FIXED) ================= */

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`[SERVER ACTIVE] Running on port ${PORT}`);
});
