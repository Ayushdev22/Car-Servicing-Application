import React, { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import "../styles/UserDashboard.css"; // Create this CSS file

function UserDashboard() {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "User";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // Form state
  const [bookingForm, setBookingForm] = useState({
    bikeModel: "",
    serviceType: "",
    bookingDate: ""
  });

  // Service types
  const serviceTypes = [
    "General Service",
    "Oil Change",
    "Brake Repair",
    "Engine Check",
    "Battery Replacement",
    "Tire Change",
    "Full Service"
  ];

  const fetchBookings = async () => {
    if (!userId) {
      setMessage({ text: "User not logged in!", type: "error" });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(`/bookings/user/${userId}`);
      // Sort bookings by date (newest first)
      const sortedBookings = res.data.sort((a, b) => 
        new Date(b.bookingDate) - new Date(a.bookingDate)
      );
      setBookings(sortedBookings);
      setMessage({ text: "", type: "" });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage({ 
        text: error.response?.data?.message || "Failed to load bookings", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async () => {
    // Validation
    if (!bookingForm.bikeModel || !bookingForm.serviceType || !bookingForm.bookingDate) {
      setMessage({ text: "Please fill in all fields!", type: "error" });
      return;
    }

    // Validate date is not in past
    const selectedDate = new Date(bookingForm.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setMessage({ text: "Booking date cannot be in the past!", type: "error" });
      return;
    }

    setCreating(true);
    setMessage({ text: "", type: "" });

    try {
      await API.post("/bookings", {
        bikeModel: bookingForm.bikeModel,
        serviceType: bookingForm.serviceType,
        bookingDate: bookingForm.bookingDate,
        status: "PENDING",
        user: { id: parseInt(userId) }
      });

      setMessage({ text: "Booking created successfully!", type: "success" });
      
      // Reset form
      setBookingForm({
        bikeModel: "",
        serviceType: "",
        bookingDate: ""
      });

      // Refresh bookings
      await fetchBookings();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);

    } catch (error) {
      console.error("Error creating booking:", error);
      setMessage({ 
        text: error.response?.data?.message || "Failed to create booking", 
        type: "error" 
      });
    } finally {
      setCreating(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await API.delete(`/bookings/${bookingId}`);
      setMessage({ text: "Booking cancelled successfully!", type: "success" });
      fetchBookings();
      
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || "Failed to cancel booking", 
        type: "error" 
      });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch(statusLower) {
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  return (
    <>
      <Navbar title="User Dashboard" />
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="welcome-header">
          <h1>Welcome back, {userName}! 👋</h1>
          <p>Manage your bike service bookings</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Create Booking Section */}
        <div className="dashboard-grid">
          <div className="dashboard-card create-booking-card">
            <div className="card-header">
              <h3>📅 Book New Service</h3>
              <p>Schedule your bike service</p>
            </div>

            <div className="booking-form">
              <div className="form-group">
                <label>Bike Model</label>
                <input
                  type="text"
                  placeholder="e.g., Honda CB Shine, Bajaj Pulsar"
                  value={bookingForm.bikeModel}
                  onChange={e => setBookingForm({...bookingForm, bikeModel: e.target.value})}
                  className="form-input"
                  disabled={creating}
                />
              </div>

              <div className="form-group">
                <label>Service Type</label>
                <select
                  value={bookingForm.serviceType}
                  onChange={e => setBookingForm({...bookingForm, serviceType: e.target.value})}
                  className="form-select"
                  disabled={creating}
                >
                  <option value="">Select service type</option>
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Booking Date</label>
                <input
                  type="date"
                  value={bookingForm.bookingDate}
                  onChange={e => setBookingForm({...bookingForm, bookingDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="form-input"
                  disabled={creating}
                />
              </div>

              <button 
                onClick={createBooking} 
                className={`book-button ${creating ? 'loading' : ''}`}
                disabled={creating}
              >
                {creating ? (
                  <>
                    <span className="spinner"></span>
                    Booking...
                  </>
                ) : (
                  'Book Service'
                )}
              </button>
            </div>
          </div>

          {/* Previous Bookings Section */}
          <div className="dashboard-card bookings-card">
            <div className="card-header">
              <h3>📋 Your Bookings</h3>
              <p>{bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found</p>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="spinner-large"></div>
                <p>Loading your bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🛵</div>
                <h4>No Bookings Yet</h4>
                <p>Book your first bike service today!</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <span className="booking-id">Booking #{booking.id}</span>
                      <span className={`status-badge ${getStatusBadge(booking.status)}`}>
                        {booking.status || 'PENDING'}
                      </span>
                    </div>
                    
                    <div className="booking-details">
                      <div className="detail-row">
                        <span className="detail-label">🏍️ Bike Model:</span>
                        <span className="detail-value">{booking.bikeModel}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">🔧 Service Type:</span>
                        <span className="detail-value">{booking.serviceType}</span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">📅 Booking Date:</span>
                        <span className="detail-value">{formatDate(booking.bookingDate)}</span>
                      </div>
                      
                      {booking.status?.toLowerCase() === 'pending' && (
                        <div className="booking-actions">
                          <button 
                            onClick={() => cancelBooking(booking.id)}
                            className="cancel-button"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h4>Total Bookings</h4>
              <p>{bookings.length}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h4>Pending</h4>
              <p>{bookings.filter(b => b.status?.toLowerCase() === 'pending').length}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h4>Completed</h4>
              <p>{bookings.filter(b => b.status?.toLowerCase() === 'completed').length}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;