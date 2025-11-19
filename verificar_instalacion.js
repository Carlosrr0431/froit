#!/usr/bin/env node

/**
 * ✅ Script de Verificación del Sistema de Email Marketing
 * 
 * Este script verifica que todo esté configurado correctamente
 * Ejecutar: node verificar_instalacion.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 VERIFICANDO INSTALACIÓN DEL SISTEMA DE EMAIL MARKETING\n');
console.log('=' . repeat(60));

// Colores para terminal
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

let errores = 0;
let advertencias = 0;

// Función auxiliar para verificar
function verificar(nombre, condicion, mensajeError = '') {
    if (condicion) {
        console.log(`${colors.green}✅ ${nombre}${colors.reset}`);
        return true;
    } else {
        console.log(`${colors.red}❌ ${nombre}${colors.reset}`);
        if (mensajeError) {
            console.log(`   ${colors.yellow}→ ${mensajeError}${colors.reset}`);
        }
        errores++;
        return false;
    }
}

function advertir(mensaje) {
    console.log(`${colors.yellow}⚠️  ${mensaje}${colors.reset}`);
    advertencias++;
}

// 1. Verificar archivos esenciales
console.log('\n📁 ARCHIVOS ESENCIALES:');
console.log('-'.repeat(60));

const archivosRequeridos = [
    { path: 'src/app/marketing/page.js', nombre: 'Página principal de marketing' },
    { path: 'src/app/marketing/emailTemplate.js', nombre: 'Plantilla de email HTML' },
    { path: 'src/app/api/mailMarketing/route.js', nombre: 'API Webhook de Brevo' },
    { path: 'src/app/api/sendEmailBrevo/route.js', nombre: 'API de envío de emails' },
    { path: 'src/lib/supabase.js', nombre: 'Cliente de Supabase' },
    { path: 'supabase/setup_email_marketing.sql', nombre: 'SQL de configuración' },
    { path: 'supabase/seed_email_marketing.sql', nombre: 'SQL de datos de prueba' },
    { path: 'EMAIL_MARKETING_SETUP.md', nombre: 'Documentación completa' },
    { path: 'INICIO_RAPIDO_EMAIL_MARKETING.md', nombre: 'Guía rápida' },
    { path: '.env.example', nombre: 'Ejemplo de variables de entorno' }
];

archivosRequeridos.forEach(archivo => {
    const existe = fs.existsSync(archivo.path);
    verificar(
        archivo.nombre,
        existe,
        `Archivo no encontrado: ${archivo.path}`
    );
});

// 2. Verificar dependencias en package.json
console.log('\n📦 DEPENDENCIAS NPM:');
console.log('-'.repeat(60));

try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const dependenciasRequeridas = [
        '@supabase/supabase-js',
        'xlsx',
        'react-hot-toast',
        'framer-motion',
        'lucide-react'
    ];

    dependenciasRequeridas.forEach(dep => {
        verificar(
            dep,
            deps[dep] !== undefined,
            `Instalar con: npm install ${dep}`
        );
    });
} catch (error) {
    verificar('package.json', false, 'No se pudo leer package.json');
}

// 3. Verificar variables de entorno
console.log('\n🔐 VARIABLES DE ENTORNO:');
console.log('-'.repeat(60));

const envExists = fs.existsSync('.env.local') || fs.existsSync('.env');
if (envExists) {
    const envFile = fs.existsSync('.env.local') ? '.env.local' : '.env';
    const envContent = fs.readFileSync(envFile, 'utf8');

    const variablesRequeridas = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON',
        'BREVO_API_KEY',
        'BREVO_SENDER_EMAIL',
        'NEXT_PUBLIC_APP_URL'
    ];

    variablesRequeridas.forEach(variable => {
        const definida = envContent.includes(`${variable}=`);
        const tieneValor = definida && !envContent.match(new RegExp(`${variable}=(\\s*$|your_|tu_)`));
        
        if (definida && tieneValor) {
            console.log(`${colors.green}✅ ${variable}${colors.reset}`);
        } else if (definida) {
            advertir(`${variable} está definida pero sin valor real`);
        } else {
            verificar(variable, false, `Agregar a ${envFile}`);
        }
    });

    // Verificar email del remitente
    if (envContent.includes('BREVO_SENDER_EMAIL=comercial@froit.com.ar')) {
        console.log(`${colors.green}✅ Email del remitente configurado correctamente${colors.reset}`);
    } else if (envContent.includes('BREVO_SENDER_EMAIL=')) {
        advertir('Email del remitente no es comercial@froit.com.ar');
    }
} else {
    verificar('.env.local o .env', false, 'Crear .env.local basado en .env.example');
}

// 4. Verificar estructura de carpetas
console.log('\n📂 ESTRUCTURA DE CARPETAS:');
console.log('-'.repeat(60));

const carpetasRequeridas = [
    'src/app/marketing',
    'src/app/api/mailMarketing',
    'src/app/api/sendEmailBrevo',
    'src/lib',
    'supabase'
];

carpetasRequeridas.forEach(carpeta => {
    const existe = fs.existsSync(carpeta);
    verificar(carpeta, existe, `Crear carpeta: ${carpeta}`);
});

// 5. Verificar sintaxis de archivos principales
console.log('\n🔧 SINTAXIS DE ARCHIVOS:');
console.log('-'.repeat(60));

try {
    require('./src/lib/supabase.js');
    console.log(`${colors.green}✅ supabase.js (sintaxis válida)${colors.reset}`);
} catch (error) {
    verificar('supabase.js', false, `Error de sintaxis: ${error.message}`);
}

try {
    require('./src/app/marketing/emailTemplate.js');
    console.log(`${colors.green}✅ emailTemplate.js (sintaxis válida)${colors.reset}`);
} catch (error) {
    verificar('emailTemplate.js', false, `Error de sintaxis: ${error.message}`);
}

// 6. Resumen final
console.log('\n' + '='.repeat(60));
console.log('\n📊 RESUMEN DE VERIFICACIÓN:\n');

if (errores === 0 && advertencias === 0) {
    console.log(`${colors.green}🎉 ¡TODO PERFECTO! Sistema listo para usar${colors.reset}`);
    console.log(`\n${colors.blue}Próximos pasos:${colors.reset}`);
    console.log('1. Configurar variables de entorno en .env.local');
    console.log('2. Ejecutar SQL en Supabase: supabase/setup_email_marketing.sql');
    console.log('3. Configurar webhook en Brevo');
    console.log('4. Ejecutar: npm run dev');
    console.log('5. Visitar: http://localhost:3000/marketing');
} else {
    if (errores > 0) {
        console.log(`${colors.red}❌ ${errores} error(es) encontrado(s)${colors.reset}`);
    }
    if (advertencias > 0) {
        console.log(`${colors.yellow}⚠️  ${advertencias} advertencia(s)${colors.reset}`);
    }
    console.log(`\n${colors.yellow}Por favor, corrige los problemas antes de continuar${colors.reset}`);
    console.log(`Consulta: ${colors.blue}EMAIL_MARKETING_SETUP.md${colors.reset} para ayuda`);
}

console.log('\n' + '='.repeat(60) + '\n');

// Salir con código de error si hay problemas
process.exit(errores > 0 ? 1 : 0);
