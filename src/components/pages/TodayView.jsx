import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { isToday, format } from "date-fns";
import TaskList from "@/components/organisms/TaskList";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import ProgressRing from "@/components/molecules/ProgressRing";
import { taskService } from "@/services/api/taskService";
import useTaskFilters from "@/hooks/useTaskFilters";

const TodayView = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { filters, filteredTasks, updateFilters } = useTaskFilters(tasks);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const allTasks = await taskService.getAll();
      const todayTasks = allTasks.filter(task => {
        return task.dueDate && isToday(new Date(task.dueDate));
      });
      
      setTasks(todayTasks);
    } catch (err) {
      setError("Failed to load today's tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    // Only add to today's view if the task is due today
    if (newTask.dueDate && isToday(new Date(newTask.dueDate))) {
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      );
      
      // Remove task if it's no longer due today
      if (updatedTask.dueDate && !isToday(new Date(updatedTask.dueDate))) {
        return updatedTasks.filter(task => task.Id !== updatedTask.Id);
      }
      
      return updatedTasks;
    });
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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
            Today's Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-elevation-2 p-6 flex items-center gap-6">
          <ProgressRing progress={completionRate} size={80} strokeWidth={8} />
          <div>
            <div className="text-2xl font-bold text-gray-900 font-display">
              {completedTasks} / {totalTasks}
            </div>
            <div className="text-sm text-gray-600">Tasks completed</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Add Task */}
      <QuickAddTask onTaskAdded={handleTaskAdded} />

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

export default TodayView;