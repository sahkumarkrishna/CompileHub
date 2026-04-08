import ContactForm from "../components/ContactForm";
import { FiMail, FiMapPin, FiPhone, FiClock, FiMessageCircle } from "react-icons/fi";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a14] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <FiMessageCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Contact Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {/* Email */}
            <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <FiMail className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Email</h3>
                  <p className="text-gray-400 text-sm">kumarkrishna9801552@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <FiPhone className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Phone</h3>
                  <p className="text-gray-400 text-sm">+91 9334554413</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <FiMapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Location</h3>
                  <p className="text-gray-400 text-sm">India</p>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-[#0d0d1a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-yellow-500/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <FiClock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Response Time</h3>
                  <p className="text-gray-400 text-sm">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Have questions?{" "}
            <a href="/help" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Visit our Help Center
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
