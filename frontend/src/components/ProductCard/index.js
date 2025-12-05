const ProductCard = ({ product }) => (
  <div className="product-card" role="article">
    <div className="product-image">
      <img 
        src={product.image_url || '/placeholder.jpg'} 
        alt={product.name}
        loading="lazy"
      />
    </div>
    <div className="product-info">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-category">{product.category}</p>
      <p className="product-desc">{product.short_desc}</p>
      <div className="product-price"> {Number.isFinite(p?.price) ? p.price.toFixed(2) : '0.00'} </div>
    </div>
  </div>
);

export default ProductCard;
