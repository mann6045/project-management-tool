import React, { useState, useEffect } from 'react';
import api from '../api';
import './DashboardPage.css';

function DashboardPage() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [message, setMessage] = useState('');

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            setMessage('Could not fetch projects.');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSelectProject = async (project) => {
        setSelectedProject(project);
        try {
            const response = await api.get(`/projects/${project.id}/tasks`);
            setTasks(response.data);
        } catch (error) {
            setMessage(`Could not fetch tasks for ${project.name}.`);
            setTasks([]);
        }
    };
    
    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', { name: newProjectName });
            setNewProjectName('');
            fetchProjects();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to create project.');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!selectedProject) {
            setMessage('Please select a project first.');
            return;
        }
        try {
            await api.post(`/projects/${selectedProject.id}/tasks`, { title: newTaskTitle });
            setNewTaskTitle('');
            handleSelectProject(selectedProject); 
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to create task.');
        }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            handleSelectProject(selectedProject);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to update status.');
        }
    };

    // --- ADDED THIS FUNCTION ---
    const handleDeleteProject = async (projectId) => {
        if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
            try {
                await api.delete(`/projects/${projectId}`);
                fetchProjects(); // Refresh project list
                // If the deleted project was the selected one, clear the view
                if (selectedProject && selectedProject.id === projectId) {
                    setSelectedProject(null);
                    setTasks([]);
                }
            } catch (error) {
                setMessage(error.response?.data?.message || 'Failed to delete project.');
            }
        }
    };
    
    // --- ADDED THIS FUNCTION ---
    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                handleSelectProject(selectedProject); // Refresh task list
            } catch (error) {
                setMessage(error.response?.data?.message || 'Failed to delete task.');
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="projects-panel">
                <h2>Projects</h2>
                <form onSubmit={handleCreateProject} className="new-project-form">
                    <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="New project name" required />
                    <button type="submit">Create</button>
                </form>
                <hr />
                <ul>
                    {projects.map(project => (
                        <li key={project.id} className={`project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}>
                            <span onClick={() => handleSelectProject(project)} className="project-name">{project.name}</span>
                            {/* --- ADDED THIS BUTTON --- */}
                            <button onClick={() => handleDeleteProject(project.id)} className="delete-btn">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="tasks-panel">
                <h2>Tasks for {selectedProject ? selectedProject.name : '...'}</h2>
                {selectedProject ? (
                    <>
                        <form onSubmit={handleCreateTask}>
                            <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Enter new task title" required />
                            <button type="submit">Add Task</button>
                        </form>
                        <hr />
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map(task => (
                                    <tr key={task.id}>
                                        <td>{task.title}</td>
                                        <td>{task.status}</td>
                                        <td className="task-actions">
                                            <button onClick={() => handleUpdateStatus(task.id, 'To Do')}>To Do</button>
                                            <button onClick={() => handleUpdateStatus(task.id, 'In Progress')}>In Progress</button>
                                            <button onClick={() => handleUpdateStatus(task.id, 'Done')}>Done</button>
                                            {/* --- ADDED THIS BUTTON --- */}
                                            <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : <p>Select a project to see its tasks.</p>}
            </div>
        </div>
    );
}

export default DashboardPage;