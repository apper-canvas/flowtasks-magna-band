import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import FilterBar from "@/components/organisms/FilterBar";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import ProjectNavigation from "@/components/organisms/ProjectNavigation";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { useTasks } from "@/hooks/useTasks";
import { useTaskFilters } from "@/hooks/useTaskFilters";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";
const Dashboard = () => {
const { tasks, loading, error, createTask, retryLoad } = useTasks();
  const { 
    filters, 
    updateFilter, 
    clearFilters, 
    filteredAndSortedTasks, 
    taskStats 
  } = useTaskFilters(tasks);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createModalLoading, setCreateModalLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  // Load projects on component mount
const loadProjects = async () => {
    try {
      setProjectsLoading(true);
      const projectData = await projectService.getAll();
      setProjects(projectData);
    } catch (err) {
      console.error("Error loading projects:", err);
      toast.error("Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);
const handleCreateTask = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

const handleSubmitCreate = async (taskData) => {
    try {
      setCreateModalLoading(true);
      await createTask(taskData);
      setCreateModalOpen(false);
    } finally {
      setCreateModalLoading(false);
    }
  };

const handleSelectProject = (project) => {
    setSelectedProject(project);
    updateFilter('selectedProject', project?.id || null);
  };

  const handleProjectsUpdate = () => {
    loadProjects();
  };

  const handleClearSearch = () => {
    updateFilter("searchQuery", "");
  };

if (loading || projectsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Error message={error} onRetry={retryLoad} />
        </div>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex">
      {/* Navigation Sidebar */}
      <ProjectNavigation
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        onProjectsUpdate={handleProjectsUpdate}
        isLoading={projectsLoading}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Header 
            taskStats={taskStats} 
            onCreateTask={handleCreateTask}
            selectedProject={selectedProject}
          />
          
          <FilterBar
            filters={filters}
            onUpdateFilter={updateFilter}
            taskStats={taskStats}
            projects={projects}
            onClearSearch={handleClearSearch}
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex-1 overflow-y-auto p-6"
          >
            <TaskList
              tasks={filteredAndSortedTasks}
              searchQuery={filters.searchQuery}
              projects={projects}
              onCreateTask={handleCreateTask}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={createModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmitCreate}
        projects={projects}
        loading={createModalLoading}
      />
    </div>
  );
};

export default Dashboard;