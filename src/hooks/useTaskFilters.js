import { useState, useMemo } from 'react'
import { format, isAfter, isBefore, startOfDay } from 'date-fns'

export const useTaskFilters = (tasks = []) => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: 'all', // all, pending, completed
    priority: 'all', // all, low, medium, high
    category: 'all', // all, work, personal, etc.
    dueDate: 'all', // all, today, tomorrow, this_week, overdue
    sortBy: 'dueDate', // dueDate, priority, created, title
    sortOrder: 'asc', // asc, desc
    selectedProject: null
  })

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      dueDate: 'all',
      sortBy: 'dueDate',
      sortOrder: 'asc',
      selectedProject: null
    })
  }

  // Filter tasks based on current filters
const filteredAndSortedTasks = useMemo(() => {
    // Filter out null/undefined tasks first
    let filtered = tasks.filter(task => task != null)

    // Project filter - Apply this first to filter by selected project
    if (filters.selectedProject) {
      filtered = filtered.filter(task => task.projectId === filters.selectedProject)
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(task => 
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status)
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority)
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category)
    }

    // Due date filter
    if (filters.dueDate !== 'all') {
      const today = startOfDay(new Date())
      
      filtered = filtered.filter(task => {
        if (!task.dueDate) return filters.dueDate === 'no_date'
        
        const dueDate = startOfDay(new Date(task.dueDate))
        
        switch (filters.dueDate) {
          case 'today':
            return format(dueDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
          case 'tomorrow': {
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            return format(dueDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')
          }
          case 'this_week': {
            const weekEnd = new Date(today)
            weekEnd.setDate(weekEnd.getDate() + 7)
            return !isAfter(dueDate, weekEnd) && !isBefore(dueDate, today)
          }
          case 'overdue':
            return isBefore(dueDate, today)
          case 'no_date':
            return !task.dueDate
          default:
            return true
        }
      })
    }

    // Sort tasks
filtered.sort((a, b) => {
      // Additional safety check for null objects
      if (!a || !b) return 0
      let aValue, bValue
      
      switch (filters.sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
aValue = priorityOrder[a?.priority] || 0
          bValue = priorityOrder[b?.priority] || 0
          break
        case 'created':
aValue = new Date(a?.createdAt || 0)
          bValue = new Date(b?.createdAt || 0)
          break
        case 'title':
aValue = a?.title?.toLowerCase() || ''
          bValue = b?.title?.toLowerCase() || ''
          break
        case 'dueDate':
        default:
aValue = a?.dueDate ? new Date(a.dueDate) : new Date('9999-12-31')
          bValue = b?.dueDate ? new Date(b.dueDate) : new Date('9999-12-31')
          break
      }
      
      if (filters.sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })

    return filtered
  }, [tasks, filters])

  // Calculate task statistics
  const taskStats = useMemo(() => {
    const stats = {
      total: filteredAndSortedTasks.length,
      completed: 0,
      pending: 0,
      overdue: 0,
      dueToday: 0
    }

    const today = startOfDay(new Date())

    filteredAndSortedTasks.forEach(task => {
      if (task.status === 'completed') {
        stats.completed++
      } else {
        stats.pending++
        
        if (task.dueDate) {
          const dueDate = startOfDay(new Date(task.dueDate))
          if (isBefore(dueDate, today)) {
            stats.overdue++
          } else if (format(dueDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
            stats.dueToday++
          }
        }
      }
    })

    return stats
  }, [filteredAndSortedTasks])

  return {
    filters,
    updateFilter,
    clearFilters,
    filteredAndSortedTasks,
    taskStats
  }
}