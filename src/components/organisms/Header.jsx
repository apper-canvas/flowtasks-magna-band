import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProgressRing from "@/components/molecules/ProgressRing";
import { useAuth } from "@/layouts/Root";
const Header = ({ taskStats, onCreateTask }) => {
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const navigateToCategories = () => {
    navigate('/categories');
    setShowUserMenu(false);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-100 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center"
            >
              <ApperIcon name="CheckSquare" size={24} className="text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">FlowTasks</h1>
              <p className="text-gray-600">Organize your tasks efficiently</p>
            </div>
          </div>
          
          {taskStats && (
            <div className="flex items-center gap-4">
              <ProgressRing 
                progress={taskStats.completionRate} 
                size={60} 
                strokeWidth={5}
              />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">
                  {taskStats.completed} of {taskStats.total} completed
                </p>
                <p className="text-gray-600">
                  {taskStats.active} active tasks
                </p>
              </div>
              {taskStats.dueToday > 0 && (
                <div className="flex items-center gap-2 text-amber-600">
                  <ApperIcon name="Clock" size={16} />
                  <span className="text-sm font-medium">
                    {taskStats.dueToday} due today
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ApperIcon name="User" size={16} />
              <span>Welcome, {user.firstName || user.emailAddress}</span>
            </div>
          )}
          
          <Button
            onClick={onCreateTask}
            className="flex items-center gap-2"
            size="lg"
          >
            <ApperIcon name="Plus" size={20} />
            Add Task
          </Button>

          <div className="relative">
            <Button
              onClick={() => setShowUserMenu(!showUserMenu)}
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <ApperIcon name="ChevronDown" size={16} />
            </Button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-600">{user?.emailAddress}</p>
                </div>
                
                <button
                  onClick={navigateToCategories}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ApperIcon name="Tag" size={16} />
                  Categories
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ApperIcon name="LogOut" size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </div>

          {/* Click outside to close menu */}
          {showUserMenu && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowUserMenu(false)}
            />
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;