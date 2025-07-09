import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const IconButton = forwardRef(({ 
  children, 
  className, 
  variant = "ghost",
  size = "medium",
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 shadow-elevation-2 hover:shadow-elevation-3",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-500 shadow-elevation-2 hover:shadow-elevation-3",
    ghost: "text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "text-accent-500 hover:text-accent-700 hover:bg-accent-50 focus:ring-accent-500"
  };
  
  const sizes = {
    small: "p-1",
    medium: "p-2",
    large: "p-3"
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

IconButton.displayName = "IconButton";

export default IconButton;