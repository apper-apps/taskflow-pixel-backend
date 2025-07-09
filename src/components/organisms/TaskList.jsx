import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import BulkActions from "@/components/molecules/BulkActions";
import TaskEditorModal from "@/components/organisms/TaskEditorModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const TaskList = ({
  tasks,
  loading,
  error,
  onTaskUpdated,
  onTaskDeleted,
  onRetry,
  showBulkActions = false,
  className
}) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const handleSelectionChange = (taskId, isSelected) => {
    setSelectedTasks(prev => 
      isSelected 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
    );
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
  };

  const handleTaskEdit = (task) => {
    setEditingTask(task);
  };

  const handleTaskEditorClose = () => {
    setEditingTask(null);
  };

  const handleTaskSaved = (updatedTask) => {
    onTaskUpdated(updatedTask);
    setEditingTask(null);
  };

  const handleBulkTasksUpdated = (updatedTasks) => {
    updatedTasks.forEach(task => onTaskUpdated(task));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={onRetry} />;
  if (!tasks || tasks.length === 0) return <Empty />;

  return (
    <div className={cn("space-y-4", className)}>
      <AnimatePresence>
        {showBulkActions && selectedTasks.length > 0 && (
          <BulkActions
            selectedTasks={selectedTasks}
            onTasksUpdated={handleBulkTasksUpdated}
            onClearSelection={handleClearSelection}
          />
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard
              key={task.Id}
              task={task}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
              onTaskEdit={handleTaskEdit}
              selected={selectedTasks.includes(task.Id)}
              onSelectionChange={showBulkActions ? handleSelectionChange : undefined}
            />
          ))}
        </AnimatePresence>
      </div>

      <TaskEditorModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={handleTaskEditorClose}
        onTaskSaved={handleTaskSaved}
      />
    </div>
  );
};

export default TaskList;