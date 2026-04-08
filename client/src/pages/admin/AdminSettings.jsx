import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiSettings, FiShield, FiDatabase, FiMail, FiBell, FiSave } from "react-icons/fi";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "CompileHub",
    adminEmail: localStorage.getItem("userEmail") || "",
    maintenanceMode: false,
    allowSignup: true,
    maxCodesPerDay: 50,
  });

  const handleSave = (section) => {
    toast.success(`${section} settings saved!`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-500/20 rounded-xl">
            <FiSettings className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 text-sm">Manage platform settings</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FiShield className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">General Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Admin Email</label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={() => handleSave("General")}
            className="mt-6 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FiDatabase className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Platform Limits</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Max Codes Per Day (per user)</label>
              <input
                type="number"
                value={settings.maxCodesPerDay}
                onChange={(e) => setSettings({ ...settings, maxCodesPerDay: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Allow Signups</p>
                <p className="text-sm text-gray-500">Let new users register</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, allowSignup: !settings.allowSignup })}
                className={`w-12 h-6 rounded-full transition-all ${settings.allowSignup ? 'bg-emerald-500' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-all ${settings.allowSignup ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Block all users except admin</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`w-12 h-6 rounded-full transition-all ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-600'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          <button
            onClick={() => handleSave("Platform")}
            className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-6">
            <FiBell className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Send emails on new signups</p>
              </div>
              <button className="w-12 h-6 bg-emerald-500 rounded-full">
                <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Error Alerts</p>
                <p className="text-sm text-gray-500">Get notified on code errors</p>
              </div>
              <button className="w-12 h-6 bg-emerald-500 rounded-full">
                <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
              </button>
            </div>
          </div>

          <button
            onClick={() => handleSave("Notifications")}
            className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
