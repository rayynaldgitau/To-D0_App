import React, { useEffect, useState } from "react";
import MyTaskComponent from "../components/MyTaskComponent";
import AddTaskComponent from "../components/AddTaskComponent";
import NavbarComponent from "../components/NavbarComponent";
import { getAllTasks } from "../services/taskService";
import { auth } from "../firebase"; // ✅ import auth to get current user

const HomePage = ({ theme, setTheme }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    console.log("📣 fetchTasks called");
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("No user is logged in.");
        setTasks([]);
        return;
      }

      const data = await getAllTasks(); // ✅ Fetch only this user's tasks
      console.log("Fetched tasks:", data);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-tr from-white via-green-50 to-white text-gray-900'}`}>
      {/* Navbar */}
      <NavbarComponent theme={theme} setTheme={setTheme} />

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-6 px-4 sm:px-6 lg:px-12 xl:px-20 py-8 w-full max-w-[1600px] mx-auto">
        
        {/* Add Task Panel */}
        <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-green-200 dark:border-green-700 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4 border-b border-green-100 dark:border-green-700 pb-2">Add New Task</h2>
          <AddTaskComponent onTaskAdded={fetchTasks} />
        </div>

        {/* My Tasks Panel */}
        <div className="w-full md:w-2/3 bg-green-50 dark:bg-green-900 rounded-2xl p-6 shadow-xl border border-green-100 dark:border-green-700 overflow-auto">
          <h1 className="text-2xl font-extrabold text-green-800 dark:text-green-100 mb-4 tracking-wide">
            My Tasks
          </h1>
          <MyTaskComponent tasks={tasks} loading={loading} onTaskUpdated={fetchTasks} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
