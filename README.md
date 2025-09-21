🚀 Project Management Tool
Submitted by: MANN PATEL
Contact: [mp0668693@gmail.com]

## 📖 Description
This is a full-stack web application built to simplify project and task management. It provides a clean and functional interface for users to register, log in, create projects, and manage tasks within those projects. The backend is powered by Python and Flask, with a MySQL database, while the frontend is a dynamic single-page application built with React.

## ✨ Features
User Authentication: Secure user registration and login system using JWT (JSON Web Tokens) for authentication.

Protected API Routes: Backend routes are protected, ensuring only authenticated users can access and modify data.

Project Management: Authenticated users can create, view, and delete their projects.

Task Management: For any given project, users can create, view, update the status of (To Do, In Progress, Done), and delete tasks.

RESTful API: A well-structured and documented RESTful API serves as the backbone of the application.

Responsive UI: A clean, component-based frontend built with React that provides a seamless user experience.

## 🛠️ Tech Stack
Backend: Python, Flask, SQLAlchemy

Database: MySQL

Frontend: JavaScript, React, Axios, React Router

API Testing: Postman

Version Control: Git & GitHub

## 🏃‍♀️ How to Run the Project
Prerequisites
Python 3.x

Node.js & npm

MySQL Server

Backend Setup
Navigate to the backend directory: cd backend

Create and activate a Python virtual environment.

Generate requirements.txt: pip freeze > requirements.txt

Install dependencies: pip install -r requirements.txt

In your MySQL instance, create a new database named project_db.

In the backend folder, create a .env file and add your credentials:

Code snippet

SECRET_KEY='your_super_secret_key'
DATABASE_URL='mysql+pymysql://root:your_mysql_password@localhost/project_db'
Apply the database schema: flask db upgrade

Run the server: flask run. The backend will be available at http://127.0.0.1:5000.

Frontend Setup
Open a new terminal and navigate to the frontend directory: cd frontend

Install dependencies: npm install

Start the application: npm start

The frontend will open in your browser at http://localhost:3000.

## 🔌 API Endpoints Summary
A full Postman collection (Project_Management.postman_collection.json) is included for detailed testing.

Authentication

POST /api/register

POST /api/login

Projects

GET /api/projects (Protected)

POST /api/projects (Protected)

DELETE /api/projects/<project_id> (Protected)

Tasks

GET /api/projects/<project_id>/tasks (Protected)

POST /api/projects/<project_id>/tasks (Protected)

PUT /api/tasks/<task_id> (Protected)

DELETE /api/tasks/<task_id> (Protected)

## 📝 Development Notes
A persistent environmental CORS issue was encountered during development, which was resolved by changing the frontend API call URL from localhost to the direct IP address 127.0.0.1. The backend is explicitly configured to allow requests from http://localhost:3000 to the 127.0.0.1 server address.

## 💡 Assumptions & Improvements
Assumptions
Any user who is a member of a project team has the authorization to add, update, and delete tasks within that project.

Any user who is a member of a project team can delete the entire project.

The application currently focuses on core CRUD functionality rather than advanced user role permissions.

Possible Improvements
Full Role-Based Access Control (RBAC): Implement logic where only "Project Managers" can create or delete projects, while "Developers" can only update task statuses.

Real-Time Collaboration: Integrate WebSockets (e.g., using Flask-SocketIO) to allow changes to be pushed to all team members in real-time.

Enhanced Task Details: Add features for setting task deadlines, assigning specific users to tasks, and leaving comments.

Dashboard Metrics: Implement the reporting features from the brief, such as calculating the number of overdue tasks or displaying a project completion percentage bar.
