import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  className, 
  label,
  error,
  children,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white";
  
  const errorStyles = error ? "border-accent-500 focus:ring-accent-500" : "";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(baseStyles, errorStyles, className)}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-accent-500 mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;