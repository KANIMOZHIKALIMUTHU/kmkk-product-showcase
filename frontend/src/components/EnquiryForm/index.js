import { useState } from 'react';
import axios from 'axios';
import './index.css';

const EnquiryForm = ({ productId, productName, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  try {
    await axios.post('https://kmkk-product-showcase.onrender.com/api/enquiries', {
      product_id: Number(productId),  // ✅ FORCE NUMBER
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      message: formData.message.trim()
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  } catch (error) {
    console.error('Enquiry error:', error.response?.data);  // ✅ DEBUG
    setErrors({ submit: 'Failed to submit enquiry. Please try again.' });
  } finally {
    setLoading(false);
  }
};

  if (success) {
    return (
      <div className="enquiry-modal">
        <div className="success-message">
          ✅ Enquiry submitted successfully for {productName}!
        </div>
      </div>
    );
  }

  return (
    <div className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <header className="modal-header">
          <h2 id="enquiry-title">Enquire About {productName}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close form">×</button>
        </header>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className={errors.name ? 'error' : ''}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <span id="name-error" className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className={errors.email ? 'error' : ''}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <span id="email-error" className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone (Optional)</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              rows="5"
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className={errors.message ? 'error' : ''}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && <span id="message-error" className="error-message">{errors.message}</span>}
          </div>

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Sending...' : 'Send Enquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryForm;
