import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import FormField from '@/components/molecules/FormField';

const ProjectModal = ({ isOpen, onClose, onSubmit, project = null, loading = false }) => {
const [formData, setFormData] = useState({
    name: '',
    tags: '',
    description: '',
    startDate: '',
    endDate: '',
    milestone: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && project) {
      // Edit mode
setFormData({
        name: project.name || '',
        tags: project.tags || '',
        description: project.description || '',
        startDate: project.startDate || '',
        endDate: project.endDate || '',
        milestone: project.milestone || ''
      });
    } else if (isOpen) {
      // Create mode
      setFormData({
name: '',
        tags: '',
        description: '',
        startDate: '',
        endDate: '',
        milestone: ''
      });
    }
    setErrors({});
  }, [isOpen, project]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Project name must be at least 2 characters';
    }

    // Validate dates if provided
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (startDate >= endDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    // Validate milestone length
    if (formData.milestone && formData.milestone.length > 100) {
      newErrors.milestone = 'Milestone must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
await onSubmit({
        name: formData.name.trim(),
        tags: formData.tags.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        milestone: formData.milestone.trim()
      });
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !loading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Package" size={16} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {project ? 'Edit Project' : 'Create Project'}
                  </h2>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField 
                  label="Project Name"
                  error={errors.name}
                  required
                >
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter project name..."
                    disabled={loading}
                    className={errors.name ? 'border-red-300' : ''}
                  />
                </FormField>
<FormField 
                  label="Description"
                  error={errors.description}
                >
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Project description (optional)..."
                    disabled={loading}
                    className={`min-h-[100px] ${errors.description ? 'border-red-300' : ''}`}
                    rows={4}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField 
                    label="Start Date"
                    error={errors.startDate}
                  >
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      disabled={loading}
                      className={errors.startDate ? 'border-red-300' : ''}
                    />
                  </FormField>

                  <FormField 
                    label="End Date"
                    error={errors.endDate}
                  >
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      disabled={loading}
                      className={errors.endDate ? 'border-red-300' : ''}
                    />
                  </FormField>
                </div>

                <FormField 
                  label="Milestone"
                  error={errors.milestone}
                >
                  <Input
                    type="text"
                    value={formData.milestone}
                    onChange={(e) => handleChange('milestone', e.target.value)}
                    placeholder="Project milestone (optional)..."
                    disabled={loading}
                    className={errors.milestone ? 'border-red-300' : ''}
                  />
                </FormField>

                <FormField 
                  label="Tags"
                  error={errors.tags}
                >
                  <Input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleChange('tags', e.target.value)}
                    placeholder="Add tags (optional)..."
                    disabled={loading}
                    className={errors.tags ? 'border-red-300' : ''}
                  />
                </FormField>
                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="ghost"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {project ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <ApperIcon name={project ? "Save" : "Plus"} size={16} />
                        {project ? 'Update Project' : 'Create Project'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;