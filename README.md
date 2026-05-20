# Campus Pulse | Event Management System

A high-fidelity campus event scheduling and administrative platform built with React, Vite, Tailwind CSS, and Node.js.

**Repository:** [https://github.com/raypaulmadaje09-bot/CampusEvent1](https://github.com/raypaulmadaje09-bot/CampusEvent1)

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MySQL Server**
- **MySQL Workbench** (recommended for database management)

### 2. Database Synchronization (Aiven Cloud)
Follow these steps to synchronize your Aiven MySQL instance with the new database naming protocol:

**Step 1: Connect to Aiven MySQL**
1. Open **MySQL Workbench**.
2. Create a new connection with these parameters:
   - **Hostname**: `mysql-32635dc5-mysql-lab-project-madaje.e.aivencloud.com`
   - **Port**: `15645`
   - **Username**: `avnadmin`
   - **Password**: `AVNS_Bec0I9laP4vj1JUb4OH`
3. Test the connection and open it.

**Step 2: Create the Database**
1. In a new SQL tab, run:
   ```sql
   CREATE DATABASE IF NOT EXISTS campus_event_scheduller;
   USE campus_event_scheduller;
   ```

**Step 3: Initialize Tables**
1. Copy and run the following script to set up all high-fidelity protocols in the `campus_event_scheduller` database:
   ```sql
   USE campus_event_scheduller;

   -- Clean start (Optional)
   DROP TABLE IF EXISTS audit_logs;
   DROP TABLE IF EXISTS replies;
   DROP TABLE IF EXISTS feedback;
   DROP TABLE IF EXISTS events;
   DROP TABLE IF EXISTS users;
   DROP TABLE IF EXISTS site_config;

   -- 1. Users Matrix (Identity & Profile Photos)
   CREATE TABLE users (
     id VARCHAR(255) PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role ENUM('MasterAdmin', 'Admin', 'Student') NOT NULL,
     avatar LONGTEXT -- High-capacity storage for Base64 Profile Photos
   );

   -- 2. Event Protocols (Schedule & Event Photos)
   CREATE TABLE events (
     id VARCHAR(255) PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     date DATE NOT NULL,
     startTime VARCHAR(50),
     endTime VARCHAR(50),
     location VARCHAR(255),
     category VARCHAR(100),
     organizer VARCHAR(255),
     attendees INT DEFAULT 0,
     image LONGTEXT, -- High-capacity storage for Base64 Event Photos
     isPopular BOOLEAN DEFAULT FALSE,
     isLive BOOLEAN DEFAULT FALSE,
     status ENUM('Approved', 'Pending') DEFAULT 'Pending'
   );

   -- 3. Site CMS Table (Backgrounds & Branding)
   CREATE TABLE site_config (
     id INT PRIMARY KEY DEFAULT 1,
     campusName VARCHAR(255),
     heroHeadline VARCHAR(255),
     heroSubheadline TEXT,
     heroImage LONGTEXT, -- High-capacity storage for Base64 Backgrounds
     footerText TEXT,
     logoImage LONGTEXT   -- High-capacity storage for Base64 Logo
   );

   -- 4. Communication Matrix
   CREATE TABLE feedback (
     id VARCHAR(255) PRIMARY KEY,
     senderName VARCHAR(255),
     senderEmail VARCHAR(255),
     subject VARCHAR(255),
     message TEXT,
     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
     status ENUM('new', 'read', 'replied') DEFAULT 'new'
   );

   CREATE TABLE replies (
     id INT AUTO_INCREMENT PRIMARY KEY,
     feedback_id VARCHAR(255),
     sender ENUM('Admin', 'Student'),
     text TEXT,
     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE
   );

   -- 5. Forensic Audit History
   CREATE TABLE audit_logs (
     id VARCHAR(255) PRIMARY KEY,
     timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
     action VARCHAR(255),
     actor VARCHAR(255),
     type VARCHAR(50),
     details TEXT
   );

   -- Step 4: Inject Initial Authorization Nodes
   INSERT INTO users (id, name, email, password, role) 
   VALUES ('u1', 'Master Admin', 'master@campus.edu', 'master', 'MasterAdmin');

   INSERT INTO site_config (id, campusName, heroHeadline, heroSubheadline, heroImage, footerText) 
   VALUES (1, 'CampusPulse', 'Your Campus. All in One Place.', 'Discover workshops, games, performances...', '', 'The central hub...');
   ```

### 3. Environment Configuration
1. In the project root, create a file named `.env`.
2. Configure your credentials based on `.env.example`:
   ```env
   DB_HOST=mysql-32635dc5-mysql-lab-project-madaje.e.aivencloud.com
   DB_USER=avnadmin
   DB_PASSWORD=AVNS_Bec0I9laP4vj1JUb4OH
   DB_NAME=campus_event_scheduller
   DB_PORT=15645
   PORT=5000
   ```

### 4. Initialize Protocols
Run the backend and frontend in separate terminals:

**Terminal 1 (Backend):**
```bash
node server.js
```

**Terminal 2 (Frontend):**
```bash
npm install
npm run dev
```

## 🔑 Authorized Access Nodes

| Identity | Email Node | Access Key | Authorization |
| :--- | :--- | :--- | :--- |
| **Master Admin** | `master@campus.edu` | `master` | Level 10 (Full Control) |
| **Staff Admin** | `admin@campus.edu` | `admin` | Level 5 (Operations) |
| **Student** | `alex@student.edu` | `student` | Level 1 (Engagement) |

---

## 🌐 Live Deployment (Render.com)

This project is configured to run as a single **Web Service** on Render.

### 1. Push to GitHub
Ensure all your changes are pushed to your repository: `https://github.com/raypaulmadaje09-bot/CampusEvent1`

### 2. Configure Render Web Service
1. Log in to [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Use the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Environment Variables**: Add your Aiven credentials under the "Environment" tab:
   - `DB_HOST`: `mysql-32635dc5-mysql-lab-project-madaje.e.aivencloud.com`
   - `DB_USER`: `avnadmin`
   - `DB_PASSWORD`: `AVNS_Bec0I9laP4vj1JUb4OH`
   - `DB_NAME`: `defaultdb`
   - `DB_PORT`: `15645`

### 3. Verification
Once deployed, Render will provide a URL like `https://campusevent1.onrender.com`. Your frontend and backend will be synchronized on this single instance.

---
**Note:** If the server is offline, the frontend will automatically switch to a high-fidelity "Mock Node" for demonstration purposes. Syncing with MySQL requires an active `server.js` instance.
