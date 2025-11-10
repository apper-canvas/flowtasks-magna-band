import { getApperClient } from '../apperClient.js';

const taskService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "project_c"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response?.data?.length) {
        return [];
      }

      return response.data.map(task => ({
        id: task.Id,
        name: task.Name || task.title_c,
        title: task.title_c || task.Name,
        tags: task.Tags || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        category: task.category_c?.Id || null,
        projectId: task.project_c?.Id || null,
        dueDate: task.due_date_c || null,
        status: task.status_c || 'active',
        createdAt: task.created_at_c || null,
        completedAt: task.completed_at_c || null,
        order: task.order_c || 0,
        completed: task.status_c === 'completed'
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "project_c"}}
        ]
      };

      const response = await apperClient.getRecordById('task_c', id, params);

      if (!response?.data) {
        return null;
      }

      const task = response.data;
      return {
        id: task.Id,
        name: task.Name || task.title_c,
        title: task.title_c || task.Name,
        tags: task.Tags || '',
        description: task.description_c || '',
        priority: task.priority_c || 'medium',
        category: task.category_c?.Id || null,
        projectId: task.project_c?.Id || null,
        dueDate: task.due_date_c || null,
        status: task.status_c || 'active',
        createdAt: task.created_at_c || null,
        completedAt: task.completed_at_c || null,
        order: task.order_c || 0,
        completed: task.status_c === 'completed'
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

async create(taskData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: taskData.title,
          Tags: taskData.tags || "",
          title_c: taskData.title,
          description_c: taskData.description || "",
          priority_c: taskData.priority || "medium",
          category_c: taskData.category ? parseInt(taskData.category) : null,
          project_c: taskData.projectId ? parseInt(taskData.projectId) : null,
          due_date_c: taskData.dueDate || null,
          status_c: "active",
          created_at_c: new Date().toISOString(),
          order_c: Date.now()
        }]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error("Error creating task:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`Task creation field error - ${error.fieldLabel}: ${error}`);
            });
            if (record.message) console.error(`Task creation error: ${record.message}`);
          });
          return null;
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            id: created.Id,
            name: created.Name || created.title_c,
            title: created.title_c || created.Name,
            tags: created.Tags || '',
            description: created.description_c || '',
            priority: created.priority_c || 'medium',
            category: created.category_c?.Id || null,
            projectId: created.project_c?.Id || null,
            dueDate: created.due_date_c || null,
            status: created.status_c || 'active',
            createdAt: created.created_at_c || null,
            completedAt: created.completed_at_c || null,
            order: created.order_c || 0,
            completed: created.status_c === 'completed'
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      return null;
    }
  },

async update(id, updates) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: id,
          Name: updates.title,
          Tags: updates.tags || "",
          title_c: updates.title,
          description_c: updates.description || "",
          priority_c: updates.priority || "medium",
          category_c: updates.category ? parseInt(updates.category) : null,
          project_c: updates.projectId ? parseInt(updates.projectId) : null,
          due_date_c: updates.dueDate || null,
          status_c: updates.status || updates.completed ? 'completed' : 'active',
          completed_at_c: updates.completed ? new Date().toISOString() : null
        }]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error("Error updating task:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`Task update field error - ${error.fieldLabel}: ${error}`);
            });
            if (record.message) console.error(`Task update error: ${record.message}`);
          });
          return null;
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          const taskObject = {
            id: updated.Id,
            name: updated.Name || updated.title_c,
            title: updated.title_c || updated.Name,
            tags: updated.Tags || '',
            description: updated.description_c || '',
            priority: updated.priority_c || 'medium',
            category: updated.category_c?.Id || null,
            projectId: updated.project_c?.Id || null,
            dueDate: updated.due_date_c || null,
            status: updated.status_c || 'active',
            createdAt: updated.created_at_c || null,
            completedAt: updated.completed_at_c || null,
            order: updated.order_c || 0,
            completed: updated.status_c === 'completed'
          };
          
          // Import toast at the top of the file if not already imported
          const { toast } = await import('react-toastify');
          toast.success("Task updated successfully!");
          
          return taskObject;
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  },

async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = { 
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error("Error deleting task:", response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) console.error(`Task deletion error: ${record.message}`);
          });
          return false;
        }

        if (successful.length > 0) {
          // Import toast at the top of the file if not already imported
          const { toast } = await import('react-toastify');
          toast.success("Task deleted successfully!");
          return true;
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  },

async toggleComplete(id, completed) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: id,
          status_c: completed ? 'completed' : 'active',
          completed_at_c: completed ? new Date().toISOString() : null
        }]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error("Error toggling task completion:", response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to toggle ${failed.length} tasks: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`Task toggle field error - ${error.fieldLabel}: ${error}`);
            });
            if (record.message) console.error(`Task toggle error: ${record.message}`);
          });
          return null;
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            id: updated.Id,
            name: updated.Name || updated.title_c,
            title: updated.title_c || updated.Name,
            tags: updated.Tags || '',
            description: updated.description_c || '',
            priority: updated.priority_c || 'medium',
            category: updated.category_c?.Id || null,
            projectId: updated.project_c?.Id || null,
            dueDate: updated.due_date_c || null,
            status: updated.status_c || 'active',
            createdAt: updated.created_at_c || null,
            completedAt: updated.completed_at_c || null,
            order: updated.order_c || 0,
            completed: updated.status_c === 'completed'
          };
        }
      }

      return null;
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error);
      return null;
    }
  }
};

export default taskService;