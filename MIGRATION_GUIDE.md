# 🔄 Guía de Migración: CRM Original → SimpleCRM

## 📋 Checklist Pre-Migración

Antes de comenzar, asegúrate de tener:

- [ ] Backup del código actual
- [ ] Tests funcionando (si existen)
- [ ] Documentación de funcionalidades críticas
- [ ] Acceso a base de datos de desarrollo
- [ ] Variables de entorno configuradas

## 🚦 Estrategias de Migración

### Estrategia 1: Big Bang (Reemplazo Completo)
**Tiempo:** 1-2 días  
**Riesgo:** Alto  
**Recomendado para:** Proyectos pequeños o en desarrollo

```bash
# Paso 1: Backup
cp -r src/crm src/crm-backup

# Paso 2: Cambiar ruta
# Editar src/app/crm/page.js
# import SimpleCRM from "@/crm/SimpleCRM"

# Paso 3: Testing
npm run dev
# Navegar a http://localhost:3000/crm
```

### Estrategia 2: Paralelo (Recomendada)
**Tiempo:** 1-2 semanas  
**Riesgo:** Bajo  
**Recomendado para:** Proyectos en producción

```bash
# Ambas versiones corriendo simultáneamente
http://localhost:3000/crm         # Original
http://localhost:3000/crm-simple  # Nuevo

# Migrar usuarios gradualmente
# Testing exhaustivo en paralelo
# Rollback fácil si hay problemas
```

### Estrategia 3: Por Módulos (Incremental)
**Tiempo:** 2-4 semanas  
**Riesgo:** Muy Bajo  
**Recomendado para:** Proyectos críticos con muchos usuarios

1. Migrar Chat View
2. Migrar Sidebar
3. Migrar Features adicionales
4. Consolidar y optimizar

## 📝 Plan de Migración Paso a Paso

### Fase 1: Preparación (Día 1)

#### 1.1 Crear Rama de Desarrollo
```bash
git checkout -b feature/migrate-to-simple-crm
```

#### 1.2 Documentar Funcionalidades Actuales
```markdown
# Inventario de Funcionalidades
- [ ] Chat en tiempo real
- [ ] Lista de contactos
- [ ] Envío de mensajes
- [ ] Envío de archivos
- [ ] Búsqueda de propiedades
- [ ] Calendario
- [ ] Documentos
- [ ] Etiquetas
- [ ] Embudo de ventas
- [ ] Notas de cliente
```

#### 1.3 Configurar Testing
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Fase 2: Implementación Core (Día 2-3)

#### 2.1 Verificar SimpleCRM Base
```bash
npm run dev
# Abrir http://localhost:3000/crm-simple
# Verificar login, header, sidebar básicos
```

#### 2.2 Migrar Datos de Configuración
```javascript
// src/crm/config/crm-config.js
export const CRM_CONFIG = {
  defaultSalesSteps: [...],
  clientTypes: [...],
  // Mover todas las constantes del CRM original
}
```

#### 2.3 Testing Core
```bash
# Test de login
# Test de carga de chats
# Test de selección de chat
```

### Fase 3: Migración de Features (Día 4-7)

#### 3.1 Feature: Embudo de Ventas

**Paso 1:** Crear componente
```bash
touch src/crm/simple-components/SalesPipeline.jsx
```

**Paso 2:** Extraer lógica del CRM original
```javascript
// Del RealEstateChatApp.jsx líneas ~2400-2800
// Extraer a SalesPipeline.jsx
```

**Paso 3:** Crear hook
```bash
touch src/crm/simple-hooks/useSalesPipeline.js
```

**Paso 4:** Integrar en SimpleCRM
```javascript
// SimpleCRM.jsx
import { SalesPipeline } from "./simple-components/SalesPipeline"
```

**Paso 5:** Testing
```javascript
// Test que funcione igual que el original
```

#### 3.2 Feature: Búsqueda de Propiedades

Repetir pasos 1-5 pero para búsqueda de propiedades.

#### 3.3 Feature: Calendario

Repetir pasos 1-5 pero para calendario.

#### 3.4 Feature: Gestión de Documentos

Repetir pasos 1-5 pero para documentos.

### Fase 4: Testing Integral (Día 8-9)

#### 4.1 Tests Funcionales
```bash
# Lista de verificación
- [ ] Login con Google
- [ ] Carga de chats
- [ ] Selección de chat
- [ ] Envío de mensaje
- [ ] Envío de archivo
- [ ] Búsqueda de chat
- [ ] Filtros
- [ ] Etiquetas
- [ ] Calendario
- [ ] Propiedades
- [ ] Documentos
```

#### 4.2 Tests de Performance
```bash
# Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000/crm-simple

# Métricas esperadas
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Largest Contentful Paint < 2.5s
```

#### 4.3 Tests de Compatibilidad
```bash
# Navegadores
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

# Dispositivos
- [ ] Desktop 1920x1080
- [ ] Laptop 1366x768
- [ ] Tablet 768x1024
- [ ] Mobile 375x667
```

### Fase 5: Deployment (Día 10)

