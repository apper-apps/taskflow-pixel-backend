import { toast } from "react-toastify";

export const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords("task_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI expected format
      const mappedTasks = response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || "",
        completed: task.completed_c || false,
        priority: task.priority_c || "medium",
        dueDate: task.due_date_c || null,
        categoryId: task.category_id_c?.toString() || null,
        createdAt: task.created_at_c || task.CreatedOn,
        completedAt: task.completed_at_c || null
      }));

      return mappedTasks;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } }
        ]
      };

      const response = await apperClient.getRecordById("task_c", parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || "",
        completed: task.completed_c || false,
        priority: task.priority_c || "medium",
        dueDate: task.due_date_c || null,
        categoryId: task.category_id_c?.toString() || null,
        createdAt: task.created_at_c || task.CreatedOn,
        completedAt: task.completed_at_c || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields (only Updateable fields)
      const dbTaskData = {
        Name: taskData.title || "Untitled Task",
        title_c: taskData.title || "",
        completed_c: taskData.completed || false,
        priority_c: taskData.priority || "medium",
        due_date_c: taskData.dueDate || null,
        category_id_c: taskData.categoryId ? parseInt(taskData.categoryId) : null,
        created_at_c: new Date().toISOString(),
        completed_at_c: taskData.completed ? new Date().toISOString() : null
      };

      const params = {
        records: [dbTaskData]
      };

const response = await apperClient.createRecord("task_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} task records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          const formattedTask = {
            Id: createdTask.Id,
            title: createdTask.title_c || "",
            completed: createdTask.completed_c || false,
            priority: createdTask.priority_c || "medium",
            dueDate: createdTask.due_date_c || null,
            categoryId: createdTask.category_id_c?.toString() || null,
            createdAt: createdTask.created_at_c || createdTask.CreatedOn,
            completedAt: createdTask.completed_at_c || null
          };

          // Send task data to webhook via Edge Function (fire-and-forget)
          try {
            const { ApperClient } = window.ApperSDK;
            const webhookClient = new ApperClient({
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
            });

            const webhookResponse = await webhookClient.functions.invoke(
              import.meta.env.VITE_SEND_TASK_WEBHOOK,
              {
                body: JSON.stringify(formattedTask),
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            // Log webhook errors but don't throw - task creation should succeed regardless
            if (!webhookResponse.success) {
              console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_TASK_WEBHOOK}. The response body is: ${JSON.stringify(webhookResponse)}.`);
            }
          } catch (webhookError) {
            // Log webhook invocation errors but don't throw
            console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SEND_TASK_WEBHOOK}. The error is: ${webhookError.message}`);
          }

          return formattedTask;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields (only Updateable fields)
      const dbUpdateData = {
        Id: parseInt(id)
      };

      if (updateData.title !== undefined) {
        dbUpdateData.Name = updateData.title;
        dbUpdateData.title_c = updateData.title;
      }
      if (updateData.completed !== undefined) {
        dbUpdateData.completed_c = updateData.completed;
        // Handle completion timestamp
        if (updateData.completed) {
          dbUpdateData.completed_at_c = new Date().toISOString();
        } else {
          dbUpdateData.completed_at_c = null;
        }
      }
      if (updateData.priority !== undefined) {
        dbUpdateData.priority_c = updateData.priority;
      }
      if (updateData.dueDate !== undefined) {
        dbUpdateData.due_date_c = updateData.dueDate;
      }
      if (updateData.categoryId !== undefined) {
        dbUpdateData.category_id_c = updateData.categoryId ? parseInt(updateData.categoryId) : null;
      }

      const params = {
        records: [dbUpdateData]
      };

      const response = await apperClient.updateRecord("task_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} task records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          return {
            Id: updatedTask.Id,
            title: updatedTask.title_c || "",
            completed: updatedTask.completed_c || false,
            priority: updatedTask.priority_c || "medium",
            dueDate: updatedTask.due_date_c || null,
            categoryId: updatedTask.category_id_c?.toString() || null,
            createdAt: updatedTask.created_at_c || updatedTask.CreatedOn,
            completedAt: updatedTask.completed_at_c || null
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord("task_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} task records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async bulkUpdate(ids, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const records = ids.map(id => {
        const dbUpdateData = {
          Id: parseInt(id)
        };

        if (updateData.completed !== undefined) {
          dbUpdateData.completed_c = updateData.completed;
          if (updateData.completed) {
            dbUpdateData.completed_at_c = new Date().toISOString();
          } else {
            dbUpdateData.completed_at_c = null;
          }
        }
        if (updateData.priority !== undefined) {
          dbUpdateData.priority_c = updateData.priority;
        }
        if (updateData.categoryId !== undefined) {
          dbUpdateData.category_id_c = updateData.categoryId ? parseInt(updateData.categoryId) : null;
        }

        return dbUpdateData;
      });

      const params = { records };
      const response = await apperClient.updateRecord("task_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to bulk update ${failedUpdates.length} task records:${JSON.stringify(failedUpdates)}`);
        }

        return successfulUpdates.map(result => ({
          Id: result.data.Id,
          title: result.data.title_c || "",
          completed: result.data.completed_c || false,
          priority: result.data.priority_c || "medium",
          dueDate: result.data.due_date_c || null,
          categoryId: result.data.category_id_c?.toString() || null,
          createdAt: result.data.created_at_c || result.data.CreatedOn,
          completedAt: result.data.completed_at_c || null
        }));
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk updating tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async bulkDelete(ids) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };

      const response = await apperClient.deleteRecord("task_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to bulk delete ${failedDeletions.length} task records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.map(result => parseInt(result.recordId));
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error bulk deleting tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};