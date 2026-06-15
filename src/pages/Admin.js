import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://babbafly-backend-ae30.onrender.com';

function Admin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Login కాకపోతే redirect చేయండి
  if (!user) {
    navigate('/login');
    return null;
  }

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'cars',
    price: '',
    location: '',
    rating: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/listings`, {
        ...form,
        price: Number(form.price),
        rating: Number(form.rating)
      });
      if (res.data.success) {
        setMessage('✅ Listing Added Successfully!');
        setForm({ title: '', description: '', category: 'cars', price: '', location: '', rating: '' });
      }
    } catch (err) {
      setMessage('❌ Failed to add listing. Try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '40px', maxWidth: '500px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>

        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '25px', fontSize: '24px' }}>➕ Add New Listing</h2>

        {message && (
          <div style={{ textAlign: 'center', padding: '12px', borderRadius: '10px', marginBottom: '20px', background: message.includes('✅') ? 'rgba(104,211,145,0.2)' : 'rgba(252,129,129,0.2)', border: `1px solid ${message.includes('✅') ? '#68d391' : '#fc8181'}` }}>
            <p style={{ margin: 0, color: message.includes('✅') ? '#68d391' : '#fc8181', fontWeight: '600' }}>{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title (eg: Toyota Innova)" value={form.title} onChange={handleChange} required
            style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }} />

          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required rows={3}
            style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none', resize: 'none' }} />

          <select name="category" value={form.category} onChange={handleChange}
            style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#302b63', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }}>
            <option value="cars">🚗 Cars</option>
            <option value="bikes">🏍️ Bikes</option>
            <option value="flights">✈️ Flights</option>
            <option value="trains">🚂 Trains</option>
          </select>

          <input name="price" placeholder="Price (₹)" type="number" value={form.price} onChange={handleChange} required
            style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }} />

          <input name="location" placeholder="Location (eg: Hyderabad)" value={form.location} onChange={handleChange} required
            style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }} />

          <input name="rating" placeholder="Rating (1-5)" type="number" min="1" max="5" value={form.rating} onChange={handleChange}
            style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', marginBottom: '20px', boxSizing: 'border-box', outline: 'none' }} />

          <button type="submit"
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #e94560, #f5576c)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
            ➕ Add Listing
          </button>
        </form>

        <button onClick={() => navigate('/listings')}
          style={{ width: '100%', padding: '12px', background: 'transparent', color: '#a0aec0', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', marginTop: '12px' }}>
          ← Back to Listings
        </button>
      </div>
    </div>
  );
}

export default Admin;