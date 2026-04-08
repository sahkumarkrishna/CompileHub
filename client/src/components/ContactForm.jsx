import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSend, FiUser, FiMail, FiMessageCircle, FiCheckCircle, FiLoader } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/contact`, formData);
      
      if (res.data.success) {
        toast.success(res.data.message || "Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-emerald-500/20">
          <FiMessageCircle className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Send us a Message</h3>
          <p className="text-gray-400 text-sm">We typically respond within 24 hours</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiUser className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full pl-12 pr-4 py-3 bg-[#030712] border ${
                errors.name ? "border-red-500" : "border-white/10"
              } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors`}
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiMail className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full pl-12 pr-4 py-3 bg-[#030712] border ${
                errors.email ? "border-red-500" : "border-white/10"
              } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors`}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Your Message
          </label>
          <div className="relative">
            <div className="absolute top-4 left-4 pointer-events-none">
              <FiMessageCircle className="w-5 h-5 text-gray-500" />
            </div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              rows={5}
              className={`w-full pl-12 pr-4 py-3 bg-[#030712] border ${
                errors.message ? "border-red-500" : "border-white/10"
              } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none`}
            />
          </div>
          {errors.message && (
            <p className="text-red-400 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25 disabled:shadow-none"
        >
          {loading ? (
            <>
              <FiLoader className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <FiSend className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </form>

      {/* Success Message */}
      <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm">
        <FiCheckCircle className="w-4 h-4" />
        <span>We typically respond within 24 hours</span>
      </div>
    </div>
  );
};

export default ContactForm;
