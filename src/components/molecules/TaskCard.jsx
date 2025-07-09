import { useState } from "react";
import { motion } from "framer-motion";
import { format, isToday, isPast } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";
import IconButton from "@/components/atoms/IconButton";
import { taskService } from "@/services/api/taskService";
import { cn } from "@/utils/cn";

const TaskCard = ({ 
  task, 
  onTaskUpdated, 
  onTaskDeleted, 
  onTaskEdit,
  selected = false,
  onSelectionChange,
  className 
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = async () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    try {
      const updatedTask = await taskService.update(task.Id, {
        completed: !task.completed
      });
      
      onTaskUpdated(updatedTask);
      toast.success(
        task.completed ? "Task marked as incomplete" : "Task completed! 🎉"
      );
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await taskService.delete(task.Id);
      onTaskDeleted(task.Id);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getDueDateColor = () => {
    if (!task.dueDate) return "text-gray-500";
    
    const dueDate = new Date(task.dueDate);
    if (isPast(dueDate) && !isToday(dueDate)) return "text-accent-500";
    if (isToday(dueDate)) return "text-warning";
    return "text-gray-500";
  };

  const getDueDateText = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    if (isToday(dueDate)) return "Today";
    if (isPast(dueDate)) return `Overdue (${format(dueDate, "MMM d")})`;
    return format(dueDate, "MMM d");
  };

  const getPriorityVariant = () => {
    switch (task.priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className={cn(
        "bg-white rounded-lg shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-200 p-4",
        task.completed && "opacity-75",
        selected && "ring-2 ring-primary-500 ring-offset-2",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-3">
          {onSelectionChange && (
            <Checkbox
              checked={selected}
              onChange={(e) => onSelectionChange(task.Id, e.target.checked)}
            />
          )}
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 
              className={cn(
                "font-medium text-gray-900 transition-all duration-200",
                task.completed && "line-through text-gray-500"
              )}
            >
              {task.title}
            </h3>
            
            <div className="flex items-center gap-1">
              <IconButton
                variant="ghost"
                size="small"
                onClick={() => onTaskEdit(task)}
                disabled={isDeleting}
              >
                <ApperIcon name="Edit2" size={16} />
              </IconButton>
              
              <IconButton
                variant="danger"
                size="small"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <ApperIcon name="Trash2" size={16} />
              </IconButton>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={getPriorityVariant()}>
              {task.priority}
            </Badge>
            
            {task.dueDate && (
              <div className={cn("flex items-center gap-1 text-sm", getDueDateColor())}>
                <ApperIcon name="Calendar" size={14} />
                <span>{getDueDateText()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;