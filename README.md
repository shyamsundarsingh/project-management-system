# Project Management system

This is a **MERN (MongoDB, Express, React, Node.js) Dashboard/Admin Panel with project managment ** with **JWT authentication**, designed to project management system, lists, and other admin features.

---

## 🛠 Technology Stack

- **Frontend:** Next.js (React framework)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Atlas or local)
- **Authentication:** JWT (JSON Web Tokens)
- **State Management:** React Hooks / Context API
- **Other Libraries:** Axios, bcrypt, Mongoose, dotenv

---

## 📂 Project Structure

project_management/
├── backend/ # Node + Express API
├── frontend/ #  / React Admin Dashboard
├── .gitignore
├── README.md



---

## ⚡ Features

- Admin panel to project management sytem for program Manager
- JWT authentication for secure login
- CRUD operations (Create, Read, Update, Delete) for data
- Clean and responsive UI using React/Next.js

---

## 💻 Setup & Installation (Step by Step)

### 1. Clone the repository
```bash
git clone https://github.com/shyamsundarsingh/project-management-system.git

Backend  setup:- 
cd project-managment
cd backend
npm install        # Install dependencies
cp .env.example .env  # Create your environment variables file
# Example .env variables
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
npm run dev        # Start backend server (localhost:5000)


3. Frontend Setup
cd ../frontend
npm install        # Install dependencies
npm run dev        # Start  frontend (localhost:3000)

Visit http://localhost:3000
 for the frontend dashboard

Backend API runs on http://localhost:5000
