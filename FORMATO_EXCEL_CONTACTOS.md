# 📊 Formato de Archivo para Importar Contactos

## Archivo de Ejemplo: `ejemplo_contactos.csv`

Este archivo muestra el formato correcto para importar contactos al sistema de Email Marketing.

## 📋 Requisitos del Archivo

### Formatos Aceptados
- ✅ `.xlsx` (Excel 2007+)
- ✅ `.xls` (Excel antiguo)
- ✅ `.csv` (Separado por comas)

### Estructura Requerida

El archivo debe tener **al menos** una columna de **email**. La columna de nombre es opcional.

**Columnas reconocidas automáticamente:**

| Columna Email | Columna Nombre |
|---------------|----------------|
| `email` | `nombre` |
| `Email` | `Nombre` |
| `correo` | `name` |
| `mail` | `Name` |
| `e-mail` | `contacto` |

**Ejemplo de estructura mínima:**

```csv
email
juan.perez@example.com
maria.gonzalez@example.com
pedro.lopez@example.com
```

**Ejemplo de estructura completa:**

```csv
email,nombre
juan.perez@example.com,Juan Pérez
maria.gonzalez@example.com,María González
pedro.lopez@example.com,Pedro López
```

## ✅ Validaciones Automáticas

El sistema realiza las siguientes validaciones:

1. **Formato de email válido**: Verifica que cada email tenga formato correcto
   - ✅ `usuario@dominio.com`
   - ❌ `usuario@dominio`
   - ❌ `usuario.com`

2. **Duplicados**: Elimina automáticamente emails repetidos
   - Solo se importa una vez cada email único

3. **Normalización**: Convierte todos los emails a minúsculas
   - `Juan@Example.COM` → `juan@example.com`

4. **Emails vacíos**: Ignora filas sin email

## 📝 Instrucciones de Uso

### Paso 1: Preparar tu archivo

1. Abre Excel o Google Sheets
2. Crea una columna llamada `email`
3. Opcionalmente, crea una columna llamada `nombre`
4. Ingresa tus contactos (uno por fila)
5. Guarda el archivo como `.xlsx` o `.csv`

### Paso 2: Importar en Froit

1. Ve a `/marketing`
2. Click en "Nueva Campaña"
3. Completa nombre y asunto
4. Click en "Subir Archivo Excel"
5. Selecciona tu archivo
6. Verifica la vista previa de contactos extraídos
7. Click en "Crear Campaña"

### Paso 3: Verificar importación

El sistema mostrará:
- ✅ Cantidad de contactos extraídos
- ✅ Lista de emails importados
- ❌ Emails inválidos (si los hay)

## 🎯 Ejemplo Práctico

### Caso 1: Lista Simple de Emails

**Archivo**: `contactos_simples.csv`
```csv
email
cliente1@empresa.com
cliente2@empresa.com
cliente3@empresa.com
```

**Resultado**: 3 contactos importados (sin nombre, se usará el email)

### Caso 2: Lista Completa

**Archivo**: `contactos_completos.xlsx`
```
| email                    | nombre           |
|--------------------------|------------------|
| juan.perez@tech.com      | Juan Pérez       |
| maria.g@marketing.com    | María González   |
| pedro@digital.com        | Pedro López      |
```

**Resultado**: 3 contactos con nombre completo

### Caso 3: Exportación desde CRM

Si exportas desde un CRM, asegúrate de que las columnas se llamen `email` y `nombre`, o renómbralas manualmente.

**Ejemplo de mapeo:**

| Columna Original | Renombrar a |
|------------------|-------------|
| `Email Address` | `email` |
| `Full Name` | `nombre` |
| `Contact Email` | `email` |
| `Name` | `nombre` |

## ⚠️ Errores Comunes

### Error: "No se encontró una columna de email"
**Solución**: Asegúrate de que al menos una columna se llame `email`, `correo` o `mail`

### Error: "No se encontraron emails válidos"
**Solución**: Verifica que los emails tengan formato correcto (usuario@dominio.com)

### Error: "El archivo está vacío"
**Solución**: El archivo debe tener al menos 2 filas (encabezados + 1 contacto)

## 📊 Límites y Recomendaciones

- ✅ **Tamaño máximo**: Sin límite de filas
- ✅ **Duplicados**: Se eliminan automáticamente
- ⚠️ **Envío**: Máximo 300 emails por día (límite de Brevo)
- 💡 **Tip**: Para listas grandes, crea varias campañas

## 🔄 Actualización de Contactos

Si importas un email que ya existe en la base de datos:
- Se actualiza el nombre (si es diferente)
- Se mantiene el historial de métricas
- No se crean duplicados

## 📞 Soporte

Si tienes problemas importando contactos:
1. Verifica que el archivo tenga la columna `email`
2. Asegúrate de que los emails sean válidos
3. Revisa los logs en la consola del navegador
4. Consulta `EMAIL_MARKETING_SETUP.md` para más detalles

---

**Archivo de ejemplo incluido**: `ejemplo_contactos.csv`
