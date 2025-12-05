import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import Pagination from '../Pagination';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [loading, setLoading] = useState(true);
  const placeholder = 'https://via.placeholder.com/400x300?text=Product+Image';

  const navigate = useNavigate();

  // BULLETPROOF PRICE FORMATTER
  const formatPrice = (price) => {
    if (!price || !Number.isFinite(price)) return '$0.00';
    try {
      return `$${Number(price).toFixed(2)}`;
    } catch {
      return '$0.00';
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get('https://kmkk-product-showcase.onrender.com/api/products', {
        params: { search, category, page, limit },
      })
      .then((res) => {
        console.log('API Response:', res.data); // DEBUG
        setProducts(Array.isArray(res.data.products) ? res.data.products : []);
        setTotal(res.data.total || 0);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setProducts([]); // Ensure empty array
      })
      .finally(() => setLoading(false));
  }, [search, category, page, limit]);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-page">
      {/* toolbar code unchanged */}
      <div className="products-toolbar" role="search">
        <input
          className="search-input"
          type="search"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          aria-label="Search products"
        />
        <select
          className="category-select"
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Footwear">Footwear</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Home Appliances">Home Appliances</option>
        </select>
      </div>

      {total === 0 ? (
        <div className="no-results">No products found</div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <article key={p?.id || Math.random()} className="product-card">
              <div
                className="product-image-wrapper"
                onClick={() => navigate(`/product/${p?.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${p?.id}`)}
              >
                <img
                  src={p?.image_url || placeholder}
                  alt={p?.name || 'Product'}
                  className="product-image"
                  loading="lazy"
                />
              </div>
              <h2 className="product-title" onClick={() => navigate(`/product/${p?.id}`)}>
                {p?.name || 'Unnamed Product'}
              </h2>
              <p className="product-category">{p?.category || 'N/A'}</p>
              <p className="product-desc">{p?.short_desc || ''}</p>
              <div className="product-footer">
                <span className="product-price">
                  {formatPrice(p?.price)} {/* BULLETPROOF */}
                </span>
                <button
                  className="product-btn"
                  type="button"
                  onClick={() => navigate(`/product/${p?.id}`)}
                >
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {total > limit && (
        <Pagination total={total} page={page} limit={limit} onPageChange={setPage} />
      )}
    </div>
  );
};

export default ProductList;
