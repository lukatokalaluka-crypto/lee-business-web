import React, { useState, useEffect } from 'react';
import { globalStyles, colors } from '../styles/common.js';
import { apiUrl } from '../utils/api';

const AdminDashboardPage = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onLogout,
  loading,
  error,
  success,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    description: '',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageFileChange = async (file) => {
    setImageUploadError(null);
    setImageFile(null);

    if (!file) {
      return;
    }

    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await fetch(apiUrl('/api/upload'), {
        method: 'POST',
        credentials: 'include',
        body: uploadData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Image upload failed');
      }

      setImageFile(file);
      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error('Image upload error:', err);
      setImageUploadError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingId(null);
    setImageFile(null);
    setImageUploadError(null);
    setFormData({
      name: '',
      price: '',
      category: 'Electronics',
      description: '',
      image: '',
    });
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setShowAddForm(true);
    setImageFile(null);
    setImageUploadError(null);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description || '',
      image: product.image || '',
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdateProduct(editingId, formData);
    } else {
      onAddProduct(formData);
    }
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
      paddingBottom: '1.5rem',
    },
    title: {
      margin: 0,
      fontSize: '2.5rem',
      color: '#f8fafc',
      fontWeight: 700,
    },
    logoutBtn: {
      ...globalStyles.button,
      background: colors.danger,
      color: 'white',
      padding: '0.75rem 1.5rem',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
    },
    addBtn: {
      ...globalStyles.button,
      background: colors.primary,
      color: 'white',
      padding: '0.75rem 1.5rem',
    },
    messageContainer: {
      marginBottom: '1.5rem',
    },
    formCard: {
      background: '#0f172a',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem',
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      ...globalStyles.label,
      color: '#cbd5e1',
      marginBottom: '0.5rem',
    },
    input: {
      ...globalStyles.input,
      background: '#111827',
      color: '#f8fafc',
      borderColor: 'rgba(148, 163, 184, 0.2)',
    },
    textarea: {
      ...globalStyles.input,
      background: '#111827',
      color: '#f8fafc',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100px',
      resize: 'vertical',
    },
    formButtonGroup: {
      display: 'flex',
      gap: '1rem',
      gridColumn: '1 / -1',
    },
    submitBtn: {
      ...globalStyles.button,
      background: colors.primary,
      color: 'white',
      flex: 1,
    },
    cancelBtn: {
      ...globalStyles.button,
      background: '#475569',
      color: 'white',
      flex: 1,
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    productCard: {
      background: '#0f172a',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      borderRadius: '12px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      background: '#111827',
    },
    productContent: {
      padding: '1.25rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    productName: {
      margin: '0 0 0.5rem',
      fontSize: '1.15rem',
      fontWeight: 600,
      color: '#f8fafc',
    },
    productCategory: {
      fontSize: '0.85rem',
      color: '#93c5fd',
      marginBottom: '0.75rem',
    },
    productPrice: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: colors.primary,
      marginBottom: '0.75rem',
    },
    productDesc: {
      fontSize: '0.9rem',
      color: '#cbd5e1',
      marginBottom: '1rem',
      flex: 1,
      lineHeight: 1.5,
    },
    productActions: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: 'auto',
    },
    editBtn: {
      ...globalStyles.button,
      background: '#059669',
      color: 'white',
      flex: 1,
      padding: '0.5rem',
    },
    deleteBtn: {
      ...globalStyles.button,
      background: colors.danger,
      color: 'white',
      flex: 1,
      padding: '0.5rem',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#94a3b8',
    },
    emptyStateIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
  };

  // Admins management state
  const [admins, setAdmins] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminErrorMsg, setAdminErrorMsg] = useState(null);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState(null);
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [currentAdminId, setCurrentAdminId] = useState(null);

  const fetchAdmins = async () => {
    setAdminLoading(true);
    setAdminErrorMsg(null);
    try {
      const res = await fetch(apiUrl('/api/admins'), { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load admins');
      setAdmins(data.admins || []);
      setCurrentAdminId(data.currentAdminId || null);
    } catch (err) {
      setAdminErrorMsg(err.message || 'Failed to load admins');
      setAdmins([]);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminErrorMsg(null);
    setAdminSuccessMsg(null);
    try {
      let res;
      if (editingAdminId) {
        res = await fetch(apiUrl(`/api/admins/${editingAdminId}`), {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: adminEmail, password: adminPassword || undefined }),
        });
      } else {
        res = await fetch(apiUrl('/api/admins'), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: adminEmail, password: adminPassword }),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add/update admin');
      setAdminSuccessMsg(editingAdminId ? 'Admin updated successfully' : 'Admin added successfully');
      setAdminEmail('');
      setAdminPassword('');
      setEditingAdminId(null);
      fetchAdmins();
    } catch (err) {
      setAdminErrorMsg(err.message || 'Failed to add admin');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleEditAdmin = (admin) => {
    setEditingAdminId(admin.id);
    setAdminEmail(admin.email);
    setAdminPassword('');
    setAdminErrorMsg(null);
    setAdminSuccessMsg(null);
  };

  const handleCancelEditAdmin = () => {
    setEditingAdminId(null);
    setAdminEmail('');
    setAdminPassword('');
    setAdminErrorMsg(null);
    setAdminSuccessMsg(null);
  };

  const handleDeleteAdmin = async (id) => {
    if (!confirm('Delete this admin?')) return;
    setAdminLoading(true);
    setAdminErrorMsg(null);
    setAdminSuccessMsg(null);
    try {
      const res = await fetch(apiUrl(`/api/admins/${id}`), { method: 'DELETE', credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete admin');
      setAdminSuccessMsg('Admin removed');
      fetchAdmins();
    } catch (err) {
      setAdminErrorMsg(err.message || 'Failed to delete admin');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <button onClick={onLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {error && (
        <div style={styles.messageContainer}>
          <div style={globalStyles.errorMessage}>{error}</div>
        </div>
      )}

      {success && (
        <div style={styles.messageContainer}>
          <div style={globalStyles.successMessage}>{success}</div>
        </div>
      )}

      {/* Admins management */}
      <div style={{ margin: '2rem 0' }}>
        <h2 style={{ color: '#f8fafc', margin: '0 0 1rem' }}>Admin Users</h2>

        {adminErrorMsg && <div style={{ ...globalStyles.messageBox, ...globalStyles.errorMessage }}>{adminErrorMsg}</div>}
        {adminSuccessMsg && <div style={{ ...globalStyles.messageBox, ...globalStyles.successMessage }}>{adminSuccessMsg}</div>}

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, maxWidth: '420px' }}>
            <form onSubmit={handleAddAdmin} style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <label style={styles.label}>Admin Email</label>
                <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} required style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Password</label>
                <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required style={styles.input} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" style={{ ...globalStyles.button, background: colors.primary, color: 'white', padding: '0.6rem 0.9rem' }} disabled={adminLoading}>Add / Update Admin</button>
              </div>
            </form>
          </div>

          <div style={{ flex: 2 }}>
            <div style={{ background: '#0b1320', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(148,163,184,0.06)' }}>
              <h4 style={{ margin: '0 0 0.75rem', color: '#cbd5e1' }}>Existing Admins</h4>
              {adminLoading && <div style={{ color: '#94a3b8' }}>Loading admins...</div>}
              {!adminLoading && admins.length === 0 && <div style={{ color: '#94a3b8' }}>No admins found.</div>}
              {!adminLoading && admins.length > 0 && (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {admins.map((a) => (
                    <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px dashed rgba(148,163,184,0.03)' }}>
                      <div style={{ color: '#e2e8f0' }}>{a.email}</div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEditAdmin(a)} style={{ ...globalStyles.button, background: '#06b6d4', color: 'white', padding: '0.35rem 0.6rem' }}>Edit</button>
                        <button onClick={() => handleDeleteAdmin(a.id)} style={{ ...globalStyles.button, background: colors.danger, color: 'white', padding: '0.35rem 0.6rem' }} disabled={currentAdminId && Number(currentAdminId) === a.id}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.buttonGroup}>
        <button onClick={handleAddClick} style={styles.addBtn}>
          + Add New Product
        </button>
      </div>

      {showAddForm && (
        <div style={styles.formCard}>
          <h2 style={{ margin: '0 0 1.5rem', color: '#f8fafc', fontSize: '1.5rem' }}>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleFormSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="e.g., HP Pavilion Laptop"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Price (in K)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleFormChange('price', e.target.value)}
                placeholder="e.g., 4500"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                style={styles.input}
              >
                <option>Electronics</option>
                <option>Software</option>
                <option>Hardware</option>
                <option>Accessories</option>
                <option>Services</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleFormChange('image', e.target.value)}
                placeholder="https://..."
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileChange(e.target.files?.[0])}
                style={styles.input}
              />
              {uploadingImage && (
                <p style={{ color: '#93c5fd', marginTop: '0.5rem' }}>Uploading image...</p>
              )}
              {imageUploadError && (
                <div style={{ ...globalStyles.messageBox, ...globalStyles.errorMessage, marginTop: '0.5rem' }}>
                  {imageUploadError}
                </div>
              )}
            </div>

            <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Product description..."
                style={styles.textarea}
              />
            </div>

            <div style={styles.formButtonGroup}>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Processing...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={handleCancel} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 style={{ margin: '2rem 0 1.5rem', color: '#f8fafc', fontSize: '1.5rem' }}>
          Products ({products.length})
        </h2>
        {products.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📦</div>
            <p>No products yet. Add one to get started!</p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map((product) => (
              <div key={product.id} style={styles.productCard}>
                {product.image && <img src={product.image} alt={product.name} style={styles.productImage} />}
                <div style={styles.productContent}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <span style={styles.productCategory}>{product.category}</span>
                  <div style={styles.productPrice}>{product.price.toLocaleString()}K</div>
                  {product.description && <p style={styles.productDesc}>{product.description}</p>}
                  <div style={styles.productActions}>
                    <button
                      onClick={() => handleEditClick(product)}
                      style={styles.editBtn}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      style={styles.deleteBtn}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
