import React, { useState } from "react";
import { addTaskToFirestore } from "../services/taskService";
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { serverTimestamp } from "firebase/firestore"; // ✅ Add this

const AddTaskComponent = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    const task = {
      title,
      description,
      createdBy: user.uid,             // ✅ Use 'createdBy'
      createdAt: serverTimestamp(),    // ✅ Use Firestore server timestamp
    };

    try {
      await addTaskToFirestore(task);
      toast.success("Task added successfully!");
      setTitle("");
      setDescription("");
      onTaskAdded(); // Notify parent to refresh tasks
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task.");
    }
  };

  return (
    <div className="bg-green-50 dark:bg-green-900 p-6 rounded-xl shadow-md w-full transition duration-300 border border-green-200 dark:border-green-700">
      <h2 className="text-xl font-bold text-green-800 dark:text-green-100 mb-4">
        Add New Task
      </h2>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-green-900 dark:text-green-200 mb-1">
            Task Title
          </label>
          <input
            type="text"
            className="input input-bordered w-full rounded-lg bg-white dark:bg-green-800 border-green-300 dark:border-green-600 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Submit report"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-green-900 dark:text-green-200 mb-1">
            Description
          </label>
          <textarea
            className="textarea textarea-bordered w-full rounded-lg bg-white dark:bg-green-800 border-green-300 dark:border-green-600 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details about the task..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAddTask}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          ➕ Add Task
        </button>
      </div>
    </div>
  );
};

export default AddTaskComponent;

