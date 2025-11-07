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

  return {
    categories,
    loading,
    error,
    getCategoryById,
    getCategoryColor,
    getCategoryName,
    retryLoad
  };
};