import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiCheck, FiTrash2, FiClock, FiMessageCircle, FiSend, FiX, FiLoader } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      
      if (!token || !isAdmin) {
        toast.error("Please login as admin first");
        setLoading(false);
        return;
      }
      
      const res = await axios.get(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setContacts(res.data.data);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setContacts(contacts.map(c => 
        c._id === id ? { ...c, isRead: true } : c
      ));
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const deleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setContacts(contacts.filter(c => c._id !== id));
      setSelectedContact(null);
      toast.success("Contact deleted");
    } catch (err) {
      toast.error("Failed to delete contact");
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/contact/reply`, {
        to: selectedContact.email,
        name: selectedContact.name,
        replyMessage: replyMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Reply sent successfully!");
      setReplyMessage("");
      setShowReplyModal(false);
      fetchContacts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
            <p className="text-gray-400">Manage user inquiries and messages</p>
          </div>
          <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium">
            {contacts.length} Messages
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Messages List */}
          <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">All Messages</h2>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No messages yet
              </div>
            ) : (
              <div className="divide-y divide-white/5 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                {contacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${
                      selectedContact?._id === contact._id ? 'bg-emerald-500/10' : ''
                    } ${!contact.isRead ? 'border-l-4 border-l-emerald-500' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${contact.isRead ? 'bg-gray-500' : 'bg-emerald-500'}`}></span>
                          <span className="text-white font-medium truncate">{contact.name}</span>
                        </div>
                        <p className="text-gray-400 text-sm truncate">{contact.message}</p>
                        <p className="text-gray-500 text-xs mt-1">{formatDate(contact.createdAt)}</p>
                      </div>
                      <FiMail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
            {selectedContact ? (
              <>
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Message Details</h2>
                  <div className="flex items-center gap-2">
                    {!selectedContact.isRead && (
                      <button
                        onClick={() => markAsRead(selectedContact._id)}
                        className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                        title="Mark as read"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteContact(selectedContact._id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">
                        {selectedContact.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold truncate">{selectedContact.name}</h3>
                      <p className="text-emerald-400 text-sm truncate">{selectedContact.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                      <FiClock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{formatDate(selectedContact.createdAt)}</span>
                    </div>
                    
                    <div>
                      <h4 className="text-gray-400 text-sm mb-2">Message</h4>
                      <div className="bg-[#030712] border border-white/5 rounded-xl p-4">
                        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {selectedContact.message}
                        </p>
                      </div>
                    </div>

                    {/* Reply Button - Mobile */}
                    <button 
                      onClick={() => setShowReplyModal(true)}
                      className="w-full flex sm:hidden items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium"
                    >
                      <FiSend className="w-4 h-4" />
                      Reply via Email
                    </button>

                    {/* Reply Form - Desktop */}
                    <div className="hidden sm:block space-y-3">
                      <h4 className="text-gray-400 text-sm">Send Reply</h4>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        rows={4}
                        className="w-full px-4 py-3 bg-[#030712] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none text-sm"
                      />
                      <button
                        onClick={handleSendReply}
                        disabled={sending || !replyMessage.trim()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-medium transition-all"
                      >
                        {sending ? (
                          <>
                            <FiLoader className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FiSend className="w-4 h-4" />
                            Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <FiMessageCircle className="w-16 h-16 text-gray-600 mb-4" />
                <p className="text-gray-400">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Reply Modal - Mobile */}
        {showReplyModal && selectedContact && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-[#0d0d1a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-white">Reply to {selectedContact.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedContact.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyMessage("");
                  }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="bg-[#030712] border border-white/5 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2">Original Message:</p>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">{selectedContact.message}</p>
                </div>

                <div>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={5}
                    className="w-full px-4 py-3 bg-[#030712] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none text-sm"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowReplyModal(false);
                      setReplyMessage("");
                    }}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={sending || !replyMessage.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-medium transition-all"
                  >
                    {sending ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
