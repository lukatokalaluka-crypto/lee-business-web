import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiUrl } from '../utils/api'
import { globalStyles, colors } from '../styles/common.js'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const styles = {
    container: { maxWidth: 900, margin: '2rem auto', padding: '1rem' },
    card: { display: 'flex', gap: '1.5rem', alignItems: 'flex-start' },
    image: { width: 360, height: 260, objectFit: 'cover', borderRadius: 8, background: '#111827' },
    info: { flex: 1 },
    title: { margin: 0, fontSize: '1.8rem', color: '#f8fafc' },
    category: { color: '#93c5fd', marginTop: '0.5rem' },
    price: { fontSize: '1.4rem', color: colors.primary, marginTop: '0.75rem', fontWeight: 700 },
    desc: { marginTop: '1rem', color: '#cbd5e1', lineHeight: 1.6 },
    back: { display: 'inline-block', marginBottom: '1rem', color: '#93c5fd', textDecoration: 'none' },
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.back}>&larr; Back to store</Link>
      <div style={styles.card}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={styles.image} />
        ) : (
          <div style={{ ...styles.image, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No image</div>
        )}

        <div style={styles.info}>
          <h1 style={styles.title}>{product.name}</h1>
          <div style={styles.category}>{product.category}</div>
          <div style={styles.price}>{Number(product.price).toLocaleString()}K</div>
          {product.description && <p style={styles.desc}>{product.description}</p>}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
