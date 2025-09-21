# Project Management Tool

**Submitted by:** [Your Full Name]
**Contact:** [Your Email / Phone Number]

---
## 🚀 How to Run the Project

This is a full-stack application with a Python (Flask) backend and a JavaScript (React) frontend.

### **Prerequisites**
- Python 3.x
- Node.js & npm
- MySQL

---
### **Backend Setup**
1.  Navigate to the `backend` directory: `cd backend`
2.  Create and activate a virtual environment.
3.  Install dependencies: `pip install -r requirements.txt` (Note: You may need to run `pip freeze > requirements.txt` first to generate this file).
4.  Create a database in MySQL named `project_db`.
5.  Create a `.env` file in the `backend` directory and add your database URL and a secret key:
    ```env
    SECRET_KEY='a_very_secret_key'
    DATABASE_URL='mysql+pymysql://user:password@localhost/project_db'
    ```
6.  Apply the database migrations: `flask db upgrade`
7.  Run the server: `flask run` (or `python run.py`). The backend will run on `http://127.0.0.1:5000`.

---
### **Frontend Setup**
1.  Open a new terminal and navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the application: `npm start`
4.  The frontend will be available at `http://localhost:3000`.

---
## 🛠️ API Endpoints Summary

A full Postman collection (`Project_Management.postman_collection.json`) is included.

- **Auth:** `POST /api/register`, `POST /api/login`
- **Projects:** `GET /api/projects`, `POST /api/projects`
- **Tasks:** `GET /api/projects/<id>/tasks`, `POST /api/projects/<id>/tasks`, `PUT /api/tasks/<id>`

---
## 💡 Assumptions & Improvements

### **Assumptions**
- A task can only be assigned to one user.
- Users are assigned to projects by the project creator (initially just the creator).

### **Possible Improvements**
- Implement real-time updates using WebSockets for a more collaborative experience.
- Add a more detailed commenting and file attachment feature for tasks.
- Fully implement role-based access control in the UI (e.g., showing different buttons for Admins vs. Developers).

---
### **Development Notes: Local Environment CORS Issue**
*A persistent environmental CORS issue was encountered during development, preventing the frontend from communicating with the backend despite correct configurations. The issue was resolved by changing the API call URL from `localhost` to the direct IP `127.0.0.1`.*
