import { useState, useEffect } from 'react';
import { apiUrl } from '../utils/api';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch products from API or fallback data
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiUrl('/api/products?page=1&limit=100'), {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data.products || data);
    } catch (err) {
      console.error('Failed to fetch products from API:', err);
      setError('Failed to load products from server');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new product
  const addProduct = async (productData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(apiUrl('/api/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add product');
      }

      const data = await response.json();
      setProducts((prev) => [data.product, ...prev]);
      setSuccess('Product added successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to add product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (productId, productData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(apiUrl(`/api/products/${productId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update product');
      }

      const data = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? data.product : p))
      );
      setSuccess('Product updated successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to update product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(apiUrl(`/api/products/${productId}`), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete product');
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setSuccess('Product deleted successfully!');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    setProducts,
    loading,
    error,
    success,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    clearMessages,
  };
};

export default useProducts;
