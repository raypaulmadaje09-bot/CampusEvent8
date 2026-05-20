/**
 * SQL SCHEMA FOR MYSQL WORKBENCH
 * 
 * CREATE DATABASE IF NOT EXISTS campus_event_scheduller;
 * USE campus_event_scheduller;
 * 
 * CREATE TABLE users (
 *   id VARCHAR(255) PRIMARY KEY,
 *   name VARCHAR(255) NOT NULL,
 *   email VARCHAR(255) UNIQUE NOT NULL,
 *   password VARCHAR(255) NOT NULL,
 *   role ENUM('MasterAdmin', 'Admin', 'Student') NOT NULL,
 *   avatar TEXT,
 *   canRequestEvents BOOLEAN DEFAULT FALSE
 * );
 * 
 * CREATE TABLE events (
 *   id VARCHAR(255) PRIMARY KEY,
 *   title VARCHAR(255) NOT NULL,
 *   description TEXT,
 *   date DATE NOT NULL,
 *   startTime VARCHAR(50),
 *   endTime VARCHAR(50),
 *   location VARCHAR(255),
 *   category VARCHAR(100),
 *   organizer VARCHAR(255),
 *   attendees INT DEFAULT 0,
 *   image LONGTEXT,
 *   isPopular BOOLEAN DEFAULT FALSE,
 *   isLive BOOLEAN DEFAULT FALSE,
 *   status ENUM('Approved', 'Pending') DEFAULT 'Pending'
 * );
 * 
 * CREATE TABLE feedback (
 *   id VARCHAR(255) PRIMARY KEY,
 *   senderName VARCHAR(255),
 *   senderEmail VARCHAR(255),
 *   subject VARCHAR(255),
 *   message TEXT,
 *   timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
 *   status ENUM('new', 'read', 'replied') DEFAULT 'new'
 * );
 * 
 * CREATE TABLE replies (
 *   id INT AUTO_INCREMENT PRIMARY KEY,
 *   feedback_id VARCHAR(255),
 *   sender ENUM('Admin', 'Student'),
 *   text TEXT,
 *   timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
 * );
 * 
 * CREATE TABLE audit_logs (
 *   id VARCHAR(255) PRIMARY KEY,
 *   timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
 *   action VARCHAR(255),
 *   actor VARCHAR(255),
 *   type VARCHAR(50),
 *   details TEXT
 * );
 * 
 * -- CONFIG TABLE
 * CREATE TABLE site_config (
 *   id INT PRIMARY KEY DEFAULT 1,
 *   campusName VARCHAR(255),
 *   heroHeadline VARCHAR(255),
 *   heroSubheadline TEXT,
 *   heroImage LONGTEXT,
 *   footerText TEXT,
 *   logoImage LONGTEXT,
 *   socialLinks JSON, -- Store array of {platform, handle, visible}
 *   exploreTitle VARCHAR(100) DEFAULT 'Explore',
 *   exploreLinks JSON, -- Store array of {label, url}
 *   supportTitle VARCHAR(100) DEFAULT 'Support',
 *   supportLinks JSON -- Store array of {label, url}
 * );
 * INSERT INTO site_config (id, campusName, heroHeadline, heroSubheadline, heroImage, footerText, socialLinks, exploreLinks, supportLinks) 
 * VALUES (1, 'CampusPulse', 'Your Campus. All in One Place.', 'Discover workshops, games, performances...', '', 'The central hub...', 
 * '[{"platform": "Twitter", "handle": "@campus_pulse", "visible": true}, {"platform": "Instagram", "handle": "@campus_pulse", "visible": true}]',
 * '[{"label": "All Events", "url": "#"}, {"label": "Student Clubs", "url": "#"}]',
 * '[{"label": "Help Center", "url": "#"}, {"label": "Feedback", "url": "#"}]');
 * 
 * -- INITIAL MASTER NODE
 * INSERT INTO users (id, name, email, password, role) VALUES ('u1', 'Master Admin', 'master@campus.edu', 'master', 'MasterAdmin');
 */

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve Static Files from Vite Build
app.use(express.static(path.join(__dirname, 'dist')));

