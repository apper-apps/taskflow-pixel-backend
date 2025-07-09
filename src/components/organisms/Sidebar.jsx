import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/molecules/ProgressRing";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose, className }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, categoriesData] = await Promise.all([
          taskService.getAll(),
          categoryService.getAll()
        ]);
        setTasks(tasksData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load sidebar data:", error);
      }
    };

    loadData();
  }, []);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString();
  }).length;

  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate > today;
  }).length;

  const navigationItems = [
    { 
      path: "/", 
      label: "All Tasks", 
      icon: "List", 
      count: totalTasks,
      exact: true
    },
    { 
      path: "/today", 
      label: "Today", 
      icon: "Calendar", 
      count: todayTasks
    },
    { 
      path: "/upcoming", 
      label: "Upcoming", 
      icon: "Clock", 
      count: upcomingTasks
    },
    { 
      path: "/archive", 
      label: "Archive", 
      icon: "Archive", 
      count: completedTasks
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Progress Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Today's Progress</h3>
          <ProgressRing progress={completionRate} size={50} strokeWidth={4} />
        </div>
        <div className="text-sm text-gray-600">
          {completedTasks} of {totalTasks} tasks completed
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Views
          </h4>
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-elevation-2"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )
              }
            >
              <div className="flex items-center gap-3">
                <ApperIcon name={item.icon} size={18} />
                <span>{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Categories
          </h4>
          <NavLink
            to="/categories"
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-elevation-2"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )
            }
          >
            <div className="flex items-center gap-3">
              <ApperIcon name="Folder" size={18} />
              <span>All Categories</span>
            </div>
          </NavLink>
          
          {categories.map((category) => {
            const categoryTasks = tasks.filter(task => task.categoryId === category.Id.toString());
            return (
              <NavLink
                key={category.Id}
                to={`/categories/${category.Id}`}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ml-4",
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-elevation-2"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </div>
                {categoryTasks.length > 0 && (
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {categoryTasks.length}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-full", className)}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="relative flex flex-col w-64 bg-white shadow-elevation-4 h-full"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
                    <ApperIcon name="CheckSquare" size={20} className="text-white" />
                  </div>
                  <h1 className="text-lg font-bold font-display bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
            
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;