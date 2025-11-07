import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";
import Error from "@/components/ui/Error";

class CategoryService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "color_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('category_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      return response.data.map(category => ({
        Id: category.Id,
        id: category.Id, // Keep both for compatibility
        name: category.name_c,
        icon: category.icon_c,
        color: category.color_c
      }));
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error.message);
      toast.error("Failed to load categories");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "color_c"}}
        ]
      };

      const response = await apperClient.getRecordById('category_c', id, params);

      if (!response.success || !response.data) {
        throw new Error(`Category with id ${id} not found`);
      }

      // Transform database fields to match UI expectations
      return {
        Id: response.data.Id,
        id: response.data.Id, // Keep both for compatibility
        name: response.data.name_c,
        icon: response.data.icon_c,
        color: response.data.color_c
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error.message);
      throw error;
}
  }

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // Only include Updateable fields based on schema
      const params = {
        records: [{
          name_c: categoryData.name,
          icon_c: categoryData.icon || 'Tag',
          color_c: categoryData.color || '#6b7280'
        }]
      };

      const response = await apperClient.createRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          });
        }

        if (successful.length > 0) {
          const createdRecord = successful[0].data;
          toast.success('Category created successfully');
          
          // Transform database fields to match UI expectations
          return {
            Id: createdRecord.Id,
            id: createdRecord.Id,
            name: createdRecord.name_c,
            icon: createdRecord.icon_c,
            color: createdRecord.color_c
          };
        }
      }

      throw new Error('Failed to create category');
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error.message);
      if (error.message !== 'ApperClient not available') {
        toast.error("Failed to create category");
      }
      throw error;
    }
  }

  async update(id, categoryData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // Only include Updateable fields based on schema
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: categoryData.name,
          icon_c: categoryData.icon,
          color_c: categoryData.color
        }]
      };

      const response = await apperClient.updateRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          });
        }

        if (successful.length > 0) {
          const updatedRecord = successful[0].data;
          toast.success('Category updated successfully');
          
          // Transform database fields to match UI expectations
          return {
            Id: updatedRecord.Id,
            id: updatedRecord.Id,
            name: updatedRecord.name_c,
            icon: updatedRecord.icon_c,
            color: updatedRecord.color_c
          };
        }
      }

      throw new Error('Failed to update category');
    } catch (error) {
      console.error(`Error updating category ${id}:`, error?.response?.data?.message || error.message);
      if (error.message !== 'ApperClient not available') {
        toast.error("Failed to update category");
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Category deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error?.response?.data?.message || error.message);
      if (error.message !== 'ApperClient not available') {
        toast.error("Failed to delete category");
      }
      return false;
    }
  }
}

export default new CategoryService();