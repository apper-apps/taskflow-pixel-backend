import { motion } from "framer-motion";
import PriorityFilter from "@/components/molecules/PriorityFilter";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterBar = ({
  filters,
  onFiltersChange,
  categories = [],
  onClearFilters,
  className
}) => {
  const handleCategoryChange = (categoryId) => {
    const newCategories = categoryId === "all" 
      ? [] 
      : [categoryId];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleDateRangeChange = (dateRange) => {
    onFiltersChange({ ...filters, dateRange });
  };

  const handleShowCompletedChange = (showCompleted) => {
    onFiltersChange({ ...filters, showCompleted });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.priorities.length > 0 ||
    filters.dateRange !== "all" ||
    !filters.showCompleted;

  return (
    <motion.div
      className={cn("bg-white rounded-lg shadow-elevation-1 p-4", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          <Select
            value={filters.categories[0] || "all"}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full sm:w-auto min-w-[140px]"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.Id} value={category.Id}>
                {category.name}
              </option>
            ))}
          </Select>

          <Select
            value={filters.dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="w-full sm:w-auto min-w-[120px]"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this_week">This Week</option>
            <option value="overdue">Overdue</option>
          </Select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showCompleted"
              checked={filters.showCompleted}
              onChange={(e) => handleShowCompletedChange(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="showCompleted" className="text-sm text-gray-700">
              Show completed
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <PriorityFilter
            selectedPriorities={filters.priorities}
            onPriorityChange={(priorities) => 
              onFiltersChange({ ...filters, priorities })
            }
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="small"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <ApperIcon name="X" size={16} />
              Clear
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;