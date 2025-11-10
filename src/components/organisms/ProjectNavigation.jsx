import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProjectModal from "@/components/organisms/ProjectModal";

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
<motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectProject(project)}
                    className={`w-full p-4 rounded-xl cursor-pointer text-left transition-all duration-300 border-2 ${
                      selectedProject?.id === project.id 
                        ? 'bg-gradient-primary text-white shadow-xl border-indigo-300 transform scale-105' 
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header with project indicator and name */}
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-4 h-4 rounded-full flex-shrink-0 ${
                            selectedProject?.id === project.id 
                              ? 'bg-white' 
                              : project.color || 'bg-indigo-400'
                          }`} 
                          style={selectedProject?.id !== project.id ? { backgroundColor: project.color || '#6366f1' } : {}}
                        />
                        <h3 className="font-semibold text-lg truncate flex-1">
                          {project.name}
                        </h3>
                      </div>

                      {/* Description preview */}
                      {project.description && (
                        <p className={`text-sm leading-relaxed line-clamp-2 ${
                          selectedProject?.id === project.id 
                            ? 'text-white/90' 
                            : 'text-gray-600'
                        }`}>
                          {project.description.substring(0, 80)}{project.description.length > 80 ? '...' : ''}
                        </p>
                      )}

                      {/* Project metadata */}
                      <div className="space-y-2">
                        {(project.startDate || project.endDate) && (
                          <div className={`text-xs flex items-center gap-2 ${
                            selectedProject?.id === project.id 
                              ? 'text-white/80' 
                              : 'text-gray-500'
                          }`}>
                            <span className="font-medium">Timeline:</span>
                            <span>
                              {project.startDate && project.endDate 
                                ? `${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}`
                                : project.startDate 
                                  ? `Starts ${new Date(project.startDate).toLocaleDateString()}`
                                  : `Ends ${new Date(project.endDate).toLocaleDateString()}`
                              }
                            </span>
                          </div>
                        )}
                        
                        {project.milestone && (
                          <div className={`text-xs flex items-center gap-2 ${
                            selectedProject?.id === project.id 
                              ? 'text-white/80' 
                              : 'text-gray-500'
                          }`}>
                            <span className="font-medium">Milestone:</span>
                            <span className="truncate">{project.milestone}</span>
                          </div>
                        )}

                        {project.tags && (
                          <div className={`text-xs flex items-center gap-2 ${
                            selectedProject?.id === project.id 
                              ? 'text-white/80' 
                              : 'text-gray-500'
                          }`}>
                            <span className="font-medium">Tags:</span>
                            <span className="truncate">{project.tags}</span>
                          </div>
                        )}
</div>
                    </div>
                  </motion.div>
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