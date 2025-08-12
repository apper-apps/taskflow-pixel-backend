import { toast } from "react-toastify";
import React from "react";

export const categoryService = {
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
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "order_c" } }
        ],
        orderBy: [
          {
            fieldName: "order_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords("category_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI expected format
      const mappedCategories = response.data.map(category => ({
        Id: category.Id,
        name: category.Name || "",
        color: category.color_c || "#5B4FE9",
        icon: category.icon_c || "Folder",
        order: category.order_c || 1
      }));

      return mappedCategories.sort((a, b) => a.order - b.order);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
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
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "order_c" } }
        ]
      };

      const response = await apperClient.getRecordById("category_c", parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      const category = response.data;
      return {
        Id: category.Id,
        name: category.Name || "",
        color: category.color_c || "#5B4FE9",
        icon: category.icon_c || "Folder",
        order: category.order_c || 1
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI fields to database fields (only Updateable fields)
      const dbCategoryData = {
        Name: categoryData.name || "Untitled Category",
        color_c: categoryData.color || "#5B4FE9",
        icon_c: categoryData.icon || "Folder",
        order_c: categoryData.order || 1
      };

      const params = {
        records: [dbCategoryData]
      };

      const response = await apperClient.createRecord("category_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} category records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const createdCategory = successfulRecords[0].data;
          return {
            Id: createdCategory.Id,
            name: createdCategory.Name || "",
            color: createdCategory.color_c || "#5B4FE9",
            icon: createdCategory.icon_c || "Folder",
            order: createdCategory.order_c || 1
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
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

      if (updateData.name !== undefined) {
        dbUpdateData.Name = updateData.name;
      }
      if (updateData.color !== undefined) {
        dbUpdateData.color_c = updateData.color;
      }
      if (updateData.icon !== undefined) {
        dbUpdateData.icon_c = updateData.icon;
      }
      if (updateData.order !== undefined) {
        dbUpdateData.order_c = updateData.order;
      }

      const params = {
        records: [dbUpdateData]
      };

      const response = await apperClient.updateRecord("category_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} category records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedCategory = successfulUpdates[0].data;
          return {
            Id: updatedCategory.Id,
            name: updatedCategory.Name || "",
            color: updatedCategory.color_c || "#5B4FE9",
            icon: updatedCategory.icon_c || "Folder",
            order: updatedCategory.order_c || 1
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord("category_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} category records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
return false;
    }
  }
};