#### 5.1 Pre-Deployment Checklist
```bash
- [ ] Todos los tests pasando
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] Documentación actualizada
- [ ] Changelog creado
```

#### 5.2 Deploy a Staging
```bash
git push origin feature/migrate-to-simple-crm
# Crear PR
# Review de código
# Deploy a staging
```

#### 5.3 Testing en Staging
```bash
# URL de staging
https://staging.tudominio.com/crm-simple

# Verificar todas las funcionalidades
# Testing con usuarios beta
```

#### 5.4 Deploy a Producción
```bash
# Merge a main
git checkout main
git merge feature/migrate-to-simple-crm

# Deploy
vercel --prod
# o
npm run build && npm run start
```

### Fase 6: Post-Deployment (Día 11-14)

#### 6.1 Monitoreo
```bash
# Configurar monitoreo
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Performance (Vercel Analytics)
```

#### 6.2 Feedback de Usuarios
```bash
# Recopilar feedback
- [ ] Encuesta a usuarios
- [ ] Análisis de uso
- [ ] Identificar problemas
```

#### 6.3 Optimizaciones
```bash
# Basado en feedback y métricas
- [ ] Optimizar componentes lentos
- [ ] Corregir bugs reportados
- [ ] Mejorar UX en puntos críticos
```

## 🔧 Comandos Útiles Durante la Migración

### Comparar Ambas Versiones
```bash
# Terminal 1: CRM Original
code src/crm/RealEstateChatApp.jsx

# Terminal 2: SimpleCRM
code src/crm/SimpleCRM.jsx

# Diff
git diff --no-index src/crm/RealEstateChatApp.jsx src/crm/SimpleCRM.jsx
```

### Buscar Funcionalidad en CRM Original
```bash
# Buscar donde se implementa algo
grep -r "nombre_de_funcion" src/crm/RealEstateChatApp.jsx
```

### Testing Rápido
```bash
# Test específico
npm test -- ChatView.test.js

# Watch mode
npm test -- --watch
```

## 🐛 Troubleshooting Común

### Problema 1: "Cannot find module"
```bash
# Solución: Verificar importaciones
# Cambiar de:
import { Button } from "../../../../../../components/ui/button"

# A:
import { Button } from "@/components/ui/button"
```

### Problema 2: "Hooks can only be called inside function components"
```bash
# Solución: Verificar que el componente sea function, no class
# Y que los hooks estén al inicio del componente
```

### Problema 3: "Maximum update depth exceeded"
```bash
# Solución: Revisar dependencias de useEffect
# Usar useCallback para funciones en dependencias
```

### Problema 4: "State not updating"
```bash
# Solución: No mutar estado directamente
# Usar setState con nuevo objeto/array
```

## 📊 Métricas de Éxito

### Antes de la Migración
```
- Tiempo de carga inicial: ?
- Tiempo para agregar feature: ?
- Líneas de código: 6,790
- Complejidad ciclomática: ?
- Cobertura de tests: ?
```

### Después de la Migración (Objetivos)
```
- Tiempo de carga inicial: < 2s
- Tiempo para agregar feature: < 2 días
- Líneas de código: ~1,200 (82% reducción)
- Complejidad ciclomática: < 10 por componente
- Cobertura de tests: > 80%
```

## 🎯 Checklist Final

### Pre-Launch
- [ ] Todos los tests pasando
- [ ] Performance optimizada
- [ ] SEO configurado (si aplica)
- [ ] Analytics configurado
- [ ] Error tracking configurado
- [ ] Documentación actualizada
- [ ] README actualizado
- [ ] Changelog creado
- [ ] Backup del código anterior
- [ ] Plan de rollback listo

### Post-Launch
- [ ] Monitorear errores (primeras 24h)
- [ ] Recopilar feedback usuarios
- [ ] Revisar métricas de performance
- [ ] Documentar lecciones aprendidas
- [ ] Planear optimizaciones futuras

## 🔄 Plan de Rollback

Si algo sale mal, aquí está el plan de rollback:

### Rollback Inmediato (< 5 minutos)
```bash
# Si hay error crítico, cambiar ruta rápidamente
# En src/app/crm/page.js
import RealEstateChatApp from "@/crm/RealEstateChatApp" // Volver al original

# Redeploy
vercel --prod
```

### Rollback Completo (< 30 minutos)
```bash
# Revertir commit
git revert HEAD

# O restaurar desde backup
git checkout main
git reset --hard commit_anterior

# Redeploy
vercel --prod
```

## 📞 Contacto y Soporte

Durante la migración, mantén comunicación con:

- **Equipo de Desarrollo**: Para resolver dudas técnicas
- **Product Owner**: Para validar funcionalidades
- **Usuarios Beta**: Para feedback temprano
- **DevOps**: Para deployment y monitoreo

## 🎉 Celebra el Éxito

Una vez completada la migración:

1. ✅ Documenta el proceso
2. ✅ Comparte las métricas de mejora
3. ✅ Agradece al equipo
4. ✅ Planea la próxima optimización

---

**¡Buena suerte con la migración!** 🚀

Si sigues esta guía paso a paso, la migración será suave y exitosa.
