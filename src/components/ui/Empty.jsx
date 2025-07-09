import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No tasks yet", 
  message = "Create your first task to get started with TaskFlow.",
  actionLabel = "Create Task",
  onAction,
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="bg-gradient-to-r from-primary-100 to-primary-200 p-8 rounded-full mb-6">
        <ApperIcon name="CheckSquare" size={64} className="text-primary-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}
      </p>

      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;