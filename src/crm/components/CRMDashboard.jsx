'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ContactList from './ContactList';
import ChatArea from './ChatArea';
import ContactInfo from './ContactInfo';
import MobileBottomNav from './MobileBottomNav';
import { useCRMData } from '../hooks/useCRMData';

const CRMDashboard = () => {
  const {
    contacts,
    selectedContact,
    selectContact,
    searchQuery,
    updateSearchQuery
  } = useCRMData();

  const [isMobileContactListOpen, setIsMobileContactListOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('chats');
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // En móvil, cuando se selecciona un contacto, cerrar la lista
  // Al seleccionar un chat, cambiar automáticamente a la sección chats
  const handleSelectContact = (contact) => {
    selectContact(contact);
    setActiveSection('chats'); // Cambiar a la sección de chats
    if (isMobile) {
      setIsMobileContactListOpen(false);
    }
  };

  // Al volver, mostrar lista en móvil
  const handleBack = () => {
    selectContact(null);
    setIsMobileContactListOpen(true);
  };

  // Cambiar sección activa
  const handleSectionChange = (section) => {
    setActiveSection(section);
    selectContact(null); // Limpiar contacto seleccionado al cambiar de sección
    setShowContactInfo(false); // Cerrar panel de info al cambiar de sección
  };

  // Toggle contact info panel
  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden pb-16 md:pb-0">
        {/* Contact List - Siempre visible con la lista de chats */}
        {(!isMobile || (isMobile && !selectedContact)) && (
          <ContactList
            contacts={contacts}
            selectedContact={selectedContact}
            onSelectContact={handleSelectContact}
            searchQuery={searchQuery}
            onSearchChange={updateSearchQuery}
            isMobileOpen={isMobileContactListOpen}
            onMobileClose={() => setIsMobileContactListOpen(false)}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        )}

        {/* Chat Area - Cambia según la sección seleccionada */}
        <ChatArea
          selectedContact={selectedContact}
          onBack={handleBack}
          activeSection={activeSection}
          onToggleContactInfo={toggleContactInfo}
        />

        {/* Contact Info - Desktop only, solo visible si showContactInfo está activo */}
        <AnimatePresence>
          {activeSection === 'chats' && showContactInfo && (
            <ContactInfo 
              selectedContact={selectedContact}
              onClose={() => setShowContactInfo(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onMenuClick={() => {}}
        onChatsClick={() => {
          setActiveSection('chats');
          setIsMobileContactListOpen(true);
          selectContact(null);
        }}
      />
    </div>
  );
};

export default CRMDashboard;
