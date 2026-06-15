import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const API = 'https://babbafly-backend-ae30.onrender.com';

const categoryConfig = {
  'cars': { color: '#FF6B6B', icon: '🚗', label: 'Car' },
  'bikes': { color: '#4ECDC4', icon: '🏍️', label: 'Bike' },
  'flights': { color: '#45B7D1', icon: '✈️', label: 'Flight' },
  'trains': { color: '#96CEB4', icon: '🚂', label: 'Train' },
};

const coordsCache = {};
async function getCoords(city) {
  if (!city) return null;
  if (coordsCache[city]) return coordsCache[city];
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      coordsCache[city] = coords;
      return coords;
    }
  } catch (e) {}
  return null;
}

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapItem, setMapItem] = useState(null);
  const [mapCoords, setMapCoords] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [cancelStatus, setCancelStatus] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) { navigate('/login'); return; }
    axios.get(`${API}/api/orders/user/${user._id}`)
      .then(res => {
        setBookings(res.data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Booking cancel చేయాలా?')) return;
    try {
      await axios.delete(`${API}/api/orders/${orderId}`);
      setCancelStatus('✅ Booking cancelled!');
      setBookings(prev => prev.filter(b => b._id !== orderId));
      setTimeout(() => setCancelStatus(''), 2500);
    } catch (err) {
      setCancelStatus('❌ Cancel failed! Try again.');
      setTimeout(() => setCancelStatus(''), 2500);
    }
  };

  const handleViewMap = async (order) => {
    const location = order.listingId?.location;
    if (!location) return;
    setMapItem(order);
    setMapCoords(null);
    setMapLoading(true);
    const coords = await getCoords(location);
    setMapCoords(coords);
    setMapLoading(false);
  };

  const config = (cat) => categoryConfig[cat] || { color: '#888', icon: '📦', label: cat };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div style={{ padding: '50px 20px 30px', textAlign: 'center' }}>
        <span style={{ fontSize: '50px' }}>🚀</span>
        <h1 style={{ fontSize: '60px', fontWeight: '900', margin: '5px 0 8px', background: 'linear-gradient(135deg, #ff6b6b, #e94560, #f5576c, #45b7d1, #96ceb4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-2px', lineHeight: 1 }}>
          BabbaFly
        </h1>
        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>📋 My Bookings</h2>
        <p style={{ color: '#a0aec0', marginBottom: '25px' }}>All your travel bookings in one place</p>
        <button onClick={() => navigate('/listings')}
          style={{ padding: '12px 30px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', backdropFilter: 'blur(10px)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(69,183,209,0.3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
          ← Back to Listings
        </button>
      </div>

      {cancelStatus && (
        <div style={{ textAlign: 'center', padding: '12px', margin: '0 20px 10px', borderRadius: '10px', background: cancelStatus.includes('✅') ? 'rgba(104,211,145,0.2)' : 'rgba(252,129,129,0.2)', border: `1px solid ${cancelStatus.includes('✅') ? '#68d391' : '#fc8181'}` }}>
          <p style={{ margin: 0, color: cancelStatus.includes('✅') ? '#68d391' : '#fc8181', fontWeight: '700', fontSize: '16px' }}>{cancelStatus}</p>
        </div>
      )}

      <div style={{ padding: '10px 20px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: '#a0aec0', fontSize: '20px' }}>⏳ Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: '60px' }}>📋</p>
            <h3 style={{ color: 'white', fontSize: '22px' }}>No Bookings Yet!</h3>
            <p style={{ color: '#a0aec0', marginBottom: '25px' }}>You haven't booked anything yet.</p>
            <button onClick={() => navigate('/all-listings')}
              style={{ padding: '14px 35px', background: 'linear-gradient(135deg, #e94560, #f5576c)', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
              🗂️ Browse Listings
            </button>
          </div>
        ) : (
          <div>
            <p style={{ color: '#a0aec0', marginBottom: '20px', fontSize: '15px' }}>Total: {bookings.length} booking(s)</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {bookings.map((order, i) => {
                const cat = order.listingId?.category || '';
                const cfg = config(cat);
                return (
                  <div key={order._id || i} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'all 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}44)`, padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `3px solid ${cfg.color}` }}>
                      <span style={{ fontSize: '40px' }}>{cfg.icon}</span>
                      <div>
                        <h3 style={{ margin: 0, color: '#1a1a2e', fontSize: '16px', fontWeight: '700' }}>
                          {order.listingId?.title || 'Booking'}
                        </h3>
                        <span style={{ background: cfg.color, color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{cfg.label}</span>
                      </div>
                    </div>
                    <div style={{ padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: '#718096', fontSize: '13px' }}>Amount Paid</span>
                        <span style={{ color: cfg.color, fontWeight: '800', fontSize: '22px' }}>₹{order.amount}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ color: '#718096', fontSize: '13px' }}>Status</span>
                        <span style={{ background: '#f0fff4', color: '#276749', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                          ✅ {order.status || 'Confirmed'}
                        </span>
                      </div>
                      {order.listingId?.location && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <span style={{ color: '#718096', fontSize: '13px' }}>Location</span>
                          <span style={{ color: '#4a5568', fontSize: '13px', fontWeight: '600' }}>📍 {order.listingId.location}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                        {order.listingId?.location && (
                          <button onClick={() => handleViewMap(order)}
                            style={{ flex: 1, padding: '9px', background: 'white', color: cfg.color, border: `2px solid ${cfg.color}`, borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                            🗺️ View Map
                          </button>
                        )}
                        <button onClick={() => handleCancel(order._id)}
                          style={{ flex: 1, padding: '9px', background: '#fff5f5', color: '#e53e3e', border: '2px solid #fc8181', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {mapItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: '#1a1a2e' }}>
            <div>
              <h3 style={{ color: 'white', margin: 0 }}>{config(mapItem.listingId?.category).icon} {mapItem.listingId?.title}</h3>
              <p style={{ color: '#a0aec0', margin: 0, fontSize: '14px' }}>📍 {mapItem.listingId?.location}</p>
            </div>
            <button onClick={() => { setMapItem(null); setMapCoords(null); }}
              style={{ background: '#e94560', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>
              ✕ Close
            </button>
          </div>
          <div style={{ flex: 1 }}>
            {mapLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <p style={{ color: 'white', fontSize: '20px' }}>⏳ Loading map...</p>
              </div>
            ) : mapCoords ? (
              <MapContainer center={mapCoords} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                <Marker position={mapCoords}>
                  <Popup><b>{mapItem.listingId?.title}</b><br />📍 {mapItem.listingId?.location}<br />₹{mapItem.amount}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <p style={{ color: 'white', fontSize: '20px' }}>😕 Map not available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;