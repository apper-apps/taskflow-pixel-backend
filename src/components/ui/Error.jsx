import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
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
      <div className="bg-gradient-to-r from-accent-100 to-accent-200 p-6 rounded-full mb-6">
        <ApperIcon name="AlertCircle" size={48} className="text-accent-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2 font-display">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          className="flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;