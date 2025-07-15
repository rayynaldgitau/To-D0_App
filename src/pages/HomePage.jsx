import React, { useEffect, useState } from "react";
import MyTaskComponent from "../components/MyTaskComponent";
import AddTaskComponent from "../components/AddTaskComponent";
import NavbarComponent from "../components/NavbarComponent";
import { getAllTasks } from "../services/taskService";

const HomePage = ({ theme, setTheme }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks();
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
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <NavbarComponent theme={theme} setTheme={setTheme} />

      <div className="flex flex-col md:flex-row gap-6 px-4 sm:px-6 lg:px-12 xl:px-20 py-6 w-full max-w-[1600px] mx-auto">
        {/* Add Task */}
        <div className="w-full md:w-1/3">
          <AddTaskComponent onTaskAdded={fetchTasks} />
        </div>

        {/* My Tasks */}
        <div className="w-full md:w-2/3 bg-green-100 dark:bg-green-900 rounded-xl p-4 shadow-md overflow-auto">
          <h1 className="text-green-900 dark:text-green-100 font-bold text-xl sm:text-2xl mb-4">My Tasks</h1>
          <MyTaskComponent tasks={tasks} loading={loading} onTaskUpdated={fetchTasks} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
