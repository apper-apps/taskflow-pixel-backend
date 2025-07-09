import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className, 
  checked = false,
  onChange,
  ...props 
}, ref) => {
  return (
    <motion.div 
      className={cn("relative inline-flex items-center justify-center", className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <motion.div
        className={cn(
          "w-5 h-5 border-2 rounded-md cursor-pointer transition-all duration-200",
          checked
            ? "bg-gradient-to-r from-primary-500 to-primary-600 border-primary-500 shadow-elevation-2"
            : "bg-white border-gray-300 hover:border-primary-400"
        )}
        initial={false}
        animate={{
          scale: checked ? 1.1 : 1,
          backgroundColor: checked ? "#5B4FE9" : "#ffffff"
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-center w-full h-full"
          >
            <ApperIcon name="Check" size={12} className="text-white" />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;