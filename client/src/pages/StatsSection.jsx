import React from 'react';
import { FiUsers, FiCode, FiZap, FiAward } from 'react-icons/fi';

const StatsSection = () => {
  const stats = [
    { icon: <FiUsers className="w-8 h-8" />, value: '50K+', label: 'Active Users', color: 'from-blue-500 to-cyan-500' },
    { icon: <FiCode className="w-8 h-8" />, value: '1M+', label: 'Code Executions', color: 'from-emerald-500 to-green-500' },
    { icon: <FiZap className="w-8 h-8" />, value: '99.9%', label: 'Uptime', color: 'from-yellow-500 to-orange-500' },
    { icon: <FiAward className="w-8 h-8" />, value: '15+', label: 'Languages', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="card group hover:scale-105 transition-all duration-300 text-center p-8">
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform`}>
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-4xl font-black text-white mb-2">{stat.value}</h3>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
