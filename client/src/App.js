import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [newTask, setNewTask] = useState(""); // Holds text input
  const [tasks, setTasks] = useState([]);     // Holds list of tasks



  // ⬇️ useEffect runs ONCE when the page loads
  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then((res) => {
        setTasks(res.data); // Save fetched tasks to state
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
      });
  }, []);

  // ➕ Add new task
  const handleAddTask = () => {
    if (newTask.trim() === '') return;

    axios.post('http://localhost:5000/tasks', { text: newTask })
      .then((res) => {
        setTasks([...tasks, res.data]); // Add new task to UI
        setNewTask(''); // Clear input
      })
      .catch((err) => {
        console.error('Error adding task:', err);
      });
  };

  // ❌ Delete a task
  const handleDeleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id)); // Remove from UI
      })
      .catch((err) => {
        console.error('Error deleting task:', err);
      });
  };
  const handleToggleDone = (id, done) => {
  axios.put(`http://localhost:5000/tasks/${id}`, { done })
    .then((res) => {
      const updatedTasks = tasks.map(task =>
        task._id === id ? { ...task, done } : task
      );
      setTasks(updatedTasks);
    })
    .catch(err => console.error('Error updating task:', err));
};


  return (
    <div className="App">
      <h1>📝 To-Do List</h1>

      <input
        type="text"
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        placeholder="Add a task..."
      />
      <button onClick={handleAddTask}>Add</button>

<ul>
  {tasks.map(task => (
    <li key={task._id}>
            <input
        type="checkbox"
        checked={task.done}
        onChange={() => handleToggleDone(task._id, !task.done)}
      />

      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.text}
      </span>
      <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
    </li>
  ))}
</ul>

    </div>
  );
}

export default App;
