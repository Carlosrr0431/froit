import { useState, useCallback } from 'react';
import { defaultSalesSteps } from '../utils/constants';

/**
 * Hook principal para manejar el estado del CRM
 */
export function useCRMState() {
    // Estados de chat
    const [activeChat, setActiveChat] = useState({});
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState({});
    
    // Estados de proceso de venta
    const [salesStepIndices, setSalesStepIndices] = useState({});
    const [clientTypesSelected, setClientTypesSelected] = useState({});
    const [salesStepValues, setSalesStepValues] = useState({});
    
    // Estados UI
    const [showSidebar, setShowSidebar] = useState(true);
    const [activeTab, setActiveTab] = useState("chats");
    const [mobileView, setMobileView] = useState("sidebar");
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    
    // Estados de modales
    const [showPropertySearch, setShowPropertySearch] = useState(false);
    const [showScheduleVisit, setShowScheduleVisit] = useState(false);
    const [showDocuments, setShowDocuments] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showPersonalDataModal, setShowPersonalDataModal] = useState(false);
    const [showClientTagsModal, setShowClientTagsModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [showKPIsModal, setShowKPIsModal] = useState(false);
    const [showPipelineModal, setShowPipelineModal] = useState(false);
    const [showClientTypesConfigModal, setShowClientTypesConfigModal] = useState(false);
    
    // Estados de etiquetas
    const [allTags, setAllTags] = useState([]);
    const [clientTags, setClientTags] = useState([]);
    const [selectedTagFilter, setSelectedTagFilter] = useState([]);
    const [searchTag, setSearchTag] = useState('');
    
    // Estados de filtros
    const [selectedStepFilter, setSelectedStepFilter] = useState(null);
    const [selectedClientTypeFilter, setSelectedClientTypeFilter] = useState(null);
    
    // Estados de notas
    const [clientNotes, setClientNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingNoteText, setEditingNoteText] = useState("");
    
    // Estados de datos personales
    const [personalData, setPersonalData] = useState({
        nombre: "",
        ubicacion: "",
        correo: "",
        fechaNacimiento: "",
        estadoCivil: "",
    });
    const [personalDataBackup, setPersonalDataBackup] = useState(null);
    const [editFields, setEditFields] = useState({});
    
    // Estados de tipos de clientes dinámicos
    const [dynamicClientTypes, setDynamicClientTypes] = useState([]);
    const [clientTypeSteps, setClientTypeSteps] = useState({});
    const [loadingClientTypes, setLoadingClientTypes] = useState(true);
    
    // Estados de etapas personalizadas
    const [userSalesSteps, setUserSalesSteps] = useState({
        general: null,
        comprador: null,
        vendedor: null,
        inversor: null
    });
    const [editingSalesSteps, setEditingSalesSteps] = useState(false);
    const [editingStepsType, setEditingStepsType] = useState('general');
    const [tempSalesSteps, setTempSalesSteps] = useState([]);
    
    // Estados de loading
    const [loadingChatMessages, setLoadingChatMessages] = useState(false);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [loadingPersonalData, setLoadingPersonalData] = useState(false);
    const [savingPersonalData, setSavingPersonalData] = useState(false);
    const [savingSalesSteps, setSavingSalesSteps] = useState(false);
    const [loadingTags, setLoadingTags] = useState(false);
    
    // Funciones auxiliares
    const getCurrentClientType = useCallback(() => {
        return clientTypesSelected[activeChat?.id] || "No especificado";
    }, [clientTypesSelected, activeChat?.id]);

    const getSalesStepsForClient = useCallback((clientType) => {
        if (!clientType || clientType === "No especificado") {
            return userSalesSteps.general || defaultSalesSteps.general;
        }

        const normalizedType = clientType.trim();
        const lowerType = normalizedType.toLowerCase();

        // Prioridad 1: Pasos personalizados del usuario
        if (lowerType === 'comprador' && userSalesSteps.comprador?.length > 0) {
            return userSalesSteps.comprador;
        } else if (lowerType === 'vendedor' && userSalesSteps.vendedor?.length > 0) {
            return userSalesSteps.vendedor;
        } else if (lowerType === 'inversor' && userSalesSteps.inversor?.length > 0) {
            return userSalesSteps.inversor;
        }

        // Prioridad 2: Pasos desde BD
        if (clientTypeSteps[normalizedType]?.length > 0) {
            return clientTypeSteps[normalizedType];
        }

        // Prioridad 3: Defaults
        return defaultSalesSteps[lowerType] || defaultSalesSteps.general;
    }, [userSalesSteps, clientTypeSteps]);

    const currentSalesSteps = getSalesStepsForClient(getCurrentClientType());

    return {
        // Estados de chat
        activeChat,
        setActiveChat,
        message,
        setMessage,
        messages,
        setMessages,
        
        // Estados de proceso de venta
        salesStepIndices,
        setSalesStepIndices,
        clientTypesSelected,
        setClientTypesSelected,
        salesStepValues,
        setSalesStepValues,
        currentSalesSteps,
        
        // Estados UI
        showSidebar,
        setShowSidebar,
        activeTab,
        setActiveTab,
        mobileView,
        setMobileView,
        showMobileMenu,
        setShowMobileMenu,
        
        // Estados de modales
        showPropertySearch,
        setShowPropertySearch,
        showScheduleVisit,
        setShowScheduleVisit,
        showDocuments,
        setShowDocuments,
        showNotesModal,
        setShowNotesModal,
        showPersonalDataModal,
        setShowPersonalDataModal,
        showClientTagsModal,
        setShowClientTagsModal,
        showEventModal,
        setShowEventModal,
        showCalendarModal,
        setShowCalendarModal,
        showKPIsModal,
        setShowKPIsModal,
        showPipelineModal,
        setShowPipelineModal,
        showClientTypesConfigModal,
        setShowClientTypesConfigModal,
        
        // Estados de etiquetas
        allTags,
        setAllTags,
        clientTags,
        setClientTags,
        selectedTagFilter,
        setSelectedTagFilter,
        searchTag,
        setSearchTag,
        
        // Estados de filtros
        selectedStepFilter,
        setSelectedStepFilter,
        selectedClientTypeFilter,
        setSelectedClientTypeFilter,
        
        // Estados de notas
        clientNotes,
        setClientNotes,
        newNote,
        setNewNote,
        editingNoteId,
        setEditingNoteId,
        editingNoteText,
        setEditingNoteText,
        
        // Estados de datos personales
        personalData,
        setPersonalData,
        personalDataBackup,
        setPersonalDataBackup,
        editFields,
        setEditFields,
        
        // Estados de tipos de clientes
        dynamicClientTypes,
        setDynamicClientTypes,
        clientTypeSteps,
        setClientTypeSteps,
        loadingClientTypes,
        setLoadingClientTypes,
        
        // Estados de etapas personalizadas
        userSalesSteps,
        setUserSalesSteps,
        editingSalesSteps,
        setEditingSalesSteps,
        editingStepsType,
        setEditingStepsType,
        tempSalesSteps,
        setTempSalesSteps,
        
        // Estados de loading
        loadingChatMessages,
        setLoadingChatMessages,
        loadingNotes,
        setLoadingNotes,
        loadingPersonalData,
        setLoadingPersonalData,
        savingPersonalData,
        setSavingPersonalData,
        savingSalesSteps,
        setSavingSalesSteps,
        loadingTags,
        setLoadingTags,
        
        // Funciones auxiliares
        getCurrentClientType,
        getSalesStepsForClient,
    };
}
