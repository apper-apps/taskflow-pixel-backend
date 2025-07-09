import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import IconButton from "@/components/atoms/IconButton";
import { taskService } from "@/services/api/taskService";
import { categoryService } from "@/services/api/categoryService";
import { cn } from "@/utils/cn";

const TaskEditorModal = ({ 
  isOpen, 
  task = null, 
  onClose, 
  onTaskSaved 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    priority: "medium",
    dueDate: "",
    categoryId: "1"
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (task) {
        setFormData({
          title: task.title,
          priority: task.priority,
          dueDate: task.dueDate || "",
          categoryId: task.categoryId
        });
      } else {
        setFormData({
          title: "",
          priority: "medium",
          dueDate: "",
          categoryId: "1"
        });
      }
      setErrors({});
    }
  }, [isOpen, task]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        dueDate: formData.dueDate || null
      };

      let savedTask;
      if (task) {
        savedTask = await taskService.update(task.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        savedTask = await taskService.create({
          ...taskData,
          completed: false
        });
        toast.success("Task created successfully!");
      }

      onTaskSaved(savedTask);
    } catch (error) {
      toast.error("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-elevation-4 w-full max-w-md max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 font-display">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <IconButton
              variant="ghost"
              size="small"
              onClick={handleClose}
              disabled={loading}
            >
              <ApperIcon name="X" size={20} />
            </IconButton>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              label="Title"
              type="text"
              placeholder="What needs to be done?"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={errors.title}
              autoFocus
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                error={errors.priority}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>

              <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                error={errors.dueDate}
              />
            </div>

            <Select
              label="Category"
              value={formData.categoryId}
              onChange={(e) => handleInputChange("categoryId", e.target.value)}
              error={errors.categoryId}
            >
              {categories.map((category) => (
                <option key={category.Id} value={category.Id}>
                  {category.name}
                </option>
              ))}
            </Select>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                className="flex-1"
              >
                {task ? "Update Task" : "Create Task"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskEditorModal;