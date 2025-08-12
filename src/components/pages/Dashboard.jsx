import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TaskList from "@/components/organisms/TaskList";
import FilterBar from "@/components/molecules/FilterBar";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import useTaskFilters from "@/hooks/useTaskFilters";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { filters, filteredTasks, updateFilters, clearFilters } = useTaskFilters(tasks);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            All Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and organize your tasks efficiently
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-elevation-2 p-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
<div className="text-2xl font-bold text-primary-600 font-display">
                {tasks.filter(t => !t.completed).length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success font-display">
                {tasks.filter(t => t.completed).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 font-display">
                {tasks.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Add Task */}
      <QuickAddTask onTaskAdded={handleTaskAdded} />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={updateFilters}
        categories={categories}
        onClearFilters={clearFilters}
      />

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        loading={loading}
        error={error}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
        onRetry={loadData}
        showBulkActions={true}
      />
    </div>
  );
};

export default Dashboard;