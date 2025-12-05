import React from 'react';

const ProductCard = ({ product }) => {
  // BULLETPROOF PRICE FORMATTER
  const formatPrice = (price) => {
    if (!price || !Number.isFinite(price)) return '$0.00';
    try {
      return `$${Number(price).toFixed(2)}`;
    } catch {
      return '$0.00';
    }
  };

  if (!product) return null; // Guard clause

  return (
    <div className="product-card" role="article">
      <div className="product-image">
        <img 
          src={product.image_url || '/placeholder.jpg'} 
          alt={product.name || 'Product'}
          loading="lazy"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name || 'Unnamed'}</h3>
        <p className="product-category">{product.category || 'N/A'}</p>
        <p className="product-desc">{product.short_desc || ''}</p>
        <div className="product-price">{formatPrice(product.price)}</div> {/* ✅ FIXED */}
      </div>
    </div>
  );
};

export default ProductCard;
