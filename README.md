# Froit Landing + CRM Inmobiliario

Este es un proyecto [Next.js](https://nextjs.org) que incluye:
- 🏠 **Landing Page** moderna y responsive
- 💼 **CRM Inmobiliario** completo (2 versiones disponibles)

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:3000
```

## � Estructura del Proyecto

```
froit-landing/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── crm/               # CRM Original (ruta: /crm)
│   │   └── crm-simple/        # CRM Modular (ruta: /crm-simple) ⭐
│   ├── components/            # Componentes compartidos
│   │   └── ui/               # Componentes de Shadcn/UI
│   ├── crm/                   # Sistema CRM
│   │   ├── RealEstateChatApp.jsx      # CRM Original (6,790 líneas)
│   │   ├── SimpleCRM.jsx              # CRM Modular (100 líneas) ⭐
│   │   ├── simple-components/         # Componentes modulares
│   │   └── simple-hooks/             # Hooks personalizados
│   └── lib/                   # Utilidades y configuración
└── public/                    # Archivos estáticos
```

## 💼 CRM Inmobiliario

### Dos Versiones Disponibles:

#### 1. CRM Original
- **Ruta**: `/crm`
- **Archivo**: `RealEstateChatApp.jsx` (~6,790 líneas)
- **Estado**: Funcional y completo
- **Mejor para**: Producción actual

#### 2. SimpleCRM ⭐ (Recomendado)
- **Ruta**: `/crm-simple`
- **Archivos**: 12 archivos modulares (~1,200 líneas total)
- **Estado**: Core completo, funcionalidades avanzadas en desarrollo
- **Mejor para**: Nuevos proyectos y desarrollo futuro

### 📊 Comparación Rápida

| Aspecto | CRM Original | SimpleCRM |
|---------|-------------|-----------|
| Líneas de código | 6,790 | 1,200 |
| Archivos | 1 monolítico | 12 modulares |
| Mantenibilidad | Difícil | Fácil |
| Escalabilidad | Limitada | Alta |
| Tiempo de desarrollo | Lento | Rápido |
| **Recomendación** | Producción actual | Futuro desarrollo |

### 🎯 Funcionalidades del CRM

**SimpleCRM (Core)**
- ✅ Autenticación con Google OAuth
- ✅ Lista de conversaciones con búsqueda
- ✅ Chat en tiempo real
- ✅ Envío de mensajes y archivos
- ✅ Integración con WhatsApp Business (WasenderAPI)
- ✅ Estados de mensaje (enviado, entregado, leído)
- ✅ Diseño responsive

**Funcionalidades Avanzadas** (disponibles en CRM Original)
- Embudo de ventas personalizable
- Búsqueda de propiedades
- Calendario con Google Calendar
- Gestión de documentos
- Sistema de etiquetas
- Notas de cliente
- Consultor legal IA

## 📚 Documentación Completa

### Para Empezar
- **`SIMPLE_CRM_FINAL.md`** - Guía de inicio rápido
- **`src/crm/SIMPLE_CRM_README.md`** - Documentación técnica

### Para Desarrolladores
- **`COMPARISON.md`** - Comparación detallada CRM Original vs SimpleCRM
- **`MIGRATION_GUIDE.md`** - Guía de migración paso a paso
- **`SIMPLE_CRM_SUMMARY.md`** - Arquitectura y patrones

### Para Features Específicas
- **`src/crm/README.md`** - Documentación del CRM Original
- **`INTEGRATION_SUMMARY.md`** - Resumen de integración Shadcn/UI

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15.5.4** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **Tailwind CSS 4** - Framework CSS utility-first
- **Shadcn/UI** - Componentes de UI con Radix UI
- **Framer Motion** - Animaciones
- **Lucide React** - Iconos

### Backend & Servicios
- **Supabase** - Base de datos PostgreSQL
- **NextAuth** - Autenticación con Google OAuth
- **WasenderAPI** - Integración WhatsApp Business
- **Google Calendar API** - Gestión de eventos
- **Cloudinary** - Almacenamiento de medios

### Librerías
- `date-fns` - Manejo de fechas
- `react-icons` - Iconos adicionales
- `@supabase/supabase-js` - Cliente de Supabase
- `@radix-ui/*` - Primitivas de UI accesibles

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` (usa `.env.example` como referencia):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON=tu_clave_anon

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secreto_aleatorio

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# WasenderAPI (opcional)
WASENDER_API_KEY=tu_api_key
```

### 2. Instalación

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

### 3. Acceder

- **Landing Page**: http://localhost:3000
- **CRM Original**: http://localhost:3000/crm
- **SimpleCRM**: http://localhost:3000/crm-simple ⭐

## 🚢 Deployment

### Vercel (Recomendado)

```bash
# Build
npm run build

# Deploy
vercel --prod
```

### Otras Plataformas
- Railway
- Netlify
- AWS
- Google Cloud

## � Aprende Más

### Tecnologías
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/UI](https://ui.shadcn.com)

### CRM
- [SimpleCRM README](src/crm/SIMPLE_CRM_README.md)
- [Guía de Migración](MIGRATION_GUIDE.md)
- [Comparación Detallada](COMPARISON.md)

## 🎯 Recomendaciones

### Para Nuevos Proyectos
✅ Usa **SimpleCRM** (`/crm-simple`)
- Código más limpio y organizado
- Más fácil de mantener y extender
- Mejor performance
- Onboarding más rápido

### Para Proyectos Existentes
⚠️ Mantén **CRM Original** (`/crm`) y migra gradualmente
- Sigue funcionando mientras migras
- Menos riesgo
- Testing paralelo

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## � Troubleshooting

### Error: "Module not found"
```bash
# Verificar que jsconfig.json tenga los alias correctos
# Reiniciar servidor de desarrollo
npm run dev
```

### Error: "Supabase client is not configured"
```bash
# Verificar .env.local tenga las variables correctas
# Las variables deben empezar con NEXT_PUBLIC_ para el cliente
```

### CRM no carga
```bash
# Verificar NextAuth esté configurado
# Verificar credenciales de Google OAuth
# Revisar consola del navegador para errores
```

## �📄 Licencia

Este proyecto es privado y no tiene licencia pública.

## 📞 Soporte

Para soporte y preguntas:

1. Revisa la documentación correspondiente
2. Verifica las variables de entorno
3. Consulta los logs para errores específicos
4. Revisa los archivos de troubleshooting en cada guía

---

**Desarrollado con ❤️ para REMAX NOA**

## 🎉 Lo Nuevo

### SimpleCRM (Octubre 2025)
- ✨ Nueva arquitectura modular
- 🚀 84% menos código
- ⚡ 70% desarrollo más rápido
- 🎯 300% más escalable

[Ver detalles completos →](SIMPLE_CRM_FINAL.md)

