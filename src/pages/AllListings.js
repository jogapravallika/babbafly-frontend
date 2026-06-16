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

function AllListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi' or 'card'
  const [upiId, setUpiId] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
  const [fullMapItem, setFullMapItem] = useState(null);
  const [mapCoords, setMapCoords] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [upiTimer, setUpiTimer] = useState(null);
  const [showQR, setShowQR] = useState(false);

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

    if (paymentTab === 'upi' && !upiId) {
      setBookingStatus('❌ Please enter your UPI ID!'); return;
    }
    if (paymentTab === 'card') {
      if (!paymentInfo.cardName || !paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv) {
        setBookingStatus('❌ Please fill all card details!'); return;
      }
    }

    try {
      const res = await axios.post(`${API}/api/orders`, {
        userId: user._id, listingId: selectedItem._id, amount: selectedItem.price
      });
      if (res.data.success) {
        setBookingStatus('✅ Payment Successful! Booking Confirmed!');
        setTimeout(() => {
          setSelectedItem(null); setBookingStatus('');
          setPaymentInfo({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
          setUpiId(''); setShowQR(false);
        }, 2500);
      }
    } catch (err) { setBookingStatus('❌ Booking failed! Try again.'); }
  };

  const handleShowQR = () => {
    setShowQR(true);
    let t = 180;
    const interval = setInterval(() => {
      t--;
      setUpiTimer(t);
      if (t <= 0) { clearInterval(interval); setShowQR(false); setUpiTimer(null); }
    }, 1000);
  };

  const config = (cat) => categoryConfig[cat] || { color: '#888', bg: '#f9f9f9', icon: '📦', label: cat };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0e27 0%, #0d1b4b 40%, #1a0533 70%, #0a0e27 100%)' }}>

      {/* Header */}
      <div style={{ padding: '30px 20px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '700px', margin: '0 auto 15px' }}>
          <input
            placeholder="🔍 Search by city..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchListings()}
            style={{ padding: '14px 20px', borderRadius: '12px', border: '2px solid rgba(255,105,180,0.25)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '15px', width: '260px', outline: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            style={{ padding: '14px 20px', borderRadius: '12px', border: '2px solid rgba(255,105,180,0.25)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '15px', outline: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <option value="" style={{ color: '#1a1a2e' }}>Sort By</option>
            <option value="latest" style={{ color: '#1a1a2e' }}>⏰ Latest</option>
            <option value="price_low" style={{ color: '#1a1a2e' }}>💰 Low to High</option>
            <option value="price_high" style={{ color: '#1a1a2e' }}>💎 High to Low</option>
            <option value="popular" style={{ color: '#1a1a2e' }}>⭐ Popular</option>
          </select>
          <button onClick={fetchListings}
            style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #e94560, #f5576c)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', boxShadow: '0 4px 20px rgba(233,69,96,0.4)' }}>
            Search
          </button>
        </div>
        <button onClick={() => navigate('/my-bookings')}
          style={{ padding: '11px 30px', background: 'rgba(255,255,255,0.06)', color: 'white', border: '2px solid rgba(255,105,180,0.35)', borderRadius: '50px', cursor: 'pointer', fontSize: '15px', fontWeight: '700', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(233,69,96,0.25)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(233,69,96,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>
          📋 My Bookings
        </button>
      </div>

      {/* Listings Grid */}
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
                  style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s', backdropFilter: 'blur(10px)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(233,69,96,0.3)'; e.currentTarget.style.border = '1px solid rgba(233,69,96,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; }}>
                  <div style={{ background: `linear-gradient(135deg, ${cfg.color}33, ${cfg.color}11)`, padding: '25px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: `3px solid ${cfg.color}` }}>
                    <span style={{ fontSize: '50px' }}>{cfg.icon}</span>
                    <div>
                      <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 }}>{item.title}</h3>
                      <span style={{ background: cfg.color, color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{cfg.label}</span>
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{ color: '#a0aec0', fontSize: '14px', marginBottom: '12px', lineHeight: '1.5' }}>{item.description}</p>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                      <span style={{ color: '#cbd5e0', fontSize: '14px' }}>📍 {item.location || 'N/A'}</span>
                      <span style={{ color: '#cbd5e0', fontSize: '14px' }}>⭐ {item.rating || 0}/5</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ color: '#718096', fontSize: '12px' }}>Starting from</span>
                        <p style={{ color: cfg.color, fontWeight: '800', fontSize: '24px', margin: 0, textShadow: `0 0 12px ${cfg.color}55` }}>₹{item.price}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                        <button onClick={() => { setSelectedItem(item); setBookingStatus(''); setPaymentTab('upi'); setShowQR(false); setUpiId(''); }}
                          style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #e94560, #f5576c)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 14px rgba(233,69,96,0.35)' }}>
                          🎟️ Book Now
                        </button>
                        {item.location && (
                          <button onClick={() => handleViewMap(item)}
                            style={{ padding: '8px 18px', background: 'rgba(255,255,255,0.06)', color: 'white', border: `2px solid ${cfg.color}88`, borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
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

      {/* Map Modal */}
      {fullMapItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5,7,20,0.92)', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: 'linear-gradient(135deg, #0a0e27, #1a0533)', borderBottom: '1px solid rgba(255,105,180,0.2)' }}>
            <div>
              <h3 style={{ color: 'white', margin: 0 }}>{config(fullMapItem.category).icon} {fullMapItem.title}</h3>
              <p style={{ color: '#a0aec0', margin: 0, fontSize: '14px' }}>📍 {fullMapItem.location}</p>
            </div>
            <button onClick={() => { setFullMapItem(null); setMapCoords(null); }}
              style={{ background: 'linear-gradient(135deg, #e94560, #f5576c)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', boxShadow: '0 4px 14px rgba(233,69,96,0.4)' }}>
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

      {/* Payment Modal - Dark UPI Style */}
      {selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(5,7,20,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'linear-gradient(135deg, #0a0e27, #0d1b4b, #1a0533)', borderRadius: '24px', padding: '30px', maxWidth: '460px', width: '92%', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(255,105,180,0.15)' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '40px' }}>{config(selectedItem.category).icon}</span>
              <h2 style={{ color: 'white', margin: '8px 0 2px', fontSize: '20px', fontWeight: '800' }}>{selectedItem.title}</h2>
              <p style={{ color: '#a0aec0', margin: 0, fontSize: '13px' }}>📍 {selectedItem.location || 'N/A'}</p>
            </div>

            {/* Amount Box */}
            <div style={{ background: 'rgba(233,69,96,0.15)', border: '1px solid rgba(233,69,96,0.4)', borderRadius: '14px', padding: '15px', textAlign: 'center', marginBottom: '22px', boxShadow: '0 0 20px rgba(233,69,96,0.15)' }}>
              <p style={{ color: '#a0aec0', margin: '0 0 4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount</p>
              <p style={{ color: '#ff6b9d', fontSize: '36px', fontWeight: '900', margin: 0, textShadow: '0 0 20px rgba(233,69,96,0.5)' }}>₹{selectedItem.price}</p>
            </div>

            {/* Payment Tabs */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
              <button onClick={() => { setPaymentTab('upi'); setShowQR(false); }}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s',
                  background: paymentTab === 'upi' ? 'linear-gradient(135deg, #e94560, #f5576c)' : 'transparent',
                  color: paymentTab === 'upi' ? 'white' : '#a0aec0',
                  boxShadow: paymentTab === 'upi' ? '0 4px 14px rgba(233,69,96,0.4)' : 'none' }}>
                📱 UPI / QR
              </button>
              <button onClick={() => { setPaymentTab('card'); setShowQR(false); }}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'all 0.2s',
                  background: paymentTab === 'card' ? 'linear-gradient(135deg, #e94560, #f5576c)' : 'transparent',
                  color: paymentTab === 'card' ? 'white' : '#a0aec0',
                  boxShadow: paymentTab === 'card' ? '0 4px 14px rgba(233,69,96,0.4)' : 'none' }}>
                💳 Card
              </button>
            </div>

            {/* UPI Tab */}
            {paymentTab === 'upi' && (
              <div>
                {!showQR ? (
                  <div>
                    <p style={{ color: '#cbd5e0', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>Enter your UPI ID:</p>
                    <input
                      placeholder="yourname@upi / yourname@paytm"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '2px solid rgba(255,105,180,0.2)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
                    />
                    <p style={{ color: '#718096', fontSize: '12px', textAlign: 'center', marginBottom: '14px' }}>— OR —</p>
                    <button onClick={handleShowQR}
                      style={{ width: '100%', padding: '13px', background: 'rgba(255,255,255,0.07)', color: 'white', border: '2px solid rgba(255,105,180,0.25)', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
                      📷 Pay with QR Code
                    </button>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                        <div key={app} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,105,180,0.15)' }}>
                          <p style={{ color: '#cbd5e0', fontSize: '11px', margin: 0, fontWeight: '600' }}>{app}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#a0aec0', fontSize: '13px', marginBottom: '12px' }}>Scan QR Code to pay:</p>
                    <div style={{ width: '180px', height: '180px', margin: '0 auto 12px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', boxShadow: '0 0 25px rgba(233,69,96,0.3)' }}>
                      <svg viewBox="0 0 100 100" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" fill="white"/>
                        <rect x="5" y="5" width="35" height="35" fill="none" stroke="black" strokeWidth="3"/>
                        <rect x="12" y="12" width="21" height="21" fill="black"/>
                        <rect x="60" y="5" width="35" height="35" fill="none" stroke="black" strokeWidth="3"/>
                        <rect x="67" y="12" width="21" height="21" fill="black"/>
                        <rect x="5" y="60" width="35" height="35" fill="none" stroke="black" strokeWidth="3"/>
                        <rect x="12" y="67" width="21" height="21" fill="black"/>
                        <rect x="45" y="5" width="5" height="5" fill="black"/>
                        <rect x="45" y="15" width="5" height="5" fill="black"/>
                        <rect x="45" y="25" width="5" height="5" fill="black"/>
                        <rect x="55" y="45" width="5" height="5" fill="black"/>
                        <rect x="60" y="45" width="5" height="5" fill="black"/>
                        <rect x="70" y="45" width="5" height="5" fill="black"/>
                        <rect x="80" y="45" width="5" height="5" fill="black"/>
                        <rect x="90" y="45" width="5" height="5" fill="black"/>
                        <rect x="45" y="55" width="5" height="5" fill="black"/>
                        <rect x="55" y="55" width="5" height="5" fill="black"/>
                        <rect x="65" y="55" width="5" height="5" fill="black"/>
                        <rect x="75" y="55" width="5" height="5" fill="black"/>
                        <rect x="45" y="65" width="5" height="5" fill="black"/>
                        <rect x="60" y="65" width="5" height="5" fill="black"/>
                        <rect x="70" y="65" width="5" height="5" fill="black"/>
                        <rect x="85" y="65" width="5" height="5" fill="black"/>
                        <rect x="50" y="75" width="5" height="5" fill="black"/>
                        <rect x="65" y="75" width="5" height="5" fill="black"/>
                        <rect x="80" y="75" width="5" height="5" fill="black"/>
                        <rect x="55" y="85" width="5" height="5" fill="black"/>
                        <rect x="70" y="85" width="5" height="5" fill="black"/>
                        <rect x="90" y="85" width="5" height="5" fill="black"/>
                        <rect x="45" y="45" width="5" height="5" fill="black"/>
                        <text x="50" y="52" textAnchor="middle" fontSize="4" fill="#e94560" fontWeight="bold">BabbaFly</text>
                      </svg>
                    </div>
                    <p style={{ color: '#ff6b9d', fontSize: '18px', fontWeight: '800', margin: '0 0 4px' }}>₹{selectedItem.price}</p>
                    {upiTimer !== null && (
                      <p style={{ color: upiTimer < 30 ? '#fc8181' : '#68d391', fontSize: '13px', margin: '4px 0 12px' }}>
                        ⏱ {Math.floor(upiTimer/60)}:{String(upiTimer%60).padStart(2,'0')} remaining
                      </p>
                    )}
                    <button onClick={() => { setShowQR(false); setUpiTimer(null); }}
                      style={{ background: 'transparent', color: '#a0aec0', border: 'none', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}>
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Card Tab */}
            {paymentTab === 'card' && (
              <div>
                {/* Card Preview */}
                <div style={{ background: 'linear-gradient(135deg, #e94560, #f5576c, #4a3f99)', borderRadius: '16px', padding: '20px', marginBottom: '18px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 25px rgba(233,69,96,0.3)' }}>
                  <div style={{ position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: '-50px', right: '-30px' }} />
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '0 0 15px', letterSpacing: '2px' }}>DEBIT / CREDIT CARD</p>
                  <p style={{ color: 'white', fontSize: '18px', fontWeight: '700', letterSpacing: '3px', margin: '0 0 15px', fontFamily: 'monospace' }}>
                    {paymentInfo.cardNumber ? paymentInfo.cardNumber.replace(/(.{4})/g, '$1 ').trim() : '**** **** **** ****'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', margin: '0', letterSpacing: '1px' }}>CARD HOLDER</p>
                      <p style={{ color: 'white', fontSize: '13px', fontWeight: '700', margin: '2px 0 0' }}>{paymentInfo.cardName || 'YOUR NAME'}</p>
                    </div>
                    <div>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', margin: '0', letterSpacing: '1px' }}>EXPIRES</p>
                      <p style={{ color: 'white', fontSize: '13px', fontWeight: '700', margin: '2px 0 0' }}>{paymentInfo.expiry || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>

                <input placeholder="Card Holder Name" value={paymentInfo.cardName}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '2px solid rgba(255,105,180,0.2)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', outline: 'none' }} />
                <input placeholder="Card Number (16 digits)" value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                  maxLength={16}
                  style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '2px solid rgba(255,105,180,0.2)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box', outline: 'none', fontFamily: 'monospace' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input placeholder="MM/YY" value={paymentInfo.expiry}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                    maxLength={5} style={{ width: '50%', padding: '12px 15px', borderRadius: '10px', border: '2px solid rgba(255,105,180,0.2)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                  <input placeholder="CVV" value={paymentInfo.cvv}
                    onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                    maxLength={3} type="password" style={{ width: '50%', padding: '12px 15px', borderRadius: '10px', border: '2px solid rgba(255,105,180,0.2)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>
            )}

            {bookingStatus && (
              <div style={{ textAlign: 'center', padding: '12px', borderRadius: '10px', margin: '15px 0', background: bookingStatus.includes('✅') ? 'rgba(104,211,145,0.15)' : 'rgba(252,129,129,0.15)', border: `1px solid ${bookingStatus.includes('✅') ? '#68d391' : '#fc8181'}` }}>
                <p style={{ margin: 0, color: bookingStatus.includes('✅') ? '#68d391' : '#fc8181', fontWeight: '600' }}>{bookingStatus}</p>
              </div>
            )}

            <button onClick={handleBook}
              style={{ width: '100%', padding: '15px', background: 'linear-gradient(135deg, #e94560, #f5576c)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: '800', marginTop: '18px', boxShadow: '0 6px 20px rgba(233,69,96,0.45)', letterSpacing: '0.5px' }}>
              ✅ Pay ₹{selectedItem.price}
            </button>
            <button onClick={() => { setSelectedItem(null); setBookingStatus(''); setPaymentInfo({ cardName: '', cardNumber: '', expiry: '', cvv: '' }); setUpiId(''); setShowQR(false); }}
              style={{ width: '100%', padding: '13px', background: 'transparent', color: '#718096', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', marginTop: '10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllListings;