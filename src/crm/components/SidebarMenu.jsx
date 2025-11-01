'use client';

import { MessageCircle, Users, Calendar, TrendingUp, FileText, Plus, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarMenu = ({ activeSection, onSectionChange, unreadCount }) => {
  const menuItems = [
    { id: 'chats', icon: MessageCircle, label: 'Chats' },
    { id: 'clients', icon: Users, label: 'Clientes' },
    { id: 'pipeline', icon: GitBranch, label: 'Pipeline' },
    { id: 'calendar', icon: Calendar, label: 'Calendario' },
    { id: 'ranking', icon: TrendingUp, label: 'Ranking' },
    { id: 'properties', icon: FileText, label: 'Propiedades' },
  ];

  return (
    <nav className="flex items-start gap-2 px-2 py-2 overflow-x-auto scrollbar-hide">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <motion.button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                isActive
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.id === 'chats' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-teal-600'
                : 'text-slate-500'
            }`}>
              {item.label}
            </span>
          </motion.button>
        );
      })}
      
      {/* Add More Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-1 flex-shrink-0"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all border-2 border-dashed border-slate-300">
          <Plus className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-medium text-slate-400">
          Más
        </span>
      </motion.button>
    </nav>
  );
};

export default SidebarMenu;
