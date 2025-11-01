'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import UserProfile from './UserProfile';
import SidebarMenu from './SidebarMenu';
import SearchBar from './SearchBar';
import ContactListItem from './ContactListItem';

const ContactList = ({ 
  contacts, 
  selectedContact, 
  onSelectContact, 
  searchQuery, 
  onSearchChange, 
  isMobileOpen, 
  activeSection, 
  onSectionChange 
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shouldShow = !isMobile || isMobileOpen;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={isMobile ? { x: -100, opacity: 0 } : false}
          animate={{ x: 0, opacity: 1 }}
          exit={isMobile ? { x: -100, opacity: 0 } : {}}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full md:w-[420px] bg-white border-r border-slate-200 flex flex-col fixed md:relative inset-0 z-40 md:z-0 h-full"
        >
          {/* Header: User Profile + Navigation Tabs */}
          <div className="flex-shrink-0 shadow-sm">
            <UserProfile />
            <div className="border-b border-slate-200 bg-white">
              <SidebarMenu 
                activeSection={activeSection}
                onSectionChange={onSectionChange}
                unreadCount={contacts.filter(c => c.unread > 0).length}
              />
            </div>
          </div>

          {/* Search Bar - Siempre visible */}
          <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />

          {/* Contact List - Siempre muestra la lista de chats */}
          <div className="flex-1 overflow-y-auto overscroll-contain bg-white">
            {contacts
              .filter(contact =>
                contact.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((contact) => (
                <ContactListItem
                  key={contact.id}
                  contact={contact}
                  isSelected={selectedContact?.id === contact.id}
                  onClick={() => onSelectContact(contact)}
                />
              ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactList;
