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
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTaskFromFirestore(id);
      toast.success("Task deleted!");
      onTaskUpdated();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const user = auth.currentUser;
      await updateTaskInFirestore(task.id, {
        completed: !task.completed,
        completedBy: !task.completed ? user?.email || "Unknown User" : "",
        completedAt: !task.completed ? new Date().toISOString() : null,
      });
      toast.success("Task updated!");
      onTaskUpdated();
    } catch {
      toast.error("Toggle failed");
    }
  };

  if (loading) return <p className="text-gray-600 text-sm">Loading tasks...</p>;
  if (!tasks || tasks.length === 0)
    return <p className="text-gray-500 text-sm">No tasks available.</p>;

  // Sort: incomplete first
  const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

  return (
    <>
      <div className="grid gap-4">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-lg p-4 shadow-md transition hover:shadow-lg hover:scale-[1.01] ${
              task.completed
                ? "bg-gray-300 text-gray-500 line-through"
                : "bg-green-700 text-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-semibold">{task.title}</h1>
                <p className="text-sm mt-1">{task.description}</p>
                {task.completed && (
                  <p className="text-xs mt-2 italic">
                    ✅ Completed by: {task.completedBy || "N/A"} <br />
                    📅 {new Date(task.completedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    task.completed
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {task.completed ? "Mark Incomplete" : "Mark Done"}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-900 hover:bg-green-800 text-white rounded-md text-sm"
                  >
                    <FaRegEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                  >
                    <MdDeleteOutline /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for editing */}
      <dialog id="update-modal" className="modal">
        <div className="modal-box bg-white dark:bg-gray-800 text-black dark:text-white">
          <h3 className="font-bold text-lg mb-2">Edit Task</h3>

          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="input input-bordered w-full mb-3"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />

          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="textarea textarea-bordered w-full mb-4"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          ></textarea>

          <div className="modal-action">
            <button className="btn btn-primary text-white" onClick={handleUpdateTask}>
              Save
            </button>
            <button
              className="btn"
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
