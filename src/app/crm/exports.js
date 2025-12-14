// Exportaciones centrales del CRM REMAX Modular

// Componente principal
export { default } from './page.jsx';

// Componentes UI
export { default as Toast } from './components/Toast.jsx';
export { default as ModernLoading, ChatLoadingOverlay } from './components/Loading.jsx';

// Componentes de Sidebar
export { default as ChatSidebar } from './components/Sidebar/ChatSidebar.jsx';
export { default as ChatList } from './components/Sidebar/ChatList.jsx';
export { default as ChatFilters } from './components/Sidebar/ChatFilters.jsx';

// Componentes de Chat
export { default as ChatArea } from './components/Chat/ChatArea.jsx';

// Hooks
export { useCRMState } from './hooks/useCRMState.js';
export { useToast } from './hooks/useToast.js';

// Utilidades
export * from './utils/constants.js';
export * from './utils/helpers.js';
