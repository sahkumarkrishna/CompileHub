import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiX, FiSend, FiLoader } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ReplyModal = ({ isOpen, onClose, contact, onSend }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/contact/reply`, {
        to: contact.email,
        name: contact.name,
        replyMessage: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Reply sent successfully!");
      setMessage("");
      onSend();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#0d0d1a] border border-white/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h3 className="text-xl font-bold text-white">Reply to {contact.name}</h3>
            <p className="text-gray-400 text-sm">{contact.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-[#030712] border border-white/5 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2">Original Message:</p>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{contact.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Your Reply
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your reply here..."
              rows={6}
              className="w-full px-4 py-3 bg-[#030712] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-6 border-t border-white/5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/25 disabled:shadow-none"
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
  );
};

export default ReplyModal;
