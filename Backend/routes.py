from flask import request, jsonify, Blueprint, current_app
from .models import db, User, Project, Task
from . import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps

api_bp = Blueprint('api_bp', __name__)

@api_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('username'):
        return jsonify({"error": "Username, email, and password are required"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 409
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already taken"}), 409
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        username=data.get('username'), 
        email=data['email'], 
        password_hash=hashed_password,
        role=data.get('role', 'Developer')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": f"User '{new_user.username}' created successfully!"}), 201

@api_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing email or password"}), 400
    user = User.query.filter_by(email=data['email']).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid credentials"}), 401
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({"message": "Login successful", "token": token}), 200

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@api_bp.route('/projects', methods=['GET'])
@token_required
def get_projects(current_user):
    projects = current_user.projects
    projects_data = [{'id': p.id, 'name': p.name} for p in projects]
    return jsonify(projects_data), 200

@api_bp.route('/projects', methods=['POST'])
@token_required
def create_project(current_user):
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'message': 'Project name is required'}), 400
    new_project = Project(
        name=data['name'],
        description=data.get('description', '')
    )
    new_project.team.append(current_user)
    db.session.add(new_project)
    db.session.commit()
    return jsonify({'message': f"Project '{new_project.name}' created successfully!", 'project_id': new_project.id}), 201

@api_bp.route('/projects/<int:project_id>/tasks', methods=['GET'])
@token_required
def get_tasks(current_user, project_id):
    project = Project.query.get(project_id) # Use .get()
    if not project: # Manually check if project exists
        return jsonify({'message': 'Project not found'}), 404
    if current_user not in project.team:
        return jsonify({'message': 'Not authorized to view these tasks'}), 403
    tasks = [{'id': t.id, 'title': t.title, 'description': t.description, 'status': t.status} for t in project.tasks]
    return jsonify(tasks), 200

@api_bp.route('/projects/<int:project_id>/tasks', methods=['POST'])
@token_required
def create_task(current_user, project_id):
    project = Project.query.get(project_id) # Use .get()
    if not project: # Manually check if project exists
        return jsonify({'message': 'Project not found'}), 404
    if current_user not in project.team:
        return jsonify({'message': 'Not authorized to add tasks to this project'}), 403
    data = request.get_json()
    if not data or not data.get('title'):
        return jsonify({'message': 'Task title is required'}), 400
    new_task = Task(title=data['title'], description=data.get('description', ''), project_id=project.id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created successfully', 'task_id': new_task.id}), 201

@api_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@token_required
def update_task_status(current_user, task_id):
    task = Task.query.get(task_id) # Use .get()
    if not task: # Manually check if task exists
        return jsonify({'message': 'Task not found'}), 404
    project = task.project
    if current_user not in project.team:
        return jsonify({'message': 'Not authorized to update this task'}), 403
    data = request.get_json()
    new_status = data.get('status')
    if new_status and new_status in ['To Do', 'In Progress', 'Done']:
        task.status = new_status
        db.session.commit()
        return jsonify({'message': f'Task status updated to {task.status}'}), 200
    return jsonify({'message': 'Invalid status provided'}), 400

@api_bp.route('/projects/<int:project_id>', methods=['DELETE'])
@token_required
def delete_project(current_user, project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({'message': 'Project not found'}), 404
    if current_user not in project.team:
        return jsonify({'message': 'Not authorized to delete this project'}), 403

    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Project deleted successfully'}), 200

@api_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user, task_id):
    task = Task.query.get(task_id)
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    if current_user not in task.project.team:
        return jsonify({'message': 'Not authorized to delete this task'}), 403

    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'}), 200