import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";
import Error from "@/components/ui/Error";

class TaskService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "status_c"}},
{"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "project_c"}},
          {"field": {"Name": "order_c"}}
        ],
        orderBy: [{"fieldName": "order_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to match UI expectations
      return response.data.map(task => ({
        Id: task.Id,
        id: task.Id, // Keep both for compatibility
        title: task.title_c,
        description: task.description_c,
        priority: task.priority_c,
        category: task.category_c?.Id || task.category_c, // Handle lookup field
        dueDate: task.due_date_c,
        status: task.status_c,
        createdAt: task.created_at_c,
        completedAt: task.completed_at_c,
order: task.order_c || 0,
        projectId: task.project_c?.Id || null,
        project: task.project_c || null
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error.message);
      toast.error("Failed to load tasks");
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

      if (!response.success || !response.data) {
        throw new Error(`Task with id ${id} not found`);
      }

      // Transform database fields to match UI expectations
      return {
        Id: response.data.Id,
        id: response.data.Id, // Keep both for compatibility
        title: response.data.title_c,
        description: response.data.description_c,
        priority: response.data.priority_c,
        category: response.data.category_c?.Id || response.data.category_c,
        dueDate: response.data.due_date_c,
        status: response.data.status_c,
        createdAt: response.data.created_at_c,
completedAt: response.data.completed_at_c,
        order: response.data.order_c || 0,
        projectId: response.data.project_c?.Id || null,
        project: response.data.project_c || null
      };
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }
// Handle project_c lookup field - send only ID for create operations
      const projectId = taskData.projectId ? parseInt(taskData.projectId) : null;
      
      const params = {
        records: [{
          title_c: taskData.title,
          description_c: taskData.description,
          priority_c: taskData.priority,
          category_c: parseInt(taskData.category), // Ensure lookup field is integer
          due_date_c: taskData.dueDate,
          status_c: "active",
          created_at_c: new Date().toISOString(),
          completed_at_c: null,
          order_c: 0,
          project_c: projectId
        }]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0] && response.results[0].success) {
        const newTask = response.results[0].data;
        toast.success("Task created successfully!");
        
        // Transform back to UI format
        return {
          Id: newTask.Id,
          id: newTask.Id,
          title: newTask.title_c,
          description: newTask.description_c,
          priority: newTask.priority_c,
          category: newTask.category_c?.Id || newTask.category_c,
          dueDate: newTask.due_date_c,
          status: newTask.status_c,
          createdAt: newTask.created_at_c,
completedAt: newTask.completed_at_c,
          order: newTask.order_c || 0,
          projectId: newTask.project_c?.Id || null,
          project: newTask.project_c || null
        };
      }

      throw new Error("Failed to create task");
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // Prepare update data with only updateable fields
const updateData = {
        Id: id,
        // Handle project_c lookup field - send only ID for update operations  
        project_c: updates.projectId ? parseInt(updates.projectId) : null
      };

      if (updates.title !== undefined) updateData.title_c = updates.title;
      if (updates.description !== undefined) updateData.description_c = updates.description;
      if (updates.priority !== undefined) updateData.priority_c = updates.priority;
      if (updates.category !== undefined) updateData.category_c = parseInt(updates.category);
      if (updates.dueDate !== undefined) updateData.due_date_c = updates.dueDate;
      if (updates.status !== undefined) {
        updateData.status_c = updates.status;
        if (updates.status === "completed") {
          updateData.completed_at_c = new Date().toISOString();
        } else if (updates.status === "active") {
          updateData.completed_at_c = null;
        }
      }
      if (updates.order !== undefined) updateData.order_c = updates.order;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0] && response.results[0].success) {
        const updatedTask = response.results[0].data;
        toast.success("Task updated successfully!");
        
        // Transform back to UI format
        return {
          Id: updatedTask.Id,
          id: updatedTask.Id,
          title: updatedTask.title_c,
          description: updatedTask.description_c,
          priority: updatedTask.priority_c,
          category: updatedTask.category_c?.Id || updatedTask.category_c,
          dueDate: updatedTask.due_date_c,
          status: updatedTask.status_c,
          createdAt: updatedTask.created_at_c,
completedAt: updatedTask.completed_at_c,
          order: updatedTask.order_c || 0,
          projectId: updatedTask.project_c?.Id || null,
          project: updatedTask.project_c || null
        };
      }

      throw new Error("Failed to update task");
    } catch (error) {
      console.error(`Error updating task ${id}:`, error?.response?.data?.message || error.message);
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
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results && response.results[0] && response.results[0].success) {
        toast.success("Task deleted successfully!");
        return true;
      }

      throw new Error("Failed to delete task");
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async toggleComplete(id) {
    try {
      const task = await this.getById(id);
      const newStatus = task.status === "completed" ? "active" : "completed";
      return await this.update(id, { status: newStatus });
    } catch (error) {
      console.error(`Error toggling task ${id}:`, error.message);
      throw error;
    }
  }

  async reorderTasks(taskIds) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      // Update order for each task
const updateRecords = taskIds.map((id, index) => ({
        Id: id,
        order_c: index
      }));
      const params = {
        records: updateRecords
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      toast.success("Tasks reordered successfully!");
      return true;
    } catch (error) {
      console.error("Error reordering tasks:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
}

export default new TaskService();