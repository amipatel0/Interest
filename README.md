# Interest Management App

This is a Full-Stack Interest Management Web Application (Mobile-Friendly). It features a Node.js/Express backend, MySQL database, and React frontend built with Vite.

## Features Added
* Admin login with JWT Authentication
* Dashboard with financial summary
* Add customer (loan details, rate, start date)
* Customer list with text-search and status tags
* Dynamic automatic interest calculation based on loan start date
* Customer detail view with payments history
* Track payments securely (Interest or Principal)
* PDF Statement Generation for Download/Print
* Node-Cron daily reminder system (logic scaffolding present in `server.js`)
* Mobile App-like UI with bottom navigation and smooth Bootstrap design

## Installation & Running

### 1. Database Setup
Make sure you have MySQL server running locally. Create a database named `interest_db`:
```sql
CREATE DATABASE interest_db;
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

*The default login is username `admin` and password `admin123`. The backend runs on port 5000.*

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

*Open your browser to `http://localhost:3000` to access the mobile-friendly web app.*
"# Website_Interest" 
"# Website" 
