import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiCamera, FiEdit2, FiX, FiCheck, FiShield, FiClock } from "react-icons/fi";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    profilePhoto: ""
  });
  
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    profilePhoto: ""
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);

  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_ADMIN_URL;

  const profileAvatars = [
    { id: 1, emoji: "👨‍💻", name: "Developer" },
    { id: 2, emoji: "👩‍💻", name: "Coder" },
    { id: 3, emoji: "🧑‍🎨", name: "Designer" },
    { id: 4, emoji: "👨‍🔬", name: "Scientist" },
    { id: 5, emoji: "👩‍🔬", name: "Researcher" },
    { id: 6, emoji: "🧑‍💼", name: "Professional" },
    { id: 7, emoji: "👨‍🎓", name: "Student" },
    { id: 8, emoji: "👩‍🎓", name: "Graduate" },
    { id: 9, emoji: "😎", name: "Cool" },
    { id: 10, emoji: "🤓", name: "Nerd" },
    { id: 11, emoji: "🦸", name: "Hero" },
    { id: 12, emoji: "🧙", name: "Wizard" },
  ];

  useEffect(() => {
    const initialData = {
      name: localStorage.getItem("userName") || "",
      email: localStorage.getItem("userEmail") || "",
      profilePhoto: localStorage.getItem("userProfilePhoto") || ""
    };
    setProfileData(initialData);
    setEditData(initialData);
    setPreviewUrl(initialData.profilePhoto || null);
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setFetching(true);
      const response = await axios.get(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const userData = response.data.user;
        
        const photo = userData.profilePhoto || localStorage.getItem("userProfilePhoto") || "";
        const name = userData.name || localStorage.getItem("userName") || "";
        const email = userData.email || localStorage.getItem("userEmail") || "";
        
        const mergedData = {
          ...userData,
          profilePhoto: photo,
          name: name,
          email: email
        };
        
        setProfileData(mergedData);
        setEditData(mergedData);
        setPreviewUrl(photo || null);
        
        if (photo) {
          localStorage.setItem("userProfilePhoto", photo);
        }
        if (name) {
          localStorage.setItem("userName", name);
        }
        if (email) {
          localStorage.setItem("userEmail", email);
        }
        
        window.dispatchEvent(new Event("profileUpdated"));
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      const localPhoto = localStorage.getItem("userProfilePhoto") || "";
      const localName = localStorage.getItem("userName") || "";
      const localEmail = localStorage.getItem("userEmail") || "";
      
      if (localPhoto || localName) {
        setProfileData({ name: localName, email: localEmail, profilePhoto: localPhoto });
        setEditData({ name: localName, email: localEmail, profilePhoto: localPhoto });
        setPreviewUrl(localPhoto || null);
      }
    } finally {
      setFetching(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setEditData({ ...editData, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (emoji) => {
    setPreviewUrl(emoji);
    setEditData({ ...editData, profilePhoto: emoji });
    setShowAvatarPicker(false);
  };

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(profileData);
    setPreviewUrl(profileData.profilePhoto || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.put(
        `${API_BASE}/profile`,
        {
          name: editData.name,
          email: editData.email,
          profilePhoto: editData.profilePhoto
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Profile updated successfully!");
      
      const updatedName = response.data.user?.name || editData.name;
      const updatedEmail = response.data.user?.email || editData.email;
      const updatedPhoto = response.data.user?.profilePhoto || editData.profilePhoto || '';
      
      setProfileData({
        ...profileData,
        name: updatedName,
        email: updatedEmail,
        profilePhoto: updatedPhoto
      });
      
      setEditData({
        name: updatedName,
        email: updatedEmail,
        profilePhoto: updatedPhoto
      });
      
      if (updatedPhoto && updatedPhoto !== '') {
        localStorage.setItem("userProfilePhoto", updatedPhoto);
      } else {
        localStorage.removeItem("userProfilePhoto");
      }
      if (updatedEmail) {
        localStorage.setItem("userEmail", updatedEmail);
      }
      if (updatedName) {
        localStorage.setItem("userName", updatedName);
      }
      
      window.dispatchEvent(new Event("profileUpdated"));
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card with Banner */}
        <div className="bg-[#1e293b] rounded-2xl border border-rose-500/20 overflow-hidden">
          <div className="h-28 sm:h-32 bg-gradient-to-r from-rose-600 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
          </div>
          
          <div className="px-6 sm:px-8 pb-6 -mt-16 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="relative w-fit mx-auto sm:mx-0">
                <div 
                  onClick={() => isEditing && setShowAvatarPicker(!showAvatarPicker)}
                  className={`relative ${isEditing ? 'cursor-pointer' : ''}`}
                >
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 border-4 border-[#0f172a] overflow-hidden flex items-center justify-center shadow-2xl">
                    {previewUrl ? (
                      typeof previewUrl === 'string' && previewUrl.includes('data:') ? (
                        <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : previewUrl.length <= 4 ? (
                        <span className="text-5xl sm:text-6xl">{previewUrl}</span>
                      ) : (
                        <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <FiUser className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-rose-500 hover:bg-rose-400 rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-lg">
                      <FiCamera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left pt-2 sm:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {profileData.name || "Admin"}
                </h1>
                <p className="text-gray-400 text-sm mb-3">{profileData.email || "admin@example.com"}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-medium rounded-full border border-rose-500/30 flex items-center gap-1">
                    <FiShield className="w-3 h-3" />
                    Administrator
                  </span>
                  <span className="px-3 py-1 bg-pink-500/20 text-pink-400 text-xs font-medium rounded-full border border-pink-500/30 flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    Active
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 justify-center sm:justify-end">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl transition-all hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/25"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/10 font-medium rounded-xl transition-all"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Picker */}
        {showAvatarPicker && (
          <div className="bg-[#1e293b] rounded-2xl border border-rose-500/20 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Choose Avatar</h3>
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
              {profileAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleAvatarSelect(avatar.emoji)}
                  className={`w-12 h-12 rounded-xl bg-[#0f172a] hover:bg-rose-500/20 flex items-center justify-center text-2xl transition-all hover:scale-110 ${
                    previewUrl === avatar.emoji ? 'ring-2 ring-rose-500 bg-rose-500/20' : ''
                  }`}
                  title={avatar.name}
                >
                  {avatar.emoji}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-3 text-center">
              Select an avatar or upload your own photo
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-[#1e293b] rounded-2xl border border-rose-500/20 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-rose-500/20 rounded-xl">
              <FiUser className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Personal Information</h2>
              <p className="text-sm text-gray-500">Update your account details</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-4 py-3 bg-[#0f172a]/80 border border-rose-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all disabled:opacity-50"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 bg-[#0f172a]/80 border border-rose-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all disabled:opacity-50"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-rose-500/25"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-gray-300 font-medium rounded-xl transition-all border border-white/10"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
