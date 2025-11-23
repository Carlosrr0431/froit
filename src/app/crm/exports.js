// Exportaciones centrales del CRM REMAX Modular

// Componente principal
export { default } from './index.jsx';

// Componentes UI
export { default as Toast } from './components/Toast';
export { default as ModernLoading, ChatLoadingOverlay } from './components/Loading';

// Componentes de Sidebar
export { default as ChatSidebar } from './components/Sidebar/ChatSidebar';
export { default as ChatList } from './components/Sidebar/ChatList';
export { default as ChatFilters } from './components/Sidebar/ChatFilters';

// Componentes de Chat
export { default as ChatArea } from './components/Chat/ChatArea';

// Hooks
export { useCRMState } from './hooks/useCRMState';
export { useToast } from './hooks/useToast';

// Utilidades
export * from './utils/constants';
export * from './utils/helpers';
