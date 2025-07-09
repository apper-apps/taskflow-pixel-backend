import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { cn } from "@/utils/cn";

const Header = ({ 
  onSearch, 
  onQuickAdd, 
  onMobileMenuToggle,
  className 
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white shadow-elevation-1 border-b border-gray-100",
        className
      )}
    >
      <div className="px-4 py-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Menu" size={24} className="text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
                <ApperIcon name="CheckSquare" size={24} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-sm text-gray-600">Effortless task management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-md">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search tasks..."
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={onQuickAdd}
              className="flex items-center gap-2"
              size="medium"
            >
              <ApperIcon name="Plus" size={20} />
              <span className="hidden sm:inline">Add Task</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;