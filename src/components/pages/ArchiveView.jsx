import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import TaskList from "@/components/organisms/TaskList";
import FilterBar from "@/components/molecules/FilterBar";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import useTaskFilters from "@/hooks/useTaskFilters";

const ArchiveView = () => {
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
      const [allTasks, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      const completedTasks = allTasks.filter(task => task.completed);
      
      // Sort by completion date (most recent first)
      completedTasks.sort((a, b) => {
        if (!a.completedAt && !b.completedAt) return 0;
        if (!a.completedAt) return 1;
        if (!b.completedAt) return -1;
        return new Date(b.completedAt) - new Date(a.completedAt);
      });
      
      setTasks(completedTasks);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load archived tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    if (updatedTask.completed) {
      setTasks(prev => {
        const updatedTasks = prev.map(task => 
          task.Id === updatedTask.Id ? updatedTask : task
        );
        
        // Re-sort by completion date
        return updatedTasks.sort((a, b) => {
          if (!a.completedAt && !b.completedAt) return 0;
          if (!a.completedAt) return 1;
          if (!b.completedAt) return -1;
          return new Date(b.completedAt) - new Date(a.completedAt);
        });
      });
    } else {
      // Remove from archive if marked as incomplete
      setTasks(prev => prev.filter(task => task.Id !== updatedTask.Id));
    }
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    if (!task.completedAt) return groups;
    
    const date = format(new Date(task.completedAt), "yyyy-MM-dd");
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
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-success to-green-600 p-3 rounded-lg">
            <ApperIcon name="Archive" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              Archive
            </h1>
            <p className="text-gray-600 mt-1">
              Completed tasks and achievements
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-elevation-2 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success font-display">
              {tasks.length}
            </div>
            <div className="text-sm text-gray-600">Completed Tasks</div>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <FilterBar
        filters={{ ...filters, showCompleted: true }}
        onFiltersChange={updateFilters}
        categories={categories}
        onClearFilters={clearFilters}
      />

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
              <ApperIcon name="Calendar" size={20} className="text-gray-500" />
              <span>Completed on {format(new Date(date), "EEEE, MMMM d, yyyy")}</span>
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

export default ArchiveView;