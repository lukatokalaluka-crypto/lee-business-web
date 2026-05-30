import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiUrl } from '../utils/api'
import { globalStyles, colors } from '../styles/common.js'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(apiUrl(`/api/products/${id}`))
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.message || `Failed to load product (${res.status})`)
        }
        const data = await res.json()
        setProduct(data.product)
      } catch (err) {
        setError(err.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) return <div style={{ padding: '2rem' }}>Loading product...</div>
  if (error) return <div style={{ padding: '2rem', color: 'crimson' }}>{error}</div>
  if (!product) return <div style={{ padding: '2rem' }}>Product not found.</div>

  const parseImages = (imagesValue) => {
    if (Array.isArray(imagesValue)) return imagesValue;
    if (!imagesValue) return [];
    try {
      const parsed = JSON.parse(imagesValue);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [imagesValue];
    }
  };

  const images = parseImages(product.images);
  const mainImage = images[selectedImageIndex] || product.image || null;
  const shareText = `${product.name} — ${product.category}. ${product.description || ''}`;
  const pageUrl = encodeURIComponent(window.location.href);
  const encodedText = encodeURIComponent(shareText);
  const whatsappLink = `https://api.whatsapp.com/send?text=${encodedText}%0A${pageUrl}`;
  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${encodedText}`;
  const twitterLink = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${encodedText}`;

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const styles = {
    container: {
      maxWidth: 900,
      margin: '2rem auto',
      padding: '1rem',
      background: 'linear-gradient(180deg, #020617 0%, #111827 100%)',
      borderRadius: 16,
      boxShadow: '0 30px 70px rgba(15, 23, 42, 0.45)',
      color: '#e2e8f0',
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      background: '#0f172a',
      padding: '1.5rem',
      borderRadius: 20,
    },
    topRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    imageCard: {
      display: 'grid',
      gap: '0.75rem',
    },
    image: { width: '100%', height: 400, objectFit: 'cover', borderRadius: 16, background: '#111827' },
    thumbnails: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
      marginTop: '0.75rem',
    },
    thumb: {
      width: 80,
      height: 80,
      borderRadius: 12,
      objectFit: 'cover',
      cursor: 'pointer',
      border: '2px solid transparent',
    },
    thumbActive: {
      border: `2px solid ${colors.primary}`,
    },
    info: { flex: 1 },
    title: { margin: 0, fontSize: '2rem', color: '#f8fafc' },
    category: { color: '#93c5fd', marginTop: '0.5rem', fontSize: '0.95rem', letterSpacing: '0.02em' },
    priceRow: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem' },
    price: { fontSize: '1.6rem', color: colors.primary, fontWeight: 700 },
    originalPrice: { fontSize: '1.15rem', color: '#94a3b8', textDecoration: 'line-through' },
    desc: { marginTop: '1rem', color: '#cbd5e1', lineHeight: 1.7 },
    shareRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' },
    shareButton: {
      background: '#111827',
      color: '#f8fafc',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: 12,
      padding: '0.75rem 1rem',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'transform 0.15s ease',
    },
    shareButtonHover: { transform: 'scale(1.02)' },
    back: { display: 'inline-block', marginBottom: '1rem', color: '#93c5fd', textDecoration: 'none' },
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.back}>&larr; Back to store</Link>
      <div style={styles.card}>
        <div style={styles.imageCard}>
          {mainImage ? (
            <img src={mainImage} alt={product.name} style={styles.image} />
          ) : (
            <div style={{ ...styles.image, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              No image available
            </div>
          )}
          {images.length > 1 && (
            <div style={styles.thumbnails}>
              {images.map((imageUrl, index) => (
                <img
                  key={`${imageUrl}-${index}`}
                  src={imageUrl}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  style={{
                    ...styles.thumb,
                    ...(selectedImageIndex === index ? styles.thumbActive : {}),
                  }}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div style={styles.info}>
          <h1 style={styles.title}>{product.name}</h1>
          <div style={styles.category}>{product.category}</div>
          <div style={styles.priceRow}>
            {product.original_price ? (
              <span style={styles.originalPrice}>{`K${Number(product.original_price)}`}</span>
            ) : null}
            <span style={styles.price}>{`K${Number(product.price)}`}</span>
          </div>
          {product.description && <p style={styles.desc}>{product.description}</p>}
          <div style={styles.shareRow}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={styles.shareButton}>
              WhatsApp
            </a>
            <a href={facebookLink} target="_blank" rel="noopener noreferrer" style={styles.shareButton}>
              Facebook
            </a>
            <a href={twitterLink} target="_blank" rel="noopener noreferrer" style={styles.shareButton}>
              Twitter
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="Copy product link"
              style={styles.shareButton}
            >
              {copySuccess ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
