import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { taskService } from "@/services/api/taskService";
import { cn } from "@/utils/cn";

const QuickAddTask = ({ onTaskAdded, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const newTask = await taskService.create({
        title: title.trim(),
        completed: false,
        priority: "medium",
        dueDate: null,
        categoryId: "1"
      });
      
      setTitle("");
      setIsExpanded(false);
      onTaskAdded(newTask);
      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <motion.button
        onClick={() => setIsExpanded(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 text-gray-600 hover:text-primary-600 w-full",
          className
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <ApperIcon name="Plus" size={20} />
        <span className="font-medium">Add a task</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white rounded-lg shadow-elevation-2 p-4", className)}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="focus:ring-primary-500 focus:border-primary-500"
          autoFocus
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!title.trim() || loading}
            loading={loading}
            size="small"
            className="flex-1"
          >
            Add Task
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            size="small"
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default QuickAddTask;