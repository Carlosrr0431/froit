'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, Calendar, TrendingUp, Menu, GitBranch } from 'lucide-react';

const MobileBottomNav = ({ onMenuClick, onChatsClick, activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'chats', icon: MessageCircle, label: 'Chats', onClick: onChatsClick },
    { id: 'clients', icon: Users, label: 'Clientes', onClick: () => onSectionChange?.('clients') },
    { id: 'pipeline', icon: GitBranch, label: 'Pipeline', onClick: () => onSectionChange?.('pipeline') },
    { id: 'calendar', icon: Calendar, label: 'Agenda', onClick: () => onSectionChange?.('calendar') },
    { id: 'ranking', icon: TrendingUp, label: 'Ranking', onClick: () => onSectionChange?.('ranking') },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 safe-area-bottom shadow-lg"
    >
      <div className="flex items-center justify-around px-1 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={item.onClick}
              whileTap={{ scale: 0.95 }}
              className={`
                flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all
                ${isActive 
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' 
                  : 'text-slate-600 dark:text-slate-400'
                }
              `}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-teal-600 rounded-full"
                  />
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default MobileBottomNav;
