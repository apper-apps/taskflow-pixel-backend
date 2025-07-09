import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { cn } from "@/utils/cn";

const BulkActions = ({ 
  selectedTasks, 
  onTasksUpdated, 
  onClearSelection,
  className 
}) => {
  const handleBulkComplete = async (completed) => {
    try {
      const updatedTasks = await taskService.bulkUpdate(selectedTasks, { completed });
      onTasksUpdated(updatedTasks);
      onClearSelection();
      toast.success(
        `${selectedTasks.length} task${selectedTasks.length === 1 ? "" : "s"} ${
          completed ? "completed" : "marked as incomplete"
        }`
      );
    } catch (error) {
      toast.error("Failed to update tasks. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedTasks.length} task${selectedTasks.length === 1 ? "" : "s"}?`)) {
      return;
    }

    try {
      await taskService.bulkDelete(selectedTasks);
      onTasksUpdated([]);
      onClearSelection();
      toast.success(
        `${selectedTasks.length} task${selectedTasks.length === 1 ? "" : "s"} deleted`
      );
    } catch (error) {
      toast.error("Failed to delete tasks. Please try again.");
    }
  };

  if (selectedTasks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "bg-white rounded-lg shadow-elevation-2 p-4 border-l-4 border-primary-500",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ApperIcon name="CheckSquare" size={20} className="text-primary-500" />
            <span className="font-medium text-gray-900">
              {selectedTasks.length} task{selectedTasks.length === 1 ? "" : "s"} selected
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="small"
            onClick={onClearSelection}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="small"
            onClick={() => handleBulkComplete(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Check" size={16} />
            Complete
          </Button>
          
          <Button
            variant="outline"
            size="small"
            onClick={() => handleBulkComplete(false)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={16} />
            Incomplete
          </Button>
          
          <Button
            variant="danger"
            size="small"
            onClick={handleBulkDelete}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Trash2" size={16} />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BulkActions;