// Database Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-32635dc5-mysql-lab-project-madaje.e.aivencloud.com',
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD || 'AVNS_Bec0I9laP4vj1JUb4OH',
  database: process.env.DB_NAME || 'campus_event_scheduller',
  port: process.env.DB_PORT || 15645,
  ssl: {
    rejectUnauthorized: false // Required for Aiven SSL connections
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', message: 'CampusPulse Node Active' });
});

app.get('/api/config', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_config WHERE id = 1');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    const c = req.body;
    await pool.query(
      'UPDATE site_config SET campusName=?, heroHeadline=?, heroSubheadline=?, heroImage=?, footerText=?, logoImage=?, socialLinks=?, exploreTitle=?, exploreLinks=?, supportTitle=?, supportLinks=? WHERE id=1',
      [
        c.campusName, c.heroHeadline, c.heroSubheadline, c.heroImage, c.footerText, c.logoImage, 
        JSON.stringify(c.socialLinks),
        c.exploreTitle, JSON.stringify(c.exploreLinks),
        c.supportTitle, JSON.stringify(c.supportLinks)
      ]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Event Protocols
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const e = req.body;
    await pool.query(
      'INSERT INTO events (id, title, description, date, startTime, endTime, location, category, organizer, attendees, image, isPopular, isLive, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [e.id, e.title, e.description, e.date, e.startTime, e.endTime, e.location, e.category, e.organizer, e.attendees, e.image, e.isPopular || 0, e.isLive || 0, e.status]
    );
    res.status(201).json(e);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const e = req.body;
    // Dynamic update or just set all fields
    await pool.query(
      'UPDATE events SET title=?, description=?, date=?, startTime=?, endTime=?, location=?, category=?, organizer=?, image=?, isPopular=?, isLive=?, status=? WHERE id=?',
      [e.title, e.description, e.date, e.startTime, e.endTime, e.location, e.category, e.organizer, e.image, e.isPopular || 0, e.isLive || 0, e.status, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Protocols
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const u = req.body;
    await pool.query(
      'INSERT INTO users (id, name, email, password, role, avatar, canRequestEvents) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [u.id, u.name, u.email, u.password, u.role, u.avatar, u.canRequestEvents ? 1 : 0]
    );
    res.status(201).json(u);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, avatar, canRequestEvents } = req.body;
    await pool.query(
      'UPDATE users SET name=?, email=?, password=?, role=?, avatar=?, canRequestEvents=? WHERE id=?',
      [name, email, password, role, avatar, canRequestEvents ? 1 : 0, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Transmission Protocols
app.get('/api/feedback', async (req, res) => {
  try {
    const [messages] = await pool.query('SELECT * FROM feedback ORDER BY timestamp DESC');
    for (let msg of messages) {
      const [replies] = await pool.query('SELECT * FROM replies WHERE feedback_id = ? ORDER BY timestamp ASC', [msg.id]);
      msg.replies = replies;
    }
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    const m = req.body;
    await pool.query(
      'INSERT INTO feedback (id, senderName, senderEmail, subject, message, timestamp, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [m.id, m.senderName, m.senderEmail, m.subject, m.message, m.timestamp, m.status]
    );
    res.status(201).json(m);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feedback/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, text, timestamp } = req.body;
    await pool.query(
      'INSERT INTO replies (feedback_id, sender, text, timestamp) VALUES (?, ?, ?, ?)',
      [id, sender, text, timestamp]
    );
    await pool.query('UPDATE feedback SET status = "replied" WHERE id = ?', [id]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Audit Protocols
app.get('/api/audit', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/audit', async (req, res) => {
  try {
    const l = req.body;
    await pool.query(
      'INSERT INTO audit_logs (id, timestamp, action, actor, type, details) VALUES (?, ?, ?, ?, ?, ?)',
      [l.id, l.timestamp, l.action, l.actor, l.type, l.details]
    );
    res.status(201).json(l);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// For any other request, send back index.html from dist
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[DATABASE PROTOCOL ACTIVE] Connected to Aiven MySQL`);
  console.log(`[SERVER ACTIVE] Running on port ${PORT}`);
});
