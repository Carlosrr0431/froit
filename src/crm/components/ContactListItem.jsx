'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getBusinessConfig, getCurrentBusinessType } from '../utils/businessConfig';

const ContactListItem = ({ contact, isSelected, onClick }) => {
  const [businessConfig, setBusinessConfig] = useState(null);

  useEffect(() => {
    const type = getCurrentBusinessType();
    setBusinessConfig(getBusinessConfig(type));
  }, []);

  if (!businessConfig) return null;

  const currentStage = businessConfig.stages.find(s => s.id === contact.stage) || businessConfig.stages[0];

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`w-full px-3 py-3 flex items-center gap-3 transition-colors text-left border-b border-slate-100 ${
        isSelected
          ? 'bg-slate-50'
          : 'bg-white hover:bg-slate-50'
      }`}
    >
      <div className="relative flex-shrink-0">
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-semibold text-sm"
          style={{
            backgroundImage: `linear-gradient(135deg, ${contact.color}dd, ${contact.color})`
          }}
        >
          {contact.name.split(' ').map(n => n[0]).join('')}
        </div>
        {contact.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] border-2 border-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="font-medium text-slate-900 text-[15px] truncate pr-2">
            {contact.name}
          </h3>
          <span className="text-xs text-slate-500 flex-shrink-0">
            {contact.lastMessageTime}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm text-slate-600 truncate leading-tight">
            {contact.lastMessage}
          </p>
          {contact.unread > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-[#25d366] text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {contact.unread}
            </span>
          )}
        </div>
        {/* Stage Badge */}
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1"
            style={{
              backgroundColor: `${currentStage.color}20`,
              color: currentStage.color,
            }}
          >
            <span className="text-[10px]">{currentStage.icon}</span>
            <span className="truncate max-w-[120px]">{currentStage.name}</span>
          </span>
        </div>
      </div>
    </motion.button>
  );
};

export default ContactListItem;
