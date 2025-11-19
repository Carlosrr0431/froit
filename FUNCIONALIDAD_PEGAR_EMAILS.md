# 📧 Nueva Funcionalidad: Pegar Emails Directamente

## 🎉 ¿Qué se agregó?

Ahora puedes **pegar una lista de emails directamente** en un campo de texto, sin necesidad de crear un archivo Excel.

---

## 🚀 Cómo Usar

### Opción 1: Subir Archivo Excel (Como antes)
1. Ve a `/marketing`
2. Click en "Nueva Campaña"
3. Sube tu archivo `.xlsx`, `.xls` o `.csv`

### Opción 2: Pegar Emails Directamente (NUEVO ✨)
1. Ve a `/marketing`
2. Click en "Nueva Campaña"
3. Busca la sección **"O Pega Emails Directamente"**
4. Pega tu lista de emails en el campo de texto
5. Click en **"Extraer Emails del Texto"**

---

## 📋 Formatos Soportados

El sistema extrae automáticamente emails de **cualquier texto**, sin importar el formato:

### ✅ Emails separados por líneas
```
juan@empresa.com
maria@empresa.com
pedro@empresa.com
```

### ✅ Emails separados por comas
```
juan@empresa.com, maria@empresa.com, pedro@empresa.com
```

### ✅ Emails en párrafos o listas
```
Contacta a juan@empresa.com para más info
También puedes escribir a maria@empresa.com
El gerente es pedro@empresa.com
```

### ✅ Emails mezclados con texto
```
1. Juan Pérez - juan@empresa.com - Tel: 123456
2. María González - maria@empresa.com - Tel: 654321
3. Pedro López - pedro@empresa.com - Tel: 789012
```

### ✅ Desde Excel/Word copiado
```
Nombre          Email
Juan            juan@empresa.com
María           maria@empresa.com
Pedro           pedro@empresa.com
```

---

## 🔍 Características

### ✨ Extracción Inteligente
- **Regex avanzado**: Detecta automáticamente todos los emails válidos
- **Elimina duplicados**: Si pegas el mismo email varias veces, solo se agrega una vez
- **Combina fuentes**: Puedes subir Excel Y pegar emails, se combinan sin duplicados
- **Validación automática**: Solo extrae emails con formato válido

### 📊 Vista Previa
- Muestra cuántos emails fueron extraídos
- Lista completa de todos los emails agregados
- Contador en tiempo real
- Opción para limpiar la lista

### 🎯 Deduplicación
- Si cargas un Excel y luego pegas más emails, el sistema:
  - ✅ Detecta emails ya existentes
  - ✅ Solo agrega los nuevos
  - ✅ Te muestra cuántos emails nuevos se agregaron

---

## 💡 Casos de Uso

### 1. Lista de LinkedIn
Copias una lista de contactos de LinkedIn y la pegas directamente.

### 2. Emails de una reunión
Alguien te envía emails en un mensaje de WhatsApp o Slack.

### 3. Base de datos exportada
Copias resultados de una consulta SQL con emails.

### 4. Correo electrónico
Tienes emails en un correo que te enviaron.

### 5. Documento de Google Docs/Word
Copias una tabla o lista de un documento.

---

## 🛠️ Detalles Técnicos

### Regex Utilizado
```javascript
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
```

Este regex detecta:
- ✅ Emails estándar: `usuario@dominio.com`
- ✅ Emails con puntos: `nombre.apellido@empresa.com`
- ✅ Emails con números: `usuario123@dominio.com`
- ✅ Subdominios: `contacto@ventas.empresa.com`
- ✅ Emails con guiones: `nombre-apellido@dominio.com`

### Procesamiento
1. El texto se analiza con el regex
2. Se extraen todos los emails encontrados
3. Se convierten a minúsculas
4. Se eliminan duplicados (usando `Set`)
5. Se crea un objeto con `{email, nombre}`
6. El nombre por defecto es la parte antes del `@`

### Ejemplo de Transformación
```javascript
// INPUT (texto pegado):
"Contacta a Juan.Perez@Empresa.COM o maria@empresa.com"

// OUTPUT (contactos extraídos):
[
  { email: "juan.perez@empresa.com", nombre: "juan.perez" },
  { email: "maria@empresa.com", nombre: "maria" }
]
```

---

## 📸 Interfaz

### Campo de Texto
- **Placeholder**: Muestra ejemplo de cómo pegar emails
- **Rows**: 6 líneas visibles
- **Fuente**: Monoespaciada para mejor legibilidad
- **Borde**: Púrpura al hacer focus
- **Redimensionable**: NO (para mantener diseño limpio)

### Botón de Extracción
- **Texto**: "Extraer Emails del Texto"
- **Icono**: Mail
- **Color**: Gradiente púrpura
- **Estado**: Deshabilitado si no hay texto
- **Feedback**: Toast de loading durante extracción

