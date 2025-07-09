import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import TaskList from "@/components/organisms/TaskList";
import QuickAddTask from "@/components/molecules/QuickAddTask";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import useTaskFilters from "@/hooks/useTaskFilters";

const CategoryView = () => {
  const { categoryId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { filters, filteredTasks, updateFilters } = useTaskFilters(tasks);

  useEffect(() => {
    loadData();
  }, [categoryId]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [allTasks, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setCategories(categoriesData);
      
      if (categoryId) {
        const category = categoriesData.find(cat => cat.Id === parseInt(categoryId));
        setCurrentCategory(category);
        
        const categoryTasks = allTasks.filter(task => task.categoryId === categoryId);
        setTasks(categoryTasks);
      } else {
        setCurrentCategory(null);
        setTasks(allTasks);
      }
    } catch (err) {
      setError("Failed to load category tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    if (!categoryId || newTask.categoryId === categoryId) {
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      );
      
      // Remove task if it no longer belongs to this category
      if (categoryId && updatedTask.categoryId !== categoryId) {
        return updatedTasks.filter(task => task.Id !== updatedTask.Id);
      }
      
      return updatedTasks;
    });
  };

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId));
  };

  const getPageTitle = () => {
    if (currentCategory) {
      return `${currentCategory.name} Tasks`;
    }
    return "All Categories";
  };

  const getPageDescription = () => {
    if (currentCategory) {
      return `Manage tasks in the ${currentCategory.name} category`;
    }
    return "View and manage tasks across all categories";
  };

  const getTasksByCategory = () => {
    if (categoryId) {
      return filteredTasks;
    }
    
    return categories.reduce((groups, category) => {
      const categoryTasks = filteredTasks.filter(task => task.categoryId === category.Id.toString());
      if (categoryTasks.length > 0) {
        groups[category.Id] = {
          category,
          tasks: categoryTasks
        };
      }
      return groups;
    }, {});
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          {currentCategory && (
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: currentCategory.color }}
            >
              <ApperIcon name={currentCategory.icon} size={24} className="text-white" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 mt-1">
              {getPageDescription()}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-elevation-2 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 font-display">
              {tasks.length}
            </div>
            <div className="text-sm text-gray-600">
              {currentCategory ? "Category" : "Total"} Tasks
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Add Task */}
      <QuickAddTask onTaskAdded={handleTaskAdded} />

      {/* Category Groups or Single List */}
      {categoryId ? (
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
          onRetry={loadData}
          showBulkActions={true}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(getTasksByCategory()).map(([categoryId, { category, tasks }]) => (
            <motion.div
              key={categoryId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: category.color }}
                >
                  <ApperIcon name={category.icon} size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 font-display">
                  {category.name}
                </h2>
                <span className="text-sm text-gray-500">
                  ({tasks.length} task{tasks.length === 1 ? '' : 's'})
                </span>
              </div>
              
              <TaskList
                tasks={tasks}
                loading={false}
                error=""
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
                showBulkActions={false}
              />
            </motion.div>
          ))}
          
          {Object.keys(getTasksByCategory()).length === 0 && !loading && (
            <TaskList
              tasks={[]}
              loading={loading}
              error={error}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              onRetry={loadData}
              showBulkActions={false}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryView;