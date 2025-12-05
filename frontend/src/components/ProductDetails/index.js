import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import EnquiryForm from '../EnquiryForm';
import './index.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);

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
    axios.get(`https://kmkk-product-showcase.onrender.com/api/products/${id}`)  // ✅ FULL URL
      .then(res => {
        console.log('Product Details API:', res.data);  // ✅ DEBUG
        setProduct(res.data);
      })
      .catch(err => {
        console.error('Product Details Error:', err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Loading product details...</div>;
  if (!product) return <div className="no-results">Product not found</div>;

  return (
    <div className="product-details">
      <Link to="/" className="back-link" aria-label="Back to products">
        ← Back to Products
      </Link>
      
      <div className="details-container">
        <div className="details-image">
          <img 
            src={product.image_url || '/placeholder.jpg'} 
            alt={product.name || 'Product'}
            loading="eager"
          />
        </div>
        
        <div className="details-content">
          <h1 className="details-name">{product.name}</h1>
          <p className="details-category">{product.category}</p>
          <div className="details-price">{formatPrice(product.price)}</div>  {/* ✅ FIXED */}
          <div className="details-desc">{product.long_desc || product.short_desc || ''}</div>
          
          <button 
            className="enquire-btn"
            onClick={() => setShowEnquiry(true)}
            aria-label={`Enquire about ${product.name}`}
          >
            💬 Enquire Now
          </button>
        </div>
      </div>

      {showEnquiry && (
        <EnquiryForm 
          productId={product.id}
          productName={product.name}
          onClose={() => setShowEnquiry(false)}
        />
      )}
    </div>
  );
};

export default ProductDetails;
