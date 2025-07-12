import React, { useState } from "react";
import { addTaskToFirestore } from "../services/taskService";
import toast from "react-hot-toast";

const AddTaskComponent = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }

    try {
      await addTaskToFirestore({ title, description });
      toast.success("Task added successfully!");
      setTitle("");
      setDescription("");
      onTaskAdded(); // Notify parent to refresh tasks
    } catch (error) {
      toast.error("Failed to add task.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full transition duration-300">
      <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">
        Add New Task
      </h2>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Task Title
          </label>
          <input
            type="text"
            className="input input-bordered w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Submit report"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Description
          </label>
          <textarea
            className="textarea textarea-bordered w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Details about the task..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAddTask}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default AddTaskComponent;
