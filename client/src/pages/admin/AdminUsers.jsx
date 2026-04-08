import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiUsers, FiSearch, FiTrash2, FiUnlock, FiLock, FiMail,
  FiCalendar, FiEye, FiCode, FiEdit2, FiRefreshCw, FiX, FiUserPlus, FiKey
} from "react-icons/fi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [unlockEmail, setUnlockEmail] = useState("");
  const API_BASE = import.meta.env.VITE_API_ADMIN_URL;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, search, limit: 12 }
      });
      if (res.data.success) {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user and all their codes?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleUnlock = async (id) => {
    if (!window.confirm("Unlock this user account?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}user/${id}/unlock`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("User unlocked successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Unlock failed");
    }
  };

  const handleUnlockByEmail = async (e) => {
    e.preventDefault();
    if (!unlockEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_BASE}users/unlock-by-email`, { email: unlockEmail }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        toast.success(`User ${unlockEmail} has been unlocked!`);
        setUnlockEmail("");
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Unlock failed");
    }
  };

  const isUserLocked = (user) => user.lockUntil && new Date(user.lockUntil) > new Date();
  
  const getLockTime = (user) => {
    if (!user.lockUntil) return "";
    const diff = new Date(user.lockUntil) - new Date();
    if (diff <= 0) return "";
    const minutes = Math.ceil(diff / 60000);
    return `${minutes} min`;
  };

  const getAvatarGradient = (name) => {
    const gradients = [
      "from-blue-500 to-purple-500", "from-pink-500 to-rose-500",
      "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500",
      "from-cyan-500 to-blue-500", "from-violet-500 to-purple-500",
      "from-fuchsia-500 to-pink-500", "from-teal-500 to-emerald-500"
    ];
    if (!name) return gradients[0];
    return gradients[name.charCodeAt(0) % gradients.length];
  };

  const activeUsers = users.filter(u => !isUserLocked(u)).length;
  const lockedUsers = users.filter(u => isUserLocked(u)).length;

  return (
    <div className="min-h-screen pb-8">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-lg animate-pulse" />
                <div className="relative p-3 sm:p-4 bg-blue-500/20 rounded-2xl border border-blue-500/30">
                  <FiUsers className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Users</h1>
                <p className="text-gray-400 text-sm">Manage registered users</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 sm:px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <span className="text-emerald-400 font-bold">{activeUsers}</span>
                <span className="text-gray-500 ml-1 text-sm">active</span>
              </div>
              {lockedUsers > 0 && (
                <div className="px-3 sm:px-4 py-2 bg-red-500/10 rounded-xl border border-red-500/20">
                  <span className="text-red-400 font-bold">{lockedUsers}</span>
                  <span className="text-gray-500 ml-1 text-sm">locked</span>
                </div>
              )}
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <form onSubmit={handleUnlockByEmail} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <FiKey className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  <input
                    type="email"
                    placeholder="Enter email to unlock account..."
                    value={unlockEmail}
                    onChange={(e) => setUnlockEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-emerald-500/20 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 justify-center"
              >
                <FiUnlock className="w-4 h-4" />
                Unlock Account
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Enter the admin email <span className="text-emerald-400 font-medium">kumarkrishna9801552@gmail.com</span> to unlock if locked
            </p>
          </div>

          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500">Loading users...</p>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiUserPlus className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-gray-400 font-medium">No users found</p>
                <p className="text-gray-600 text-sm mt-1">Try adjusting your search</p>
              </div>
            ) : users.map((user) => {
              const locked = isUserLocked(user);
              return (
                <div
                  key={user._id}
                  className={`group bg-white/[0.03] border rounded-xl p-4 hover:border-white/20 transition-all ${
                    locked ? 'border-red-500/20' : 'border-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white ${
                      locked ? 'bg-red-500/20' : `bg-gradient-to-br ${getAvatarGradient(user.name)}`
                    }`}>
                      {locked ? <FiLock className="w-6 h-6" /> : user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-white font-semibold mb-1 truncate">{user.name}</h3>
                  <p className="text-gray-500 text-xs mb-3 truncate flex items-center gap-1">
                    <FiMail className="w-3 h-3 flex-shrink-0" />
                    {user.email}
                  </p>

                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      locked
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {locked ? `${getLockTime(user)} left` : 'Active'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FiCode className="w-3 h-3" />
                      {user.codeCount || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          user.failedAttempts >= 3 ? 'bg-red-500' :
                          user.failedAttempts >= 1 ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(user.failedAttempts * 20, 100)}%` }}
                      />
                    </div>
                  </div>

                  {locked && (
                    <button
                      onClick={() => handleUnlock(user._id)}
                      className="w-full mt-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiUnlock className="w-4 h-4" />
                      Unlock Account
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="md:hidden space-y-3">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                Loading...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                No users found
              </div>
            ) : users.map((user) => {
              const locked = isUserLocked(user);
              return (
                <div
                  key={user._id}
                  className={`rounded-xl bg-white/[0.03] border p-4 ${
                    locked ? 'border-red-500/30' : 'border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                        locked ? 'bg-red-500/20 text-red-400' : `bg-gradient-to-br ${getAvatarGradient(user.name)} text-white`
                      }`}>
                        {locked ? <FiLock className="w-5 h-5" /> : user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedUser(user)} className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="p-2 rounded-lg bg-red-500/20 text-red-400">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={locked ? 'text-red-400' : 'text-emerald-400'}>
                      {locked ? `Locked (${getLockTime(user)})` : 'Active'}
                    </span>
                    <span className="text-gray-500">Codes: {user.codeCount || 0}</span>
                    <span className="text-gray-500">Failed: {user.failedAttempts}/5</span>
                  </div>
                  {locked && (
                    <button
                      onClick={() => handleUnlock(user._id)}
                      className="w-full mt-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium"
                    >
                      Unlock Account
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white/[0.03] rounded-xl border border-white/5">
              <span className="text-xs sm:text-sm text-gray-500">
                Page {page} of {totalPages} ({total} users)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 text-gray-400 rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-white/10"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 text-gray-400 rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-white/10"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">User Details</h3>
              <button onClick={() => setSelectedUser(null)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                  isUserLocked(selectedUser)
                    ? 'bg-red-500/20 text-red-400'
                    : `bg-gradient-to-br ${getAvatarGradient(selectedUser.name)} text-white`
                }`}>
                  {isUserLocked(selectedUser) ? <FiLock className="w-8 h-8" /> : selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{selectedUser.name}</p>
                  <p className="text-gray-400 flex items-center gap-1">
                    <FiMail className="w-4 h-4" /> {selectedUser.email}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Status</span>
                  {isUserLocked(selectedUser) ? (
                    <span className="text-red-400 font-medium">Locked ({getLockTime(selectedUser)})</span>
                  ) : (
                    <span className="text-emerald-400 font-medium">Active</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Total Codes</span>
                  <span className="text-white font-medium">{selectedUser.codeCount || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Failed Attempts</span>
                  <span className="text-white font-medium">{selectedUser.failedAttempts}/5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Joined</span>
                  <span className="text-white font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {isUserLocked(selectedUser) && (
                  <button
                    onClick={() => { handleUnlock(selectedUser._id); setSelectedUser(null); }}
                    className="flex-1 py-3 bg-emerald-500/20 text-emerald-400 rounded-xl font-medium hover:bg-emerald-500/30 transition-colors"
                  >
                    Unlock User
                  </button>
                )}
                <button
                  onClick={() => { handleDelete(selectedUser._id); setSelectedUser(null); }}
                  className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
