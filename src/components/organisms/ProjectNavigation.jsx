import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProjectModal from '@/components/organisms/ProjectModal';
import { projectService } from '@/services/api/projectService';
import { toast } from 'react-toastify';

const ProjectNavigation = ({ 
  projects = [], 
  selectedProject, 
  onSelectProject, 
  onProjectsUpdate,
  isLoading = false 
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreateProject = async (projectData) => {
    try {
      setCreateLoading(true);
      const newProject = await projectService.create(projectData);
      toast.success('Project created successfully!');
      onProjectsUpdate();
      setShowCreateModal(false);
    } catch (error) {
      toast.error(error.message || 'Failed to create project');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-white shadow-lg border-r border-gray-100 h-screen overflow-y-auto"
      >
        <div className="p-6">
          {/* Navigation Header */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center"
            >
              <ApperIcon name="Package" size={20} className="text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Projects</h2>
              <p className="text-sm text-gray-600">Organize your work</p>
            </div>
          </div>

          {/* Add Project Button */}
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full mb-6 flex items-center justify-center gap-2"
            size="lg"
          >
            <ApperIcon name="Plus" size={18} />
            Add Project
          </Button>

          {/* Projects List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Your Projects
            </h3>
            
            {/* All Projects Option */}
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectProject(null)}
              className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 ${
                !selectedProject 
                  ? 'bg-gradient-primary text-white shadow-lg' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${
                !selectedProject ? 'bg-white' : 'bg-gray-300'
              }`} />
              <span className="font-medium">All Projects</span>
            </motion.button>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <AnimatePresence>
                {projects.map((project) => (
                  <motion.button
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectProject(project)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 ${
                      selectedProject?.id === project.id 
                        ? 'bg-gradient-primary text-white shadow-lg' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        selectedProject?.id === project.id 
                          ? 'bg-white' 
                          : project.color || 'bg-indigo-400'
                      }`} 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{project.name}</p>
                      {project.tags && (
                        <p className={`text-xs truncate ${
                          selectedProject?.id === project.id 
                            ? 'text-white/80' 
                            : 'text-gray-500'
                        }`}>
                          {project.tags}
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            )}

            {!isLoading && projects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ApperIcon name="Package" size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No projects yet</p>
                <p className="text-xs">Create your first project to get started</p>
              </div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Create Project Modal */}
      <ProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        loading={createLoading}
      />
    </>
  );
};

export default ProjectNavigation;