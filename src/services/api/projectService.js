import { getApperClient } from '@/services/apperClient';

export const projectService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{
          "fieldName": "Name",
          "sorttype": "ASC"
        }],
        pagingInfo: {
          "limit": 100,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(project => ({
        id: project.Id,
        name: project.Name_c || project.Name,
        tags: project.Tags,
        // Add color for UI consistency (can be enhanced later)
        color: this.getProjectColor(project.Id)
      }));
    } catch (error) {
      console.error("Error fetching projects:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };

      const response = await apperClient.getRecordById('project_c', id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        return null;
      }

      // Transform data to match UI expectations
      return {
        id: response.data.Id,
        name: response.data.Name_c || response.data.Name,
        tags: response.data.Tags,
        color: this.getProjectColor(response.data.Id)
      };
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(projectData) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: projectData.name,
          Name_c: projectData.name,
          Tags: projectData.tags || ""
        }]
      };

      const response = await apperClient.createRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} projects:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            id: created.Id,
            name: created.Name_c || created.Name,
            tags: created.Tags,
            color: this.getProjectColor(created.Id)
          };
        }
      }
    } catch (error) {
      console.error("Error creating project:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Id: id,
          Name: updates.name,
          Name_c: updates.name,
          Tags: updates.tags || ""
        }]
      };

      const response = await apperClient.updateRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} projects:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            id: updated.Id,
            name: updated.Name_c || updated.Name,
            tags: updated.Tags,
            color: this.getProjectColor(updated.Id)
          };
        }
      }
    } catch (error) {
      console.error("Error updating project:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = { 
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('project_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} projects:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting project:", error?.response?.data?.message || error);
      throw error;
    }
  },

  // Helper method to assign colors to projects for UI consistency
  getProjectColor(projectId) {
    const colors = [
      "#6366f1", // indigo
      "#10b981", // emerald  
      "#f59e0b", // amber
      "#ef4444", // red
      "#8b5cf6", // violet
      "#06b6d4", // cyan
      "#059669", // emerald-600
      "#ec4899"  // pink
    ];
    return colors[projectId % colors.length];
  }
};