'use client';

import { useState } from 'react';
import { mockContacts } from '../utils/mockData';

export const useCRMData = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectContact = (contact) => {
    setSelectedContact(contact);
  };

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  return {
    contacts: filteredContacts,
    selectedContact,
    selectContact,
    searchQuery,
    updateSearchQuery
  };
};
