import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { isAfter, startOfDay, format, addDays } from "date-fns";
import TaskList from "@/components/organisms/TaskList";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import { taskService } from "@/services/api/taskService";
import useTaskFilters from "@/hooks/useTaskFilters";

const UpcomingView = () => {
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
const upcomingTasks = allTasks.filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const tomorrow = startOfDay(addDays(new Date(), 1));
        return isAfter(taskDate, tomorrow);
      });
      
      // Sort by due date
      upcomingTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      
      setTasks(upcomingTasks);
    } catch (err) {
      setError("Failed to load upcoming tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    if (newTask.dueDate) {
      const taskDate = new Date(newTask.dueDate);
      const tomorrow = startOfDay(addDays(new Date(), 1));
      
      if (isAfter(taskDate, tomorrow)) {
        setTasks(prev => {
          const newTasks = [newTask, ...prev];
          return newTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        });
      }
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => {
      let updatedTasks = prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      );
      
      // Remove task if it's no longer upcoming
      if (updatedTask.dueDate) {
        const taskDate = new Date(updatedTask.dueDate);
        const tomorrow = startOfDay(addDays(new Date(), 1));
        
        if (!isAfter(taskDate, tomorrow)) {
          updatedTasks = updatedTasks.filter(task => task.Id !== updatedTask.Id);
        }
      } else {
        updatedTasks = updatedTasks.filter(task => task.Id !== updatedTask.Id);
      }
      
      // Re-sort by due date
      return updatedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    });
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = format(new Date(task.dueDate), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

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
            Upcoming Tasks
          </h1>
          <p className="text-gray-600 mt-1">
            Tasks scheduled for the future
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-elevation-2 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 font-display">
              {tasks.length}
            </div>
            <div className="text-sm text-gray-600">Upcoming Tasks</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Add Task */}
      <QuickAddTask onTaskAdded={handleTaskAdded} />

      {/* Grouped Task Lists */}
      <div className="space-y-8">
        {Object.entries(groupedTasks).map(([date, dateTasks]) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-900 font-display flex items-center gap-2">
              <span>{format(new Date(date), "EEEE, MMMM d")}</span>
              <span className="text-sm text-gray-500 font-normal">
                ({dateTasks.length} task{dateTasks.length === 1 ? '' : 's'})
              </span>
            </h2>
            
            <TaskList
              tasks={dateTasks}
              loading={false}
              error=""
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              showBulkActions={false}
            />
          </motion.div>
        ))}
      </div>

      {/* Show regular task list if no grouping needed */}
      {Object.keys(groupedTasks).length === 0 && (
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
          onRetry={loadData}
          showBulkActions={true}
        />
      )}
    </div>
  );
};

export default UpcomingView;