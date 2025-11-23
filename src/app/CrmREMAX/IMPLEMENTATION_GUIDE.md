# Guía de Implementación - CRM REMAX Modular

## 🎯 Objetivo

Esta guía te ayudará a completar la implementación del CRM REMAX modular, construyendo sobre la base ya creada.

## ✅ Lo que ya está implementado

### Estructura Base
- ✅ Carpetas organizadas (`components/`, `hooks/`, `utils/`)
- ✅ Componente principal (`index.jsx`)
- ✅ Sistema de Toast
- ✅ Componentes de Loading
- ✅ Utilidades básicas (helpers, constants)

### Hooks
- ✅ `useCRMState.js` - Estado principal del CRM
- ✅ `useToast.js` - Sistema de notificaciones

### Componentes UI
- ✅ `Toast.jsx` - Notificaciones
- ✅ `Loading.jsx` - Estados de carga
- ✅ `ChatSidebar.jsx` - Barra lateral
- ✅ `ChatList.jsx` - Lista de conversaciones
- ✅ `ChatFilters.jsx` - Filtros de búsqueda
- ✅ `ChatArea.jsx` - Área principal (básica)

## 🚧 Componentes por Implementar

### Prioridad ALTA (Funcionalidad Core)

#### 1. MessageList.jsx
```jsx
// Ubicación: components/Chat/MessageList.jsx
// Propósito: Mostrar lista de mensajes del chat activo
// Características:
// - Scroll automático al último mensaje
// - Agrupación de mensajes por fecha
// - Indicadores de lectura
// - Carga paginada de mensajes antiguos
```

#### 2. MessageItem.jsx
```jsx
// Ubicación: components/Chat/MessageItem.jsx
// Propósito: Renderizar un mensaje individual
// Características:
// - Diferenciar mensajes propios vs recibidos
// - Mostrar timestamp
// - Soporte para medios (imágenes, archivos)
// - Estados de envío (enviando, enviado, error)
```

#### 3. MessageInput.jsx
```jsx
// Ubicación: components/Chat/MessageInput.jsx
// Propósito: Input para enviar mensajes
// Características:
// - Textarea expansible
// - Botones de adjuntos
// - Emojis
// - Envío con Enter (Shift+Enter para nueva línea)
```

### Prioridad MEDIA (Funcionalidad Extendida)

#### 4. ChatHeader.jsx
```jsx
// Ubicación: components/Chat/ChatHeader.jsx
// Propósito: Encabezado del chat con info del contacto
// Características:
// - Nombre y foto del contacto
// - Estado de conexión
// - Botones de acciones rápidas
// - Selector de tipo de cliente
// - Indicador de etapa del proceso
```

#### 5. ChatActions.jsx
```jsx
// Ubicación: components/Chat/ChatActions.jsx
// Propósito: Panel de acciones del chat
// Características:
// - Abrir modal de notas
// - Abrir modal de datos personales
// - Abrir modal de etiquetas
// - Ver propiedades
// - Crear evento
```

### Prioridad BAJA (Modales y Extras)

#### 6. NotesModal.jsx
```jsx
// Ubicación: components/Modals/NotesModal.jsx
// Propósito: CRUD de notas del cliente
```

#### 7. PersonalDataModal.jsx
```jsx
// Ubicación: components/Modals/PersonalDataModal.jsx
// Propósito: Gestión de datos personales del cliente
```

#### 8. TagsModal.jsx
```jsx
// Ubicación: components/Modals/TagsModal.jsx
// Propósito: Gestión de etiquetas
```

#### 9. KPIsModal.jsx
```jsx
// Ubicación: components/Modals/KPIsModal.jsx
// Propósito: Visualización y edición de KPIs
```

#### 10. PipelineModal.jsx
```jsx
// Ubicación: components/Modals/PipelineModal.jsx
// Propósito: Vista de pipeline de ventas
```

## 📝 Hooks Adicionales Recomendados

### useChatMessages.js
```javascript
// Propósito: Gestionar mensajes del chat activo
// Características:
// - Cargar mensajes iniciales
// - Suscripción a mensajes en tiempo real
// - Enviar nuevos mensajes
// - Actualizar estados de mensajes
```

### useClientNotes.js
```javascript
// Propósito: CRUD de notas del cliente
// Características:
// - Cargar notas
// - Crear nota
// - Editar nota
// - Eliminar nota
```

### useClientTags.js
```javascript
// Propósito: Gestión de etiquetas
// Características:
// - Cargar todas las etiquetas
// - Crear etiqueta
// - Asignar/quitar etiqueta de cliente
// - Eliminar etiqueta
```

### useClientTypes.js
```javascript
// Propósito: Gestión de tipos de clientes
// Características:
// - Cargar tipos desde BD
// - Crear nuevo tipo
// - Actualizar tipo
// - Eliminar tipo
```

## 🔧 Pasos para Implementar

### Paso 1: Completar MessageList y MessageItem
1. Copiar la lógica de mensajes del `RealEstateChatApp.jsx` original
2. Adaptar al nuevo formato modular
3. Implementar scroll automático
4. Agregar soporte para diferentes tipos de mensajes

### Paso 2: Mejorar ChatArea
1. Integrar `MessageList`
2. Integrar `MessageInput`
3. Agregar `ChatHeader` mejorado
4. Conectar con Wasender para envío real

### Paso 3: Implementar Hooks de Datos
1. Crear `useChatMessages` para gestión de mensajes
2. Crear `useClientNotes` para notas
3. Crear `useClientTags` para etiquetas
4. Integrar con Supabase Realtime

### Paso 4: Crear Modales
1. Implementar modales uno por uno
2. Reutilizar componentes del CRM original
3. Conectar con hooks de datos

### Paso 5: Testing y Refinamiento
1. Probar flujo completo de conversación
2. Verificar filtros y búsqueda
3. Optimizar performance
4. Ajustar estilos y UX

## 💡 Tips y Mejores Prácticas

### Componentes
- Mantener componentes pequeños y enfocados (< 200 líneas)
- Usar `memo()` para componentes que se renderizan frecuentemente
- Preferir composición sobre herencia

### Hooks
- Un hook por funcionalidad específica
- Retornar objetos con nombres descriptivos
- Documentar con JSDoc

### Estado
- Usar `useCallback` para funciones que se pasan como props
- Usar `useMemo` para cálculos costosos
- Evitar estado duplicado

### Performance
- Lazy loading para modales
- Virtualización para listas largas de mensajes
- Debounce para búsquedas en tiempo real

## 🔍 Ejemplo de Implementación

### MessageList.jsx (Ejemplo completo)
```jsx
"use client"

import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

export default function MessageList({ messages, loading }) {
    const scrollRef = useRef(null);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
            ))}
        </div>
    );
}
```

## 📚 Recursos

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [React Hooks](https://react.dev/reference/react)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🎯 Checklist de Completación

- [ ] MessageList.jsx implementado
- [ ] MessageItem.jsx implementado
- [ ] MessageInput.jsx implementado
- [ ] ChatHeader.jsx mejorado
- [ ] useChatMessages.js implementado
- [ ] useClientNotes.js implementado
- [ ] NotesModal.jsx implementado
- [ ] PersonalDataModal.jsx implementado
- [ ] TagsModal.jsx implementado
- [ ] Testing completo
- [ ] Documentación actualizada

---

**¿Necesitas ayuda?** Revisa el código original en `RealEstateChatApp.jsx` como referencia.
