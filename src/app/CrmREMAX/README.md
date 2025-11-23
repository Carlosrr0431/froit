# CRM REMAX - Versión Modular

## 📁 Estructura del Proyecto

```
CrmREMAX/
├── index.jsx                      # Componente principal
├── components/
│   ├── Toast.jsx                  # Sistema de notificaciones
│   ├── Loading.jsx                # Componentes de carga
│   ├── Sidebar/
│   │   ├── ChatSidebar.jsx       # Barra lateral principal
│   │   ├── ChatList.jsx          # Lista de conversaciones
│   │   ├── ChatFilters.jsx       # Filtros de búsqueda
│   │   └── ChatItem.jsx          # Item individual de chat
│   ├── Chat/
│   │   ├── ChatArea.jsx          # Área principal de chat
│   │   ├── ChatHeader.jsx        # Encabezado del chat
│   │   ├── MessageList.jsx       # Lista de mensajes
│   │   ├── MessageItem.jsx       # Mensaje individual
│   │   ├── MessageInput.jsx      # Input para enviar mensajes
│   │   └── ChatActions.jsx       # Acciones del chat (propiedades, notas, etc.)
│   └── Modals/
│       ├── NotesModal.jsx        # Modal de notas
│       ├── PersonalDataModal.jsx # Modal de datos personales
│       ├── TagsModal.jsx         # Modal de etiquetas
│       ├── KPIsModal.jsx         # Modal de KPIs
│       ├── PipelineModal.jsx     # Modal de pipeline
│       ├── EventModal.jsx        # Modal de eventos
│       └── ClientTypesModal.jsx  # Modal de tipos de clientes
├── hooks/
│   ├── useCRMState.js            # Estado principal del CRM
│   ├── useToast.js               # Hook para toast
│   ├── useChatMessages.js        # Hook para mensajes
│   ├── useClientNotes.js         # Hook para notas
│   ├── useClientTags.js          # Hook para etiquetas
│   └── useClientTypes.js         # Hook para tipos de clientes
└── utils/
    ├── constants.js              # Constantes globales
    ├── helpers.js                # Funciones auxiliares
    └── supabaseClient.js         # Cliente de Supabase
```

## 🎯 Ventajas de esta Estructura

### 1. **Modularidad**
- Cada componente tiene una responsabilidad única
- Fácil de mantener y escalar
- Componentes reutilizables

### 2. **Organización Clara**
- Separación por funcionalidad (Sidebar, Chat, Modals)
- Hooks personalizados para lógica compleja
- Utilidades centralizadas

### 3. **Mantenibilidad**
- Código más legible y documentado
- Fácil de testear individualmente
- Menos bugs por acoplamiento

### 4. **Performance**
- Componentes memoizados donde sea necesario
- Cargas diferidas (lazy loading)
- Optimización de re-renders

## 🚀 Características Principales

### Componentes Base
- ✅ **Toast**: Sistema de notificaciones no intrusivo
- ✅ **Loading**: Estados de carga elegantes
- ✅ **Sidebar**: Lista de chats con filtros avanzados
- ✅ **ChatArea**: Interfaz de mensajería completa

### Hooks Personalizados
- ✅ **useCRMState**: Manejo centralizado del estado
- ✅ **useToast**: Notificaciones contextuales
- ✅ **useChatMessages**: Mensajes en tiempo real
- ✅ **useClientNotes**: CRUD de notas de cliente

### Utilidades
- ✅ **helpers.js**: Funciones de formateo, validación, etc.
- ✅ **constants.js**: Configuraciones globales
- ✅ **supabaseClient.js**: Cliente configurado de Supabase

## 📝 Cómo Usar

### Importar el CRM
```jsx
import CrmREMAX from '@/app/(components)/CrmAgentes/CrmREMAX';

function App() {
  return <CrmREMAX />;
}
```

### Usar componentes individuales
```jsx
import Toast from '@/app/(components)/CrmAgentes/CrmREMAX/components/Toast';
import { useToast } from '@/app/(components)/CrmAgentes/CrmREMAX/hooks/useToast';

function MyComponent() {
  const { toastState, showToast, hideToast } = useToast();
  
  return (
    <>
      <button onClick={() => showToast('¡Hola!', 'success')}>
        Mostrar Toast
      </button>
      <Toast
        message={toastState.message}
        type={toastState.type}
        isVisible={toastState.isVisible}
        onClose={hideToast}
      />
    </>
  );
}
```

## 🔧 Próximos Componentes a Crear

Los siguientes componentes necesitan ser creados para completar la funcionalidad:

1. **ChatList.jsx** - Lista de conversaciones
2. **ChatFilters.jsx** - Filtros de búsqueda
3. **ChatArea.jsx** - Área principal de chat
4. **MessageList.jsx** - Lista de mensajes
5. **MessageInput.jsx** - Input de mensajes
6. **NotesModal.jsx** - Modal de notas
7. **PersonalDataModal.jsx** - Modal de datos personales
8. **TagsModal.jsx** - Modal de etiquetas
9. **KPIsModal.jsx** - Modal de KPIs

## 📚 Documentación Adicional

- Cada componente incluye JSDoc para documentación inline
- Los hooks están documentados con ejemplos de uso
- Las funciones de utilidad tienen tipos y descripciones claras

## 🎨 Estilos

El proyecto usa Tailwind CSS para un diseño consistente y responsive:
- Paleta de colores: Azul/Índigo (brand REMAX)
- Diseño mobile-first
- Animaciones suaves
- Dark mode ready (preparado para modo oscuro)

## 🔐 Seguridad

- Autenticación mediante NextAuth
- RLS (Row Level Security) en Supabase
- Validación de datos en cliente y servidor
- Sanitización de inputs

## 📊 Estado Actual

### ✅ Completado
- Estructura de carpetas
- Componente principal (index.jsx)
- Sistema de Toast
- Componentes de Loading
- Hook de estado principal (useCRMState)
- Hook de Toast (useToast)
- Utilidades (helpers, constants)
- ChatSidebar base

### 🚧 En Progreso
- Componentes de Chat
- Modales especializados
- Hooks de datos (notas, etiquetas, etc.)

### 📋 Pendiente
- Tests unitarios
- Documentación extendida
- Optimizaciones de performance
- Internacionalización (i18n)

## 💡 Contribuir

Para agregar nuevos componentes:
1. Crear el archivo en la carpeta correspondiente
2. Seguir la convención de nombres (PascalCase para componentes)
3. Documentar con JSDoc
4. Exportar como default o named export según corresponda
5. Actualizar este README

---

**Versión**: 2.0.0  
**Última actualización**: 13 de Noviembre, 2025  
**Autor**: REMAX NOA Development Team
