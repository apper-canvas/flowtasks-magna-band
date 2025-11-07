import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

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
}

export default new CategoryService();