### Lista de Emails
- **Icono**: Mail para cada email
- **Fuente**: Monoespaciada para emails
- **Scroll**: Máximo 40px de altura
- **Botón limpiar**: Icono de basura en rojo
- **Badge**: Muestra cantidad total

---

## 🔧 Funciones Agregadas

### Estado Nuevo
```javascript
const [textoPegado, setTextoPegado] = useState('')
```

### Función Principal
```javascript
const extraerEmailsDeTexto = () => {
    // 1. Validar que hay texto
    // 2. Extraer emails con regex
    // 3. Eliminar duplicados
    // 4. Crear objetos de contactos
    // 5. Combinar con contactos existentes
    // 6. Actualizar estado
    // 7. Limpiar campo de texto
}
```

---

## ✅ Validaciones

### En el Campo de Texto
- ⚠️ Si está vacío → Botón deshabilitado
- ⚠️ Si no hay emails válidos → Error toast

### En la Extracción
- ✅ Valida formato de email con regex
- ✅ Elimina duplicados internos
- ✅ No agrega emails que ya existen en la lista
- ✅ Convierte todo a minúsculas

### En la Creación de Campaña
- ✅ Valida que haya al menos 1 contacto
- ✅ Acepta contactos de Excel O texto O ambos

---

## 🎨 Mejoras de UX

### Feedback Visual
- ✅ Toast de loading durante extracción
- ✅ Toast de éxito con cantidad de emails
- ✅ Badge verde con total de contactos
- ✅ Lista scrolleable de emails extraídos

### Mensajes Claros
- "X emails nuevos agregados. Total: Y"
- "Pega algunos emails en el campo de texto"
- "No se encontraron emails válidos en el texto"

### Tips Útiles
- 💡 "Puedes pegar emails desde Excel, Word, notas, etc."
- Placeholder con ejemplo de formato

---

## 🚀 Ejemplo Completo de Uso

### Paso a Paso

1. **Copiar emails de cualquier fuente**
   ```
   Reunión con:
   - Juan (juan@tech.com)
   - María (maria@marketing.com)
   - Pedro (pedro@ventas.com)
   ```

2. **Pegar en el campo de texto**
   - El sistema detecta automáticamente los 3 emails

3. **Click en "Extraer Emails"**
   - Toast: "3 emails nuevos agregados. Total: 3"

4. **Ver la lista extraída**
   ```
   📧 juan@tech.com (juan)
   📧 maria@marketing.com (maria)
   📧 pedro@ventas.com (pedro)
   ```

5. **Opcional: Agregar más**
   - Pega más emails o sube un Excel
   - Se combinan sin duplicados

6. **Crear campaña**
   - Click en "Crear Campaña"
   - Los emails se guardan en `froit_email_contacts`
   - Se crean registros en `froit_email_sends`

---

## 🔄 Compatibilidad

### Con Funcionalidad Existente
- ✅ Funciona junto con carga de Excel
- ✅ No interfiere con el flujo actual
- ✅ Usa las mismas funciones de creación de campaña
- ✅ Se guarda en las mismas tablas de Supabase

### Con Datos Existentes
- ✅ Respeta contactos ya cargados
- ✅ No crea duplicados en la base de datos
- ✅ Hace upsert en `froit_email_contacts`

---

## 📊 Comparación

| Característica | Excel | Pegar Texto |
|----------------|-------|-------------|
| Velocidad | Media | Rápida ⚡ |
| Facilidad | Media | Muy fácil ✅ |
| Estructura | Requiere formato | Cualquier texto ✨ |
| Nombres | Soportados | Automático |
| Validación | Completa | Completa |
| Duplicados | Elimina | Elimina |

---

## 🎉 Beneficios

### Para el Usuario
- ⚡ **Más rápido**: No necesita crear Excel
- 🎯 **Más flexible**: Acepta cualquier formato
- 💼 **Más práctico**: Copia y pega directo
- 🔄 **Más versátil**: Combina múltiples fuentes

### Para el Sistema
- ✅ Mismas validaciones
- ✅ Misma estructura de datos
- ✅ No cambia base de datos
- ✅ Retrocompatible

---

## 🐛 Testing

### Casos Probados
- ✅ Lista simple de emails
- ✅ Emails con texto mezclado
- ✅ Emails duplicados
- ✅ Formato incorrecto
- ✅ Campo vacío
- ✅ Combinación Excel + Texto
- ✅ Emails con mayúsculas
- ✅ Emails con caracteres especiales

---

## 📝 Conclusión

Esta funcionalidad hace el sistema **más accesible y flexible**, permitiendo a los usuarios agregar contactos de forma rápida sin depender de archivos Excel.

**Próxima mejora sugerida**: 
- Agregar opción para pegar tabla completa con nombres y emails
- Detectar automáticamente columnas en texto tabulado

---

**Fecha de implementación**: Noviembre 18, 2025  
**Sistema**: Froit Email Marketing v2.1  
**Característica**: Extracción automática de emails desde texto pegado
