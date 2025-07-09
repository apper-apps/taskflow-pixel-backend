import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const PriorityFilter = ({ 
  selectedPriorities = [], 
  onPriorityChange, 
  className 
}) => {
  const priorities = [
    { value: "high", label: "High", variant: "high" },
    { value: "medium", label: "Medium", variant: "medium" },
    { value: "low", label: "Low", variant: "low" }
  ];

  const togglePriority = (priority) => {
    const newPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter(p => p !== priority)
      : [...selectedPriorities, priority];
    onPriorityChange(newPriorities);
  };

  return (
    <motion.div 
      className={cn("flex flex-wrap gap-2", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <span className="text-sm font-medium text-gray-700 flex items-center">
        Priority:
      </span>
      {priorities.map((priority) => (
        <motion.button
          key={priority.value}
          onClick={() => togglePriority(priority.value)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "transition-all duration-200",
            selectedPriorities.includes(priority.value)
              ? "ring-2 ring-primary-500 ring-offset-1"
              : "opacity-60 hover:opacity-100"
          )}
        >
          <Badge variant={priority.variant}>
            {priority.label}
          </Badge>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default PriorityFilter;