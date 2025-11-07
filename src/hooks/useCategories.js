import { useCallback, useEffect, useState } from "react";
import categoryService from "@/services/api/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Failed to load categories");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

const getCategoryById = useCallback((id) => {
    return categories.find(cat => cat.Id === parseInt(id) || cat.id === parseInt(id)) || null;
  }, [categories]);

  const getCategoryColor = useCallback((categoryId) => {
    const category = getCategoryById(categoryId);
    return category?.color || '#6b7280';
  }, [getCategoryById]);

const getCategoryName = useCallback((categoryId) => {
    const category = getCategoryById(categoryId);
    return category?.name || 'Unknown Category';
  }, [getCategoryById]);

  const retryLoad = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

const createCategory = useCallback(async (categoryData) => {
    try {
      setError("");
      const newCategory = await categoryService.create(categoryData);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      const errorMessage = err.message || "Failed to create category";
      setError(errorMessage);
      console.error("Error creating category:", err);
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (id, categoryData) => {
    try {
      setError("");
      const updatedCategory = await categoryService.update(id, categoryData);
      setCategories(prev => prev.map(cat => 
        cat.Id === parseInt(id) ? updatedCategory : cat
      ));
      return updatedCategory;
    } catch (err) {
      const errorMessage = err.message || "Failed to update category";
      setError(errorMessage);
      console.error("Error updating category:", err);
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      setError("");
      const success = await categoryService.delete(id);
      if (success) {
        setCategories(prev => prev.filter(cat => cat.Id !== parseInt(id)));
      }
      return success;
    } catch (err) {
      const errorMessage = err.message || "Failed to delete category";
      setError(errorMessage);
      console.error("Error deleting category:", err);
      throw err;
    }
  }, []);

  return {
    categories,
    loading,
    error,
    getCategoryById,
    getCategoryColor,
    getCategoryName,
    retryLoad,
    createCategory,
    updateCategory,
    deleteCategory
  };
};