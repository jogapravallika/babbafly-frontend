import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  'cars': { color: '#FF6B6B', bg: '#FFF5F5', icon: '🚗', label: 'Car' },
  'bikes': { color: '#4ECDC4', bg: '#F0FFFE', icon: '🏍️', label: 'Bike' },
  'flights': { color: '#45B7D1', bg: '#F0F9FF', icon: '✈️', label: 'Flight' },
  'trains': { color: '#96CEB4', bg: '#F0FFF4', icon: '🚂', label: 'Train' },
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

function Listings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
  const [fullMapItem, setFullMapItem] = useState(null);
  const [mapCoords, setMapCoords] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      let url = `${API}/api/listings?`;
      if (location) url += `location=${location}&`;
      if (sort) url += `sort=${sort}&`;
      const res = await axios.get(url);
      setListings(res.data.listings);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleViewMap = async (item) => {
    setFullMapItem(item);
    setMapCoords(null);
    setMapLoading(true);
    const coords = await getCoords(item.location);
    setMapCoords(coords);
    setMapLoading(false);
  };

  const handleBook = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) { setBookingStatus('❌ Please login first!'); return; }
    if (!paymentInfo.cardName || !paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv) {
      setBookingStatus('❌ Please fill all payment details!'); return;
    }
    try {
      const res = await axios.post(`${API}/api/orders`, {
        userId: user._id, listingId: selectedItem._id, amount: selectedItem.price
      });
      if (res.data.success) {
        setBookingStatus('✅ Booking Successful! Payment Done!');
        setTimeout(() => {
          setSelectedItem(null); setBookingStatus('');
          setPaymentInfo({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
        }, 2500);
      }
    } catch (err) { setBookingStatus('❌ Booking failed! Try again.'); }
  };

  const config = (cat) => categoryConfig[cat] || { color: '#888', bg: '#f9f9f9', icon: '📦', label: cat };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div style={{ padding: '50px 20px 40px', textAlign: 'center' }}>
        <span style={{ fontSize: '50px' }}>🚀</span>
        <h1 style={{ fontSize: '72px', fontWeight: '900', margin: '5px 0 8px', background: 'linear-gradient(135deg, #ff6b6b, #e94560, #f5576c, #45b7d1, #96ceb4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-2px', lineHeight: 1 }}>
          BabbaFly
        </h1>
        <p style={{ color: '#a0aec0', fontSize: '15px', marginBottom: '30px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Book Cars, Bikes, Flights & Trains across India
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '700px', margin: '0 auto 25px' }}>
          <input placeholder="🔍 Search by city..." value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchListings()}
            style={{ padding: '14px 20px', borderRadius: '12px', border: 'none', fontSize: '15px', width: '280px', outline: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ padding: '14px 20px', borderRadius: '12px', border: 'none', fontSize: '15px', outline: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            <option value="">Sort By</option>
            <option value="latest">⏰ Latest</option>
            <option value="price_low">💰 Low to High</option>
            <option value="price_high">💎 High to Low</option>
            <option value="popular">⭐ Popular</option>
          </select>
          <button onClick={fetchListings}
            style={{ padding: '14px 30px', background: '#e94560', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
            Search
          </button>
        </div>
        <button onClick={() => navigate('/my-bookings')}
          style={{ padding: '13px 35px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', backdropFilter: 'blur(10px)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(233,69,96,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}>
          📋 My Bookings
        </button>
      </div>

      <div style={{ padding: '10px 20px 40px', maxWidth: '1300px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}><p style={{ fontSize: '20px', color: '#a0aec0' }}>⏳ Loading listings...</p></div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}><p style={{ fontSize: '20px', color: '#a0aec0' }}>😕 No listings found</p></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
            {listings.map((item) => {
              const cfg = config(item.category);
              return (
                <div key={item._id}
                  style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}44)`, padding: '25px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: `3px solid ${cfg.color}` }}>
                    <span style={{ fontSize: '50px' }}>{cfg.icon}</span>
                    <div>
                      <h3 style={{ color: '#1a1a2e', fontSize: '18px', fontWeight: '700', margin: 0 }}>{item.title}</h3>
                      <span style={{ background: cfg.color, color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{cfg.label}</span>
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px', lineHeight: '1.5' }}>{item.description}</p>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      <span style={{ color: '#4a5568', fontSize: '14px' }}>📍 {item.location || 'N/A'}</span>
                      <span style={{ color: '#4a5568', fontSize: '14px' }}>⭐ {item.rating || 0}/5</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ color: '#999', fontSize: '12px' }}>Starting from</span>
                        <p style={{ color: cfg.color, fontWeight: '800', fontSize: '24px', margin: 0 }}>₹{item.price}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                        <button onClick={() => { setSelectedItem(item); setBookingStatus(''); }}
                          style={{ padding: '10px 18px', background: cfg.color, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                          🎟️ Book Now
                        </button>
                        {item.location && (
                          <button onClick={() => handleViewMap(item)}
                            style={{ padding: '8px 18px', background: 'white', color: cfg.color, border: `2px solid ${cfg.color}`, borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                            🗺️ View Map
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {fullMapItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: '#1a1a2e' }}>
            <div>
              <h3 style={{ color: 'white', margin: 0 }}>{config(fullMapItem.category).icon} {fullMapItem.title}</h3>
              <p style={{ color: '#a0aec0', margin: 0, fontSize: '14px' }}>📍 {fullMapItem.location}</p>
            </div>
            <button onClick={() => { setFullMapItem(null); setMapCoords(null); }}
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
                  <Popup><b>{fullMapItem.title}</b><br />📍 {fullMapItem.location}<br />₹{fullMapItem.price}</Popup>
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

      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '35px', maxWidth: '480px', width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h2 style={{ color: '#1a1a2e', textAlign: 'center', marginBottom: '20px' }}>🎟️ Complete Your Booking</h2>
            <div style={{ background: config(selectedItem.category).bg, borderRadius: '12px', padding: '20px', marginBottom: '20px', border: `2px solid ${config(selectedItem.category).color}22` }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{ fontSize: '40px' }}>{config(selectedItem.category).icon}</span>
                <div>
                  <h3 style={{ margin: 0, color: '#1a1a2e' }}>{selectedItem.title}</h3>
                  <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>📍 {selectedItem.location || 'N/A'}</p>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '15px', padding: '10px', background: 'white', borderRadius: '8px' }}>
                <p style={{ margin: 0, color: '#999', fontSize: '12px' }}>Total Amount</p>
                <p style={{ margin: 0, color: config(selectedItem.category).color, fontSize: '28px', fontWeight: '800' }}>₹{selectedItem.price}</p>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#1a1a2e', marginBottom: '15px', fontSize: '16px' }}>💳 Payment Details</h3>
              <input placeholder="Card Holder Name" value={paymentInfo.cardName}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }} />
              <input placeholder="Card Number (16 digits)" value={paymentInfo.cardNumber}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                maxLength={16}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', outline: 'none' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <input placeholder="MM/YY" value={paymentInfo.expiry}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                  maxLength={5} style={{ width: '50%', padding: '12px 15px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                <input placeholder="CVV" value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                  maxLength={3} type="password" style={{ width: '50%', padding: '12px 15px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
              </div>
            </div>
            {bookingStatus && (
              <div style={{ textAlign: 'center', padding: '12px', borderRadius: '10px', marginBottom: '15px', background: bookingStatus.includes('✅') ? '#f0fff4' : '#fff5f5', border: `1px solid ${bookingStatus.includes('✅') ? '#68d391' : '#fc8181'}` }}>
                <p style={{ margin: 0, color: bookingStatus.includes('✅') ? '#276749' : '#c53030', fontWeight: '600' }}>{bookingStatus}</p>
              </div>
            )}
            <button onClick={handleBook}
              style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #e94560, #f5576c)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>
              ✅ Confirm & Pay ₹{selectedItem.price}
            </button>
            <button onClick={() => { setSelectedItem(null); setBookingStatus(''); setPaymentInfo({ cardName: '', cardNumber: '', expiry: '', cvv: '' }); }}
              style={{ width: '100%', padding: '13px', background: 'white', color: '#666', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '600' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Listings;