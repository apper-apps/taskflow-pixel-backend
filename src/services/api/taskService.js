import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(task => task.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updateData) {
    await delay(300);
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) return null;
    
    const updatedTask = { ...tasks[index], ...updateData };
    
    // If marking as completed, set completedAt timestamp
    if (updateData.completed === true && !tasks[index].completed) {
      updatedTask.completedAt = new Date().toISOString();
    }
    
    // If marking as incomplete, clear completedAt
    if (updateData.completed === false) {
      updatedTask.completedAt = null;
    }
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) return false;
    
    tasks.splice(index, 1);
    return true;
  },

  async bulkUpdate(ids, updateData) {
    await delay(400);
    const updatedTasks = [];
    
    for (const id of ids) {
      const index = tasks.findIndex(task => task.Id === parseInt(id));
      if (index !== -1) {
        const updatedTask = { ...tasks[index], ...updateData };
        
        // Handle completion timestamp
        if (updateData.completed === true && !tasks[index].completed) {
          updatedTask.completedAt = new Date().toISOString();
        } else if (updateData.completed === false) {
          updatedTask.completedAt = null;
        }
        
        tasks[index] = updatedTask;
        updatedTasks.push({ ...updatedTask });
      }
    }
    
    return updatedTasks;
  },

  async bulkDelete(ids) {
    await delay(350);
    const deletedIds = [];
    
    for (const id of ids) {
      const index = tasks.findIndex(task => task.Id === parseInt(id));
      if (index !== -1) {
        tasks.splice(index, 1);
        deletedIds.push(parseInt(id));
      }
    }
    
    return deletedIds;
  }
};