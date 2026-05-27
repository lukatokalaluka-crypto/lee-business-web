import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { globalStyles, colors } from '../styles/common.js';

const CustomerStorePage = ({ products, onSearchChange, searchTerm, loading, error }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );

  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower));

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    const price = Number(product.price);
    const matchesPriceRange =
      selectedPriceRange === 'all' ||
      (selectedPriceRange === 'under100' && price < 100) ||
      (selectedPriceRange === '100-200' && price >= 100 && price <= 200) ||
      (selectedPriceRange === 'over200' && price > 200);

    return matchesSearch && matchesCategory && matchesPriceRange;
  });

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    header: {
      background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
      padding: '2rem',
      borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    title: {
      margin: '0 0 1rem',
      fontSize: '3rem',
      color: 'white',
      fontWeight: 700,
    },
    tagline: {
      margin: '0 0 2rem',
      fontSize: '1.2rem',
      color: 'rgba(255, 255, 255, 0.9)',
      opacity: 0.95,
    },
    searchContainer: {
      marginBottom: '1rem',
    },
    filterPanel: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      alignItems: 'end',
      marginBottom: '1.5rem',
      maxWidth: '820px',
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    filterLabel: {
      marginBottom: '0.5rem',
      color: '#cbd5e1',
      fontSize: '0.95rem',
      fontWeight: 600,
    },
    filterSelect: {
      ...globalStyles.input,
      width: '100%',
      padding: '0.9rem 1rem',
      background: '#0f172a',
      color: '#e2e8f0',
      border: '1px solid rgba(148, 163, 184, 0.25)',
    },
    whatsappButton: {
      position: 'fixed',
      right: '1.5rem',
      bottom: '1.5rem',
      zIndex: 50,
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: '#25D366',
      boxShadow: '0 18px 30px rgba(37, 211, 102, 0.25)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textDecoration: 'none',
      fontSize: '1.4rem',
      transition: 'transform 0.2s ease',
    },
    whatsappButtonHover: {
      transform: 'scale(1.05)',
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
    },
    section: {
      marginBottom: '3rem',
    },
    sectionTitle: {
      margin: '0 0 1.5rem',
      fontSize: '2rem',
      color: '#f8fafc',
      fontWeight: 700,
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
    },
    productCard: {
      background: '#0f172a',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    productImage: {
      width: '100%',
      height: '220px',
      objectFit: 'cover',
      background: '#111827',
      display: 'block',
    },
    productContent: {
      padding: '1.25rem',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    productCategory: {
      display: 'inline-block',
      fontSize: '0.75rem',
      fontWeight: 600,
      background: 'rgba(99, 102, 241, 0.1)',
      color: '#93c5fd',
      padding: '0.35rem 0.75rem',
      borderRadius: '20px',
      marginBottom: '0.75rem',
      width: 'fit-content',
    },
    productName: {
      margin: '0 0 0.5rem',
      fontSize: '1.15rem',
      fontWeight: 600,
      color: '#f8fafc',
      lineHeight: 1.4,
    },
    productPrice: {
      fontSize: '1.35rem',
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
    viewBtn: {
      ...globalStyles.button,
      background: colors.primary,
      color: 'white',
      padding: '0.65rem 1rem',
      width: '100%',
      marginTop: 'auto',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#94a3b8',
      background: '#0f172a',
      borderRadius: '12px',
      border: '1px solid rgba(148, 163, 184, 0.15)',
    },
    emptyStateIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
    },
    emptyStateText: {
      fontSize: '1.15rem',
      margin: '0 0 0.5rem',
    },
    footer: {
      background: '#0f172a',
      borderTop: '1px solid rgba(148, 163, 184, 0.15)',
      padding: '2rem',
      marginTop: '3rem',
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
    },
    footerSection: {
      marginBottom: '1.5rem',
    },
    footerSectionTitle: {
      margin: '0 0 1rem',
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#f8fafc',
    },
    footerLink: {
      display: 'block',
      color: '#93c5fd',
      textDecoration: 'none',
      marginBottom: '0.75rem',
      fontSize: '0.95rem',
    },
    socialLinks: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
    },
    socialLink: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      background: 'rgba(99, 102, 241, 0.1)',
      color: '#93c5fd',
      textDecoration: 'none',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
    },
    footerBottom: {
      textAlign: 'center',
      paddingTop: '2rem',
      borderTop: '1px solid rgba(148, 163, 184, 0.15)',
      color: '#64748b',
      fontSize: '0.9rem',
    },
    resultsInfo: {
      color: '#94a3b8',
      marginBottom: '1.5rem',
      fontSize: '0.95rem',
    },
  };

  const whatsappLink = 'https://wa.me/1234567890?text=Hello%2C%20I%27m%20interested%20in%20a%20product%20from%20your%20store.';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Tech Store</h1>
          <p style={styles.tagline}>Premium Electronics & Software Solutions</p>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterPanel}>
            <div style={styles.filterGroup}>
              <label htmlFor="category-filter" style={styles.filterLabel}>Product type</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={styles.filterSelect}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All types' : category}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.filterGroup}>
              <label htmlFor="price-filter" style={styles.filterLabel}>Price range</label>
              <select
                id="price-filter"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="all">All prices</option>
                <option value="under100">Under K100</option>
                <option value="100-200">K100 - K200</option>
                <option value="over200">Over K200</option>
              </select>
            </div>
          </div>
          {loading && (
            <div style={{ color: '#cbd5e1', marginTop: '0.75rem' }}>
              Loading products...
            </div>
          )}
          {error && (
            <div style={{ ...globalStyles.messageBox, ...globalStyles.errorMessage, marginTop: '0.75rem' }}>
              {error}
            </div>
          )}
        </div>
      </div>

      <div style={styles.main}>
        {searchTerm && (
          <p style={styles.resultsInfo}>
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </p>
        )}

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{searchTerm ? 'Search Results' : 'Featured Products'}</h2>

          {filteredProducts.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>🔍</div>
              <p style={styles.emptyStateText}>{loading ? 'Loading products...' : 'No products found'}</p>
              <p style={{ color: '#64748b', margin: 0 }}>
                {searchTerm ? 'Try a different search term' : 'Check back soon for new products!'}
              </p>
            </div>
          ) : (
            <div style={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <div key={product.id} style={styles.productCard}>
                  {product.image ? (
                    <Link to={`/product/${product.id}`}>
                      <img src={product.image} alt={product.name} style={styles.productImage} />
                    </Link>
                  ) : null}
                  <div style={styles.productContent}>
                    <span style={styles.productCategory}>{product.category}</span>
                    <h3 style={styles.productName}>
                      <Link to={`/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {product.name}
                      </Link>
                    </h3>
                    <div style={styles.productPrice}>{`K${product.price}`}</div>
                    {product.description && <p style={styles.productDesc}>{product.description}</p>}
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                      <button style={styles.viewBtn}>View Details</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        style={styles.whatsappButton}
      >
        💬
      </a>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSectionTitle}>About Us</h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Your trusted partner for premium tech solutions and electronics.
            </p>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerSectionTitle}>Customer Service</h4>
            <a href="/" style={styles.footerLink}>
              Support
            </a>
            <a href="/" style={styles.footerLink}>
              Returns
            </a>
            <a href="/" style={styles.footerLink}>
              Shipping Info
            </a>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerSectionTitle}>Company</h4>
            <a href="/" style={styles.footerLink}>
              About
            </a>
            <a href="/" style={styles.footerLink}>
              Careers
            </a>
            <a href="/" style={styles.footerLink}>
              Blog
            </a>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerSectionTitle}>Follow Us</h4>
            <div style={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                f
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                𝕏
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                📷
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                in
              </a>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p>© 2024 Tech Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerStorePage;