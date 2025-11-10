import { getApperClient } from "@/services/apperClient";
export const projectService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Name_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "milestone_c"}}
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
        description: project.description_c || '',
        startDate: project.start_date_c || null,
        endDate: project.end_date_c || null,
        milestone: project.milestone_c || '',
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
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "milestone_c"}}
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
        description: response.data.description_c || '',
        startDate: response.data.start_date_c || null,
        endDate: response.data.end_date_c || null,
        milestone: response.data.milestone_c || '',
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
const apperClient = getApperClient();
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: projectData.name,
          Name_c: projectData.name,
          Tags: projectData.tags || "",
          description_c: projectData.description || "",
          start_date_c: projectData.startDate || null,
          end_date_c: projectData.endDate || null,
          milestone_c: projectData.milestone || ""
        }]
      };

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
            description: created.description_c || '',
            startDate: created.start_date_c || null,
            endDate: created.end_date_c || null,
            milestone: created.milestone_c || '',
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
          Tags: updates.tags || "",
          description_c: updates.description || "",
          start_date_c: updates.startDate || null,
          end_date_c: updates.endDate || null,
          milestone_c: updates.milestone || ""
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
            description: updated.description_c || '',
            startDate: updated.start_date_c || null,
            endDate: updated.end_date_c || null,
            milestone: updated.milestone_c || '',
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