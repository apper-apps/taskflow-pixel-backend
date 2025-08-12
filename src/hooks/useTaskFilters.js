import { useState, useMemo } from "react";
import { isToday, isTomorrow, startOfWeek, endOfWeek, isPast } from "date-fns";

const useTaskFilters = (tasks) => {
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    priorities: [],
    dateRange: "all",
    showCompleted: true
  });

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks.filter(task => {
      // Search filter
if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
if (filters.categories.length > 0 && !filters.categories.includes(task.categoryId)) {
        return false;
      }

      // Priority filter
if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }

      // Completed filter
      if (!filters.showCompleted && task.completed) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== "all" && task.dueDate) {
        const taskDate = new Date(task.dueDate);
        const today = new Date();

        switch (filters.dateRange) {
          case "today":
            if (!isToday(taskDate)) return false;
            break;
          case "tomorrow":
            if (!isTomorrow(taskDate)) return false;
            break;
          case "this_week":
            const weekStart = startOfWeek(today);
            const weekEnd = endOfWeek(today);
            if (taskDate < weekStart || taskDate > weekEnd) return false;
            break;
          case "overdue":
            if (!isPast(taskDate) || isToday(taskDate)) return false;
            break;
        }
      } else if (filters.dateRange !== "all" && !task.dueDate) {
        return false;
      }

      return true;
    });
  }, [tasks, filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      priorities: [],
      dateRange: "all",
      showCompleted: true
    });
  };

  return {
    filters,
    filteredTasks,
    updateFilters,
    clearFilters
  };
};

export default useTaskFilters;