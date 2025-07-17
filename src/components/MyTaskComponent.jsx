import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import {
  updateTaskInFirestore,
  deleteTaskFromFirestore,
} from "../services/taskService";
import { auth } from "../firebase";
import toast from "react-hot-toast";

const MyTaskComponent = ({ tasks, loading, onTaskUpdated }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  const user = auth.currentUser;
  console.log("🔥 Current user:", user);
  console.log("📦 All tasks passed as props:", tasks);

  // ✅ Filter by current user's tasks
  const userTasks = tasks?.filter((task) => task.createdBy === user?.uid) || [];

  // ✅ Sort: incomplete first, then completed
  const sortedTasks = [...userTasks].sort((a, b) => a.completed - b.completed);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description);
    document.getElementById("update-modal").showModal();
  };

  const handleUpdateTask = async () => {
    try {
      await updateTaskInFirestore(selectedTask.id, {
        title: updatedTitle,
        description: updatedDescription,
      });
      toast.success("Task updated!");
      onTaskUpdated();
      document.getElementById("update-modal").close();
    } catch (err) {
      console.error("❌ Update task error:", err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTaskFromFirestore(id);
      toast.success("Task deleted!");
      onTaskUpdated();
    } catch (err) {
      console.error("❌ Delete task error:", err);
      toast.error("Delete failed");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTaskInFirestore(task.id, {
        completed: !task.completed,
        completedBy: !task.completed ? user?.email || "Unknown User" : "",
        completedAt: !task.completed ? new Date().toISOString() : null,
      });
      toast.success("Task updated!");
      onTaskUpdated();
    } catch (err) {
      console.error("❌ Toggle complete error:", err);
      toast.error("Toggle failed");
    }
  };

  // ✅ Loading state
  if (loading) {
    return <p className="text-gray-600 text-sm">Loading tasks...</p>;
  }

  // ✅ Empty state AFTER filtering by user
  if (userTasks.length === 0) {
    return <p className="text-gray-500 text-sm">You have no tasks yet.</p>;
  }

  return (
    <>
      <div className="grid gap-4">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-xl px-5 py-4 shadow-sm border transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${
              task.completed
                ? "bg-gray-200 text-gray-500 line-through border-gray-300"
                : "bg-white text-gray-900 dark:bg-green-800 dark:text-white border-green-200 dark:border-green-600"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-lg font-semibold">{task.title}</h1>
                <p className="text-sm mt-1">{task.description}</p>

                {task.completed && (
                  <p className="text-xs mt-3 italic text-gray-600 dark:text-gray-300">
                    ✅ Completed by: {task.completedBy || "N/A"} <br />
                    📅 {new Date(task.completedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 ml-4">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                    task.completed
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {task.completed ? "Mark Incomplete" : "Mark Done"}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-medium"
                  >
                    <FaRegEdit className="text-sm" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium"
                  >
                    <MdDeleteOutline className="text-sm" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <dialog id="update-modal" className="modal">
        <div className="modal-box bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-lg max-w-md">
          <h3 className="font-semibold text-xl mb-4">Edit Task</h3>

          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="input input-bordered w-full mb-4 rounded-lg bg-white dark:bg-gray-800"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />

          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="textarea textarea-bordered w-full mb-4 rounded-lg bg-white dark:bg-gray-800"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          ></textarea>

          <div className="modal-action flex justify-end gap-2">
            <button
              className="btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              onClick={handleUpdateTask}
            >
              Save
            </button>
            <button
              className="btn border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg"
              onClick={() => document.getElementById("update-modal").close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MyTaskComponent;


