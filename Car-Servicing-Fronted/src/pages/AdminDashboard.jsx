import React, { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    cancelled: 0
  });

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/bookings");
      setBookings(res.data);
      calculateStats(res.data);
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

  // Update booking status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/booking/${id}?status=${status}`);
      setMessage({ 
        text: `Booking #${id} status updated to ${status} successfully!`, 
        type: "success" 
      });
      fetchBookings();
      
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage({ 
        text: error.response?.data?.message || "Failed to update status", 
        type: "error" 
      });
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    try {
      await API.delete(`/admin/booking/${id}`);
      setMessage({ 
        text: `Booking #${id} deleted successfully!`, 
        type: "success" 
      });
      setShowDeleteModal(false);
      setBookingToDelete(null);
      fetchBookings();
      
      setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error deleting booking:", error);
      setMessage({ 
        text: error.response?.data?.message || "Failed to delete booking", 
        type: "error" 
      });
      setShowDeleteModal(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data) => {
    const total = data.length;
    const pending = data.filter(b => b.status?.toLowerCase() === 'pending').length;
    const approved = data.filter(b => b.status?.toLowerCase() === 'approved').length;
    const completed = data.filter(b => b.status?.toLowerCase() === 'completed').length;
    const cancelled = data.filter(b => b.status?.toLowerCase() === 'cancelled').length;

    setStats({
      total,
      pending,
      approved,
      completed,
      cancelled
    });
  };

  // Filter bookings by status
  const filteredBookings = statusFilter === "ALL" 
    ? bookings 
    : bookings.filter(booking => booking.status?.toUpperCase() === statusFilter);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch(statusLower) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
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
      <Navbar title="Admin Dashboard" />
      <div className="admin-dashboard-container">
        
        {/* Welcome Header */}
        <div className="admin-welcome-header">
          <h1>📊 Admin Dashboard</h1>
          <p>Manage all bike service bookings</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`admin-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-details">
              <h3>Total Bookings</h3>
              <p className="stat-number">{stats.total}</p>
            </div>
          </div>
          
          <div className="admin-stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-details">
              <h3>Pending</h3>
              <p className="stat-number">{stats.pending}</p>
            </div>
          </div>
          
          <div className="admin-stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <h3>Approved</h3>
              <p className="stat-number">{stats.approved}</p>
            </div>
          </div>
          
          <div className="admin-stat-card completed">
            <div className="stat-icon">🏆</div>
            <div className="stat-details">
              <h3>Completed</h3>
              <p className="stat-number">{stats.completed}</p>
            </div>
          </div>
          
          <div className="admin-stat-card cancelled">
            <div className="stat-icon">❌</div>
            <div className="stat-details">
              <h3>Cancelled</h3>
              <p className="stat-number">{stats.cancelled}</p>
            </div>
          </div>
        </div>

        {/* Status Filter Only */}
        <div className="admin-filter-section">
          <div className="admin-filter-group">
            <label>Filter by Status:</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="admin-bookings-table-container">
          <h3>All Bookings {filteredBookings.length !== bookings.length && 
            `(Showing ${filteredBookings.length} of ${bookings.length})`}
          </h3>

          {loading ? (
            <div className="admin-loading-state">
              <div className="admin-spinner-large"></div>
              <p>Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="admin-empty-state">
              <div className="empty-icon">📭</div>
              <h4>No Bookings Found</h4>
              <p>No bookings match the selected status</p>
            </div>
          ) : (
            <div className="admin-table-responsive">
              <table className="admin-bookings-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User Details</th>
                    <th>Bike Model</th>
                    <th>Service Type</th>
                    <th>Booking Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="booking-id-cell">#{booking.id}</td>
                      <td>
                        <div className="user-info">
                          <strong>{booking.user?.name || 'N/A'}</strong>
                          <small>ID: {booking.user?.id || 'N/A'}</small>
                          <small>{booking.user?.email || ''}</small>
                        </div>
                      </td>
                      <td>{booking.bikeModel}</td>
                      <td>{booking.serviceType}</td>
                      <td>{formatDate(booking.bookingDate)}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadge(booking.status)}`}>
                          {booking.status || 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {/* Status Change Dropdown - Always Visible */}
                          <select
                            onChange={(e) => updateStatus(booking.id, e.target.value)}
                            className="status-select"
                            value=""
                            defaultValue=""
                          >
                            <option value="" disabled>Change Status</option>
                            <option value="PENDING">⏳ Pending</option>
                            <option value="APPROVED">✅ Approve</option>
                            <option value="COMPLETED">🏆 Complete</option>
                            <option value="CANCELLED">❌ Cancel</option>
                          </select>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => {
                              setShowDeleteModal(true);
                              setBookingToDelete(booking.id);
                            }}
                            className="delete-btn"
                            title="Delete Booking"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal">
              <div className="modal-icon">⚠️</div>
              <h3>Delete Booking</h3>
              <p>Are you sure you want to delete booking #{bookingToDelete}?</p>
              <p className="modal-warning">This action cannot be undone!</p>
              <div className="modal-actions">
                <button 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBookingToDelete(null);
                  }}
                  className="modal-cancel"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteBooking(bookingToDelete)}
                  className="modal-confirm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;