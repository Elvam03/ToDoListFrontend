import React, { useState, useEffect } from "react";
import axios from "axios";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    axios.post("http://localhost:5000/api/tasks", { title: newTask })
      .then((res) => setTasks([...tasks, res.data]))
      .catch((err) => console.error(err));
    setNewTask("");
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter((task) => task._id !== id)))
      .catch((err) => console.error(err));
  };

  const toggleCompletion = (id, completed) => {
    axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed })
      .then((res) => {
        setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center mb-4">Task List</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={addTask} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Add
        </button>
      </div>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li 
            key={task._id} 
            className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow">
            <span className={`${task.completed ? "line-through text-gray-500" : ""} text-lg`}>
              {task.title}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => toggleCompletion(task._id, task.completed)}
                className={`px-3 py-1 rounded-lg ${task.completed ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} text-white`}>
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button 
                onClick={() => deleteTask(task._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
