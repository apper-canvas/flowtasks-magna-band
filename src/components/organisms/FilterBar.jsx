import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import FilterTabs from "@/components/molecules/FilterTabs";
import SortSelect from "@/components/molecules/SortSelect";
import SearchBar from "@/components/molecules/SearchBar";

// Projects are now loaded dynamically from the database via projectService

const FilterBar = ({ 
  filters, 
  onUpdateFilter, 
  taskStats,
  projects = [],
  onClearSearch 
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      {/* Filter Tabs */}
      <div className="mb-6">
        <FilterTabs
          activeFilter={filters.status}
          onFilterChange={onUpdateFilter}
          taskStats={taskStats}
        />
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchBar
          value={filters.searchQuery}
          onChange={(value) => onUpdateFilter("searchQuery", value)}
          onClear={onClearSearch}
          placeholder="Search tasks..."
          className="md:col-span-2"
        />
        
        <SortSelect
          sortBy={filters.sortBy}
          onSortChange={onUpdateFilter}
        />
      </div>

{/* Project Filter */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <ApperIcon name="Package" size={16} className="text-gray-400" />
          <Select
            value={filters.selectedProject || ""}
            onChange={(e) => onUpdateFilter("selectedProject", e.target.value || null)}
            className="w-48"
          >
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;