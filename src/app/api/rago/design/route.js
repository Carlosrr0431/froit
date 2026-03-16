import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ═══════════════════════════════════════════════════════════════
// PROPORCIONES REALES de una vivienda argentina (% de superficie)
// Fuente: estándares CFIA / manuales de arquitectura residencial
// ═══════════════════════════════════════════════════════════════
const PROPORCIONES = {
  living:      { minPct: 0.18, maxPct: 0.28, minW: 4, minH: 4, ratio: 'wide' },
  cocina:      { minPct: 0.07, maxPct: 0.12, minW: 2.8, minH: 3, ratio: 'square' },
  dormitorio:  { minPct: 0.10, maxPct: 0.16, minW: 3.2, minH: 3.5, ratio: 'square' },
  baño:        { minPct: 0.03, maxPct: 0.06, minW: 1.8, minH: 2.5, ratio: 'tall' },
  lavadero:    { minPct: 0.02, maxPct: 0.04, minW: 1.5, minH: 2, ratio: 'tall' },
  pasillo:     { minPct: 0.04, maxPct: 0.10, minW: 1.2, minH: 3, ratio: 'tall' },
  garage:      { minPct: 0.10, maxPct: 0.18, minW: 3, minH: 5.5, ratio: 'tall' },
  comedor:     { minPct: 0.08, maxPct: 0.14, minW: 3, minH: 3.5, ratio: 'square' },
  hall:        { minPct: 0.02, maxPct: 0.05, minW: 1.5, minH: 2, ratio: 'square' },
  deposito:    { minPct: 0.02, maxPct: 0.05, minW: 1.5, minH: 2, ratio: 'square' },
  terraza:     { minPct: 0.05, maxPct: 0.15, minW: 2.5, minH: 3, ratio: 'wide' },
  quincho:     { minPct: 0.08, maxPct: 0.15, minW: 3, minH: 4, ratio: 'wide' },
};

const SYSTEM_PROMPT = `Eres RAGO, un arquitecto argentino IA experto en diseño de planos de viviendas.

## ⚠️ REGLA CRÍTICA: SUPERFICIE TOTAL

Cuando el usuario dice "una casa de X m²", la SUMA de TODOS los ambientes DEBE ser EXACTAMENTE X m² (tolerancia ±5%).
Ejemplo: "casa de 100m²" → la suma de las áreas de TODOS los ambientes debe estar entre 95m² y 105m².

### Distribución típica para una casa argentina:
Para 100m²:
- Living-Comedor: ~25m² (5×5 o 6×4.2)
- Cocina: ~10m² (3.3×3)
- Dormitorio principal: ~14m² (4×3.5)
- Dormitorio 2: ~12m² (4×3)
- Baño: ~5m² (2.5×2)
- Pasillo/circulación: ~8m² (1.5×5.3)
- Lavadero: ~4m² (2×2)
TOTAL: ~78m² de ambientes + ~22% de muros/circulación = 100m²

### Para otras superficies, escalar proporcionalmente:
- 60m²: reducir cada ambiente proporcionalmente
- 80m²: intermedio
- 120m²: agrandar ambientes + posiblemente agregar vestidor, hall
- 150m²: ambientes generosos + garage + quincho

### SIEMPRE INCLUIR estos ambientes mínimos (aunque el usuario no los mencione):
1. Living o Living-Comedor ✅
2. Cocina ✅ (SIEMPRE, nunca olvidar)
3. Los dormitorios pedidos ✅
4. Los baños pedidos ✅
5. Pasillo de circulación (mínimo 1.2m ancho)
6. Lavadero (mínimo 2×2m)

## FORMATO JSON DEL PLANO

{
  "rooms": [
    { "id": "living_1", "name": "Living-Comedor", "type": "living", "x": 0, "y": 0, "width": 6, "height": 4.2 }
  ],
  "doors": [
    { "x": 3, "y": 4.2, "orientation": "horizontal", "width": 0.9 }
  ],
  "windows": [
    { "x": 0, "y": 2, "orientation": "vertical", "width": 1.5 }
  ]
}

Coordenadas en METROS. Esquina superior izquierda = (0,0).
width = ancho horizontal, height = alto vertical.

Tipos válidos: living, dormitorio, baño, cocina, comedor, garage, lavadero, pasillo, hall, deposito, oficina, local, terraza, balcon, quincho, otro

## REGLAS DE DISTRIBUCIÓN OBLIGATORIAS

1. **SIN SUPERPOSICIONES** — Ningún ambiente puede superponerse con otro. Verificar que los rectángulos NO se crucen.
2. **ADYACENCIA** — Los ambientes deben estar contiguos (compartir paredes).
3. **ZONA SOCIAL** — Living, cocina y comedor van juntos, idealmente cerca de la entrada.
4. **ZONA PRIVADA** — Dormitorios agrupados, con baño accesible desde el pasillo.
5. **VENTANAS** — En TODOS los muros exteriores de cada habitación (no en paredes compartidas entre ambientes).
6. **PUERTAS** — En cada paso entre ambientes. Verificar que cada habitación tenga al menos 1 puerta.
7. **PROPORCIONES REALES** — Los ambientes deben tener relación width/height entre 0.5 y 2.0 (no cuadrados ni demasiado largos). Dormitorios deben ser mínimo 3.2×3.5m. Baños mínimo 1.8×2.5m. Cocinas mínimo 2.8×3m.

## DISTRIBUCIÓN: GRILLA COMPACTA SIN HUECOS

TODOS los ambientes DEBEN estar pegados entre sí compartiendo paredes. NO puede haber espacios vacíos.
La casa es un RECTÁNGULO sólido dividido en ambientes internos.

Estructura de 3 filas:
- Fila 1 (social): Living-Comedor + Cocina (misma altura, pegados)
- Fila 2 (circulación): Pasillo de ancho completo
- Fila 3 (privada): Dormitorios + columna derecha con Baño/Lavadero apilados

Ejemplo EXACTO para 100m² (2 dorm, 1 baño) — W=10.3m:
Living-Comedor: x=0, y=0, width=6.7, height=3.5 (23.5m²)
Cocina: x=6.7, y=0, width=3.6, height=3.5 (12.6m²) ← x = Living.width
Pasillo: x=0, y=3.5, width=10.3, height=1.4 ← y = Living.height
Dorm.Principal: x=0, y=4.9, width=4.2, height=4.8 ← y = Pasillo.y + Pasillo.height
Dormitorio 2: x=4.2, y=4.9, width=3.9, height=4.8 ← x = Dorm1.width
Baño: x=8.1, y=4.9, width=2.2, height=2.6 ← x = Dorm2.x + Dorm2.width
Lavadero: x=8.1, y=7.5, width=2.2, height=2.2 ← y = Baño.y + Baño.height

REGLAS:
- Cocina.x = Living.x + Living.width (sin espacio)
- Pasillo.y = Living.height (pegado abajo)
- Pasillo.width = ancho total de la casa
- Fila privada.y = Pasillo.y + Pasillo.height
- Baño y Lavadero se APILAN verticalmente en la columna derecha
- Lavadero.y = Baño.y + Baño.height
- Todos los bordes derechos coinciden (misma x + width máxima)

## DIMENSIONES ESPECÍFICAS DEL USUARIO

Cuando el usuario dice dimensiones como "2 dormitorios de 2x3", "cocina de 3x4", etc.:
- USAR EXACTAMENTE esas dimensiones (width × height en metros) para esos ambientes.
- NO modificar ni redondear las dimensiones dadas por el usuario.
- Los ambientes que NO tengan dimensiones específicas se auto-calculan para completar la superficie total.
- La SUMA de todos los ambientes (los especificados + los auto-calculados) debe dar la superficie total pedida.

Ejemplo: "casa de 100m² con 2 dormitorios de 2x3 y 1 de 3x3"
→ Dormitorio 1: 2×3m (6m²), Dormitorio 2: 2×3m (6m²), Dormitorio 3: 3×3m (9m²)
→ Restante: 100 - 21 = 79m² para living, cocina, baño, pasillo, lavadero.

## CUANDO EL USUARIO MODIFICA

Si hay un "currentPlan", mantener la base y solo cambiar lo pedido. Reubicar si es necesario para que no haya superposiciones.

## FORMATO DE RESPUESTA

SIEMPRE JSON válido:
{
  "plan": { "rooms": [...], "doors": [...], "windows": [...] },
  "reply": "Texto en español argentino con emojis. Incluir tabla resumen de m² por ambiente y total."
}

En "reply" SIEMPRE incluir:
- Resumen de cada ambiente con sus m²
- Total de m² cubiertos
- Sugerencias de mejora

Si es solo una pregunta (sin cambiar plano):
{ "plan": null, "reply": "respuesta" }

NUNCA texto plano. SIEMPRE JSON.`;

// ═══════════════════════════════════════════════════════════════
// Utilidad de redondeo
// ═══════════════════════════════════════════════════════════════
function r(n) { return Math.round(n * 10) / 10; }

// ═══════════════════════════════════════════════════════════════
// GENERADOR LOCAL DE PLANOS — Grilla perfecta sin huecos
// Layout: Social → Pasillo → Privada (3 filas, rectángulo sólido)
// ═══════════════════════════════════════════════════════════════

function generarPlanoLocal(m2Total, dormitorios, banos, roomSpecs = null) {
  // ── Collect user-specified dimensions ──
  // roomSpecs: [{ type: 'dormitorio', count: 2, w: 2, h: 3 }, ...]
  const specsByType = {};
  let userSpecifiedM2 = 0;
  if (roomSpecs && roomSpecs.length > 0) {
    roomSpecs.forEach(spec => {
      if (!specsByType[spec.type]) specsByType[spec.type] = [];
      for (let i = 0; i < spec.count; i++) {
        specsByType[spec.type].push({ w: spec.w, h: spec.h });
        userSpecifiedM2 += spec.w * spec.h;
      }
    });
  }

  // M² remaining for auto-calculated rooms
  const autoM2 = m2Total - userSpecifiedM2;

  // ── Dimensiones maestras ──
  const pasilloH = 1.4;
  const minServW = 2.2;

  // Determine dormitory dimensions (user-specified or auto)
  const dormSpecs = specsByType['dormitorio'] || [];
  const autoDorms = Math.max(0, dormitorios - dormSpecs.length);

  // Calculate min width from rooms that will exist
  const fixedDormW = dormSpecs.reduce((s, d) => s + d.w, 0);
  const autoMinDormW = autoDorms * 3.5;
  const minW = fixedDormW + autoMinDormW + minServW;
  const W = r(Math.max(minW, Math.sqrt(m2Total * 1.05)));

  // Determine row heights
  // If user specified living/cocina dims, use their height for row 1
  const livingSpec = (specsByType['living'] || [])[0];
  const cocinaSpec = (specsByType['cocina'] || [])[0];
  const comedorSpec = (specsByType['comedor'] || [])[0];

  const totalH = m2Total / W;
  const usableH = totalH - pasilloH;

  // Row 1 height: use tallest user-specified social room, or auto
  const userH1 = Math.max(
    livingSpec ? livingSpec.h : 0,
    cocinaSpec ? cocinaSpec.h : 0,
    comedorSpec ? comedorSpec.h : 0,
  );
  const H1 = r(userH1 > 0 ? userH1 : Math.max(3.2, usableH * 0.42));

  // Row 3 height: use tallest user-specified dorm, or auto
  const userH3 = dormSpecs.length > 0 ? Math.max(...dormSpecs.map(d => d.h)) : 0;
  const banoSpecs = specsByType['baño'] || specsByType['bano'] || [];
  const userBanoMaxH = banoSpecs.length > 0 ? banoSpecs.reduce((s, b) => s + b.h, 0) : 0;
  const H3 = r(Math.max(
    userH3 > 0 ? userH3 : 3.5,
    userBanoMaxH > 0 ? userBanoMaxH + 2 : 3.5, // banos + lavadero
    usableH * 0.58
  ));

  const rooms = [];

  // ── Fila 1: Social (Living + Cocina, pegados, misma altura) ──
  const livingW = livingSpec ? livingSpec.w : r(W * 0.65);
  const cocinaW = cocinaSpec ? cocinaSpec.w : r(W - livingW);
  // If both are user-specified but don't fill the width, adjust the non-specified one
  const socialW = livingW + cocinaW;
  const adjustedLivingW = livingSpec ? livingW : r(W - cocinaW);
  const adjustedCocinaW = cocinaSpec ? cocinaW : r(W - livingW);

  rooms.push({ id: 'living_1', name: livingSpec ? 'Living-Comedor' : 'Living-Comedor', type: 'living', x: 0, y: 0, width: adjustedLivingW, height: H1, _userSpec: !!livingSpec });
  rooms.push({ id: 'cocina_1', name: 'Cocina', type: 'cocina', x: adjustedLivingW, y: 0, width: r(W - adjustedLivingW), height: H1, _userSpec: !!cocinaSpec });

  // ── Fila 2: Pasillo (ancho completo, pegado a fila 1) ──
  rooms.push({ id: 'pasillo_1', name: 'Pasillo', type: 'pasillo', x: 0, y: H1, width: W, height: pasilloH });

  // ── Fila 3: Privada ──
  const privY = r(H1 + pasilloH);

  // Columna servicios (derecha): Baño(s) + Lavadero apilados verticalmente
  const servW = r(Math.max(2.2, W * 0.21));
  let svcY = privY;
  for (let i = 1; i <= banos; i++) {
    const bSpec = banoSpecs[i - 1]; // user spec if available
    const bW = bSpec ? bSpec.w : servW;
    const bH = bSpec ? bSpec.h : r(H3 * 0.58 / Math.max(1, banos));
    rooms.push({
      id: `bano_${i}`, name: banos > 1 ? `Baño ${i}` : 'Baño', type: 'baño',
      x: r(W - bW), y: r(svcY), width: bW, height: bH, _userSpec: !!bSpec,
    });
    svcY = r(svcY + bH);
  }
  // Lavadero fills remaining service column height
  const lavSpec = (specsByType['lavadero'] || [])[0];
  const lavW = lavSpec ? lavSpec.w : servW;
  const lavH = lavSpec ? lavSpec.h : r(privY + H3 - svcY);
  rooms.push({
    id: 'lavadero_1', name: 'Lavadero', type: 'lavadero',
    x: r(W - lavW), y: r(svcY), width: lavW, height: Math.max(lavH, 2), _userSpec: !!lavSpec,
  });

  // Dormitorios: use user dimensions when available, auto-calc rest
  const dormTotalW = r(W - servW);
  let dX = 0;
  const totalDorms = dormitorios;
  let dormIdx = 0; // index into dormSpecs

  for (let i = 1; i <= totalDorms; i++) {
    let dW, dH;
    if (dormIdx < dormSpecs.length) {
      // User-specified dormitory
      dW = dormSpecs[dormIdx].w;
      dH = dormSpecs[dormIdx].h;
      dormIdx++;
    } else {
      // Auto-calculated dormitory
      dH = H3;
      if (totalDorms - i === 0) {
        dW = r(dormTotalW - dX);
      } else if (i === 1 && autoDorms === totalDorms) {
        dW = r(dormTotalW * 0.52);
      } else {
        dW = r((dormTotalW - dX) / (totalDorms - i + 1));
      }
    }
    const isUserSpec = (dormIdx - 1) < dormSpecs.length && dormIdx > 0 && dW === dormSpecs[dormIdx - 1]?.w;
    rooms.push({
      id: `dorm_${i}`, name: i === 1 ? 'Dormitorio Principal' : `Dormitorio ${i}`, type: 'dormitorio',
      x: r(dX), y: privY, width: dW, height: dH, _userSpec: isUserSpec,
    });
    dX = r(dX + dW);
  }

  // ── Puertas ──
  const doors = generarPuertasAuto(rooms, H1, privY);

  // ── Ventanas ──
  const maxY = r(privY + H3);
  const windows = generarVentanasAuto(rooms, W, maxY);

  // ── Escalar para m² exactos (ajuste fino por redondeo) ──
  escalarPlanoExacto(rooms, doors, windows, m2Total);

  return { rooms, doors, windows };
}

// ═══════════════════════════════════════════════════════════════
// REPOSICIONAR PLANO: toma ambientes de la IA y los organiza
// en grilla compacta sin huecos (misma estructura de 3 filas)
// ═══════════════════════════════════════════════════════════════

function reposicionarPlano(plan, targetM2) {
  if (!plan?.rooms?.length || plan.rooms.length < 3) return plan;

  const rooms = plan.rooms;

  // Clasificar ambientes por zona
  const social = rooms.filter(rm => ['living', 'comedor', 'cocina'].includes(rm.type));
  const circ = rooms.filter(rm => ['pasillo', 'hall'].includes(rm.type));
  const privados = rooms.filter(rm => rm.type === 'dormitorio');
  const banos = rooms.filter(rm => rm.type === 'baño');
  const lavaderos = rooms.filter(rm => rm.type === 'lavadero');
  const servicios = [...banos, ...lavaderos];
  const otros = rooms.filter(rm =>
    !['living', 'comedor', 'cocina', 'pasillo', 'hall', 'dormitorio', 'baño', 'lavadero'].includes(rm.type)
  );

  // Si no hay estructura clara, no reposicionar
  if (social.length === 0 && privados.length === 0) return plan;

  const totalArea = targetM2 || rooms.reduce((s, rm) => s + rm.width * rm.height, 0);

  // ── Ancho total ──
  const servW = r(Math.max(2.2, servicios.length > 0 ? 2.2 : 0));
  const hasPrivate = privados.length > 0;
  const minW = hasPrivate ? privados.length * 3.2 + servW : social.reduce((s, rm) => s + 3, 0);
  const W = r(Math.max(minW, Math.sqrt(totalArea * 1.05)));

  // ── Alturas de filas ──
  const hasPasillo = circ.length > 0;
  const pasilloH = hasPasillo ? 1.4 : 0;
  const totalH = totalArea / W;
  const usableH = totalH - pasilloH;
  const H1 = r(Math.max(3.2, usableH * (hasPrivate ? 0.42 : 0.9)));
  const H3 = hasPrivate ? r(Math.max(3.5, usableH * 0.58)) : 0;

  // ── Fila 1: Social ──
  social.sort((a, b) => {
    const order = { living: 0, comedor: 1, cocina: 2 };
    return (order[a.type] ?? 3) - (order[b.type] ?? 3);
  });
  let sx = 0;
  for (let i = 0; i < social.length; i++) {
    social[i].x = r(sx);
    social[i].y = 0;
    social[i].height = H1;
    if (i === social.length - 1) {
      social[i].width = r(W - sx);
    } else {
      social[i].width = r(W * (i === 0 && social.length > 1 ? 0.65 : 1 / social.length));
    }
    sx = r(sx + social[i].width);
  }

  // ── Fila 2: Pasillo ──
  if (hasPasillo) {
    circ[0].x = 0; circ[0].y = H1;
    circ[0].width = W; circ[0].height = pasilloH;
    // Eliminar pasillos extras
    for (let i = circ.length - 1; i > 0; i--) {
      const idx = rooms.indexOf(circ[i]);
      if (idx > -1) rooms.splice(idx, 1);
    }
  }

  // ── Fila 3: Privada ──
  if (hasPrivate) {
    const privY = r(H1 + pasilloH);
    const actualServW = servicios.length > 0 ? r(Math.max(2.2, W * 0.21)) : 0;
    const dormTotalW = r(W - actualServW);

    // Dormitorios: mayor primero, llenan el ancho
    privados.sort((a, b) => (b.width * b.height) - (a.width * a.height));
    let dx = 0;
    for (let i = 0; i < privados.length; i++) {
      privados[i].y = privY;
      privados[i].height = H3;
      privados[i].x = r(dx);
      if (i === privados.length - 1) {
        privados[i].width = r(dormTotalW - dx);
      } else if (i === 0 && privados.length > 1) {
        privados[i].width = r(dormTotalW * 0.52);
      } else {
        privados[i].width = r((dormTotalW - dx) / (privados.length - i));
      }
      dx = r(dx + privados[i].width);
    }

    // Servicios: apilados en columna derecha
    if (servicios.length > 0) {
      const svcX = r(W - actualServW);
      const banoTotalH = r(H3 * (lavaderos.length > 0 ? 0.58 : 1));
      let sy = privY;

      banos.forEach((rm, i) => {
        rm.x = svcX; rm.y = r(sy);
        rm.width = actualServW;
        rm.height = r(banoTotalH / Math.max(1, banos.length));
        sy = r(sy + rm.height);
      });
      lavaderos.forEach((rm, i) => {
        rm.x = svcX; rm.y = r(sy);
        rm.width = actualServW;
        rm.height = i === lavaderos.length - 1 ? r(privY + H3 - sy) : r((H3 - banoTotalH) / lavaderos.length);
        sy = r(sy + rm.height);
      });
    }
  }

  // ── Otros ambientes: agregar como fila extra ──
  if (otros.length > 0) {
    const extraY = r(H1 + pasilloH + H3);
    let ox = 0;
    otros.forEach((rm, i) => {
      rm.x = r(ox); rm.y = extraY;
      rm.width = i === otros.length - 1 ? r(W - ox) : r(W / otros.length);
      rm.height = r(Math.max(3, rm.height));
      ox = r(ox + rm.width);
    });
  }

  // ── Regenerar puertas y ventanas ──
  const maxY = Math.max(...rooms.map(rm => rm.y + rm.height));
  const privY2 = H1 + pasilloH;
  plan.doors = generarPuertasAuto(rooms, H1, r(privY2));
  plan.windows = generarVentanasAuto(rooms, W, r(maxY));

  return plan;
}

// ═══════════════════════════════════════════════════════════════
// Helpers: puertas, ventanas, escalado
// ═══════════════════════════════════════════════════════════════

function generarPuertasAuto(rooms, socialH, privY) {
  const doors = [];
  const living = rooms.find(rm => rm.type === 'living');
  if (living) {
    doors.push({ x: 0, y: r(living.y + living.height * 0.5), orientation: 'vertical', width: 0.9 });
  }
  rooms.filter(rm => ['living', 'comedor', 'cocina'].includes(rm.type)).forEach(rm => {
    doors.push({ x: r(rm.x + rm.width * 0.4), y: r(rm.y + rm.height), orientation: 'horizontal', width: 0.8 });
  });
  rooms.filter(rm => rm.y >= privY - 0.1 && !['pasillo', 'hall', 'living', 'comedor', 'cocina'].includes(rm.type)).forEach(rm => {
    if (rm.type === 'dormitorio') {
      doors.push({ x: r(rm.x + rm.width * 0.5), y: r(privY), orientation: 'horizontal', width: 0.8 });
    } else if (rm.type === 'baño' && Math.abs(rm.y - privY) < 0.2) {
      doors.push({ x: r(rm.x + rm.width * 0.5), y: r(privY), orientation: 'horizontal', width: 0.7 });
    } else if (rm.type === 'baño' || rm.type === 'lavadero') {
      doors.push({ x: r(rm.x), y: r(rm.y + rm.height * 0.5), orientation: 'vertical', width: 0.7 });
    }
  });
  return doors;
}

function generarVentanasAuto(rooms, maxX, maxY) {
  const windows = [];
  rooms.forEach(rm => {
    if (rm.type === 'pasillo' || rm.type === 'hall') return;
    const isSmall = rm.type === 'baño' || rm.type === 'lavadero';
    if (rm.y < 0.1)
      windows.push({ x: r(rm.x + rm.width / 2), y: 0, orientation: 'horizontal', width: isSmall ? 0.8 : 1.4 });
    if (rm.x < 0.1)
      windows.push({ x: 0, y: r(rm.y + rm.height / 2), orientation: 'vertical', width: isSmall ? 0.6 : 1.2 });
    if (Math.abs(rm.x + rm.width - maxX) < 0.3)
      windows.push({ x: r(maxX), y: r(rm.y + rm.height / 2), orientation: 'vertical', width: isSmall ? 0.6 : 1.2 });
    if (Math.abs(rm.y + rm.height - maxY) < 0.3)
      windows.push({ x: r(rm.x + rm.width / 2), y: r(maxY), orientation: 'horizontal', width: isSmall ? 0.6 : 1.2 });
  });
  return windows;
}

function escalarPlanoExacto(rooms, doors, windows, targetM2) {
  const actual = rooms.reduce((s, rm) => s + rm.width * rm.height, 0);
  if (actual > 0 && Math.abs(actual - targetM2) > targetM2 * 0.02) {
    // If there are user-specified rooms, only scale the auto-generated ones
    const hasUserSpec = rooms.some(rm => rm._userSpec);
    if (hasUserSpec) {
      const userM2 = rooms.filter(rm => rm._userSpec).reduce((s, rm) => s + rm.width * rm.height, 0);
      const autoRooms = rooms.filter(rm => !rm._userSpec);
      const autoM2 = autoRooms.reduce((s, rm) => s + rm.width * rm.height, 0);
      const targetAutoM2 = targetM2 - userM2;
      if (targetAutoM2 > 0 && autoM2 > 0) {
        const sf = Math.sqrt(targetAutoM2 / autoM2);
        if (Math.abs(sf - 1) > 0.02) {
          autoRooms.forEach(rm => {
            rm.width = r(rm.width * sf);
            rm.height = r(rm.height * sf);
          });
        }
      }
      // Reposition everything compactly (re-layout in-place)
      // Just leave positions as-is since generarPlanoLocal already placed them
    } else {
      // No user specs — scale everything uniformly
      const sf = Math.sqrt(targetM2 / actual);
      rooms.forEach(rm => { rm.x = r(rm.x*sf); rm.y = r(rm.y*sf); rm.width = r(rm.width*sf); rm.height = r(rm.height*sf); });
      doors.forEach(d => { d.x = r(d.x*sf); d.y = r(d.y*sf); });
      windows.forEach(w => { w.x = r(w.x*sf); w.y = r(w.y*sf); });
    }
  }
  // Clean up internal flags
  rooms.forEach(rm => { delete rm._userSpec; });
}

// ═══════════════════════════════════════════════════════════════
// Extraer números del mensaje del usuario
// ═══════════════════════════════════════════════════════════════
function parseUserRequest(message) {
  const msg = message.toLowerCase();
  const m2Match = msg.match(/(\d+)\s*m[²2]?(?:\s|$|,|\.|!)/);
  const dormMatch = msg.match(/(\d+)\s*(?:dormitorio|habitacion|cuarto|dorm|pieza)/);
  const banoMatch = msg.match(/(\d+)\s*(?:baño|bano|toilet)/);
  const garageMatch = msg.match(/garage|garaje|cochera/i);

  // ── Detect single-room requests ──
  // "Baño de 3x3", "Cocina de 4x3", "Dormitorio de 4x4", "Living de 5x6"
  // Also: "un baño de 3x3", "quiero presupuestar un baño 3x3", "solo un baño de 3 x 3"
  const singleRoomTypes = {
    'baño': 'baño', 'bano': 'baño', 'toilet': 'baño', 'toilette': 'baño',
    'cocina': 'cocina',
    'dormitorio': 'dormitorio', 'habitacion': 'dormitorio', 'cuarto': 'dormitorio', 'pieza': 'dormitorio',
    'living': 'living', 'sala': 'living', 'estar': 'living',
    'comedor': 'comedor',
    'lavadero': 'lavadero', 'laundry': 'lavadero',
    'garage': 'garage', 'garaje': 'garage', 'cochera': 'garage',
    'oficina': 'oficina', 'estudio': 'oficina', 'escritorio': 'oficina',
    'vestidor': 'vestidor', 'walk-in': 'vestidor', 'walkin': 'vestidor',
    'terraza': 'terraza', 'balcon': 'balcon', 'balcón': 'balcon',
    'quincho': 'quincho', 'parrilla': 'quincho',
    'deposito': 'deposito', 'depósito': 'deposito', 'bodega': 'deposito',
    'local': 'local', 'comercial': 'local',
    'galería': 'galeria', 'galeria': 'galeria',
  };
  
  // Check if user is asking for a single room (not a full house)
  // Patterns: "baño de 3x3", "un baño 3x3", "solo baño de 3x3", "presupuesto baño 3x3"
  let singleRoom = null;
  const singleRoomRegex = /(?:^|solo\s+|un[ao]?\s+|presupuest(?:o|ar)\s+(?:un[ao]?\s+)?|quiero\s+(?:un[ao]?\s+)?|necesito\s+(?:un[ao]?\s+)?|haceme\s+(?:un[ao]?\s+)?)(baño|bano|toilet|toilette|cocina|dormitorio|habitacion|cuarto|pieza|living|sala|estar|comedor|lavadero|laundry|garage|garaje|cochera|oficina|estudio|escritorio|vestidor|walk-in|terraza|balcon|balcón|quincho|parrilla|deposito|depósito|bodega|local|comercial|galería|galeria)\s+(?:de\s+)?(\d+(?:[.,]\d+)?)\s*[x×X]\s*(\d+(?:[.,]\d+)?)/i;
  const singleMatch = singleRoomRegex.exec(message);
  
  if (singleMatch) {
    const roomName = singleMatch[1].toLowerCase();
    const roomType = singleRoomTypes[roomName] || 'otro';
    const w = parseFloat(singleMatch[2].replace(',', '.'));
    const h = parseFloat(singleMatch[3].replace(',', '.'));
    
    // It's a single room if there's NO mention of "casa", "departamento", "vivienda", etc.
    const isFullHouse = /casa|departamento|depto|vivienda|chalet|duplex|ph|propiedad/i.test(msg);
    if (!isFullHouse && !dormMatch && !m2Match) {
      singleRoom = { type: roomType, name: roomName, w, h, m2: w * h };
    }
  }
  
  // Also detect without dimensions: "presupuesto de baño", "quiero un baño"
  if (!singleRoom && !dormMatch && !m2Match) {
    const simpleRoomRegex = /(?:^|solo\s+|un[ao]?\s+|presupuest(?:o|ar)\s+(?:un[ao]?\s+)?|quiero\s+(?:un[ao]?\s+)?|necesito\s+(?:un[ao]?\s+)?|haceme\s+(?:un[ao]?\s+)?)(baño|bano|toilet|toilette|cocina|dormitorio|habitacion|cuarto|pieza|living|sala|estar|comedor|lavadero|garage|garaje|cochera|oficina|estudio|vestidor|terraza|balcon|balcón|quincho|parrilla|deposito|depósito|bodega|local|galería|galeria)(?:\s|$|,|\.|!)/i;
    const simpleMatch = simpleRoomRegex.exec(message);
    if (simpleMatch && !/casa|departamento|depto|vivienda|chalet|duplex|ph|propiedad/i.test(msg)) {
      const roomName = simpleMatch[1].toLowerCase();
      const roomType = singleRoomTypes[roomName] || 'otro';
      // Default dimensions by type
      const defaults = {
        'baño': { w: 2.5, h: 3 }, 'cocina': { w: 3.5, h: 3.5 }, 'dormitorio': { w: 4, h: 4 },
        'living': { w: 5, h: 5 }, 'comedor': { w: 4, h: 4 }, 'lavadero': { w: 2, h: 2.5 },
        'garage': { w: 3.5, h: 6 }, 'oficina': { w: 3.5, h: 3.5 }, 'vestidor': { w: 2.5, h: 3 },
        'terraza': { w: 4, h: 3 }, 'balcon': { w: 3, h: 1.5 }, 'quincho': { w: 5, h: 4 },
        'deposito': { w: 2, h: 2.5 }, 'local': { w: 6, h: 5 }, 'galeria': { w: 5, h: 2.5 },
      };
      const dim = defaults[roomType] || { w: 3, h: 3 };
      singleRoom = { type: roomType, name: roomName, w: dim.w, h: dim.h, m2: dim.w * dim.h };
    }
  }

  // ── Parse per-room custom dimensions ──
  // Matches patterns like:
  //   "2 dormitorios de 2x3"  →  [{type:'dormitorio', count:2, w:2, h:3}]
  //   "1 dormitorio de 3x3"   →  [{type:'dormitorio', count:1, w:3, h:3}]
  //   "1 baño de 2x2.5"       →  [{type:'baño', count:1, w:2, h:2.5}]
  //   "cocina de 3x4"         →  [{type:'cocina', count:1, w:3, h:4}]
  //   "living de 5x6"         →  [{type:'living', count:1, w:5, h:6}]
  const roomSpecs = [];
  const specRegex = /(\d+)\s*(?:dormitorio|habitacion|cuarto|dorm|pieza|baño|bano|cocina|living|comedor|lavadero|garage|garaje|oficina|vestidor)s?\s+de\s+(\d+(?:[.,]\d+)?)\s*[x×X]\s*(\d+(?:[.,]\d+)?)/gi;
  let specMatch;
  while ((specMatch = specRegex.exec(message)) !== null) {
    const count = parseInt(specMatch[1]);
    const w = parseFloat(specMatch[2].replace(',', '.'));
    const h = parseFloat(specMatch[3].replace(',', '.'));
    // Determine room type from the matched text
    const roomText = specMatch[0].toLowerCase();
    let type = 'otro';
    if (/dormitorio|habitacion|cuarto|dorm|pieza/.test(roomText)) type = 'dormitorio';
    else if (/baño|bano/.test(roomText)) type = 'baño';
    else if (/cocina/.test(roomText)) type = 'cocina';
    else if (/living/.test(roomText)) type = 'living';
    else if (/comedor/.test(roomText)) type = 'comedor';
    else if (/lavadero/.test(roomText)) type = 'lavadero';
    else if (/garage|garaje/.test(roomText)) type = 'garage';
    else if (/oficina/.test(roomText)) type = 'oficina';
    else if (/vestidor/.test(roomText)) type = 'vestidor';
    roomSpecs.push({ type, count, w, h });
  }

  // Also match single rooms without count prefix: "cocina de 3x4", "living de 5x6"
  const singleSpecRegex = /(?:^|[,.]\s*|y\s+)(?:un[ao]?\s+)?(dormitorio|habitacion|cuarto|dorm|pieza|baño|bano|cocina|living|comedor|lavadero|garage|garaje|oficina|vestidor)\s+de\s+(\d+(?:[.,]\d+)?)\s*[x×X]\s*(\d+(?:[.,]\d+)?)/gi;
  while ((specMatch = singleSpecRegex.exec(message)) !== null) {
    const typeText = specMatch[1].toLowerCase();
    const w = parseFloat(specMatch[2].replace(',', '.'));
    const h = parseFloat(specMatch[3].replace(',', '.'));
    let type = 'otro';
    if (/dormitorio|habitacion|cuarto|dorm|pieza/.test(typeText)) type = 'dormitorio';
    else if (/baño|bano/.test(typeText)) type = 'baño';
    else if (/cocina/.test(typeText)) type = 'cocina';
    else if (/living/.test(typeText)) type = 'living';
    else if (/comedor/.test(typeText)) type = 'comedor';
    else if (/lavadero/.test(typeText)) type = 'lavadero';
    else if (/garage|garaje/.test(typeText)) type = 'garage';
    else if (/oficina/.test(typeText)) type = 'oficina';
    else if (/vestidor/.test(typeText)) type = 'vestidor';
    // Avoid duplicates with the previous regex
    const alreadyParsed = roomSpecs.some(s => s.type === type && s.w === w && s.h === h);
    if (!alreadyParsed) {
      roomSpecs.push({ type, count: 1, w, h });
    }
  }

  return {
    m2: m2Match ? parseInt(m2Match[1]) : null,
    dormitorios: dormMatch ? parseInt(dormMatch[1]) : null,
    banos: banoMatch ? parseInt(banoMatch[1]) : null,
    tieneGarage: !!garageMatch,
    roomSpecs: roomSpecs.length > 0 ? roomSpecs : null,
    singleRoom,
  };
}

// ═══════════════════════════════════════════════════════════════
// VALIDACIÓN POST-IA: verificar y corregir el plano generado
// ═══════════════════════════════════════════════════════════════
function validarYCorregirPlano(plan, targetM2, targetDorm, targetBanos) {
  if (!plan || !plan.rooms || plan.rooms.length === 0) return null;

  const issues = [];

  // 1. Verificar superficie total
  let totalM2 = plan.rooms.reduce((s, rm) => s + rm.width * rm.height, 0);
  const diffPct = targetM2 ? Math.abs(totalM2 - targetM2) / targetM2 : 0;

  if (targetM2 && diffPct > 0.08) {
    issues.push(`Superficie ${r(totalM2)}m² vs ${targetM2}m² pedidos (diferencia ${r(diffPct * 100)}%)`);
  }

  // 2. Verificar que haya cocina
  const tieneCocina = plan.rooms.some(rm => rm.type === 'cocina');
  if (!tieneCocina) {
    issues.push('Falta cocina');
  }

  // 3. Verificar cantidad de dormitorios
  if (targetDorm) {
    const dormCount = plan.rooms.filter(rm => rm.type === 'dormitorio').length;
    if (dormCount < targetDorm) {
      issues.push(`Solo ${dormCount} dormitorios vs ${targetDorm} pedidos`);
    }
  }

  // 4. Verificar cantidad de baños
  if (targetBanos) {
    const banoCount = plan.rooms.filter(rm => rm.type === 'baño').length;
    if (banoCount < targetBanos) {
      issues.push(`Solo ${banoCount} baño(s) vs ${targetBanos} pedidos`);
    }
  }

  // 5. Verificar dimensiones mínimas
  plan.rooms.forEach(rm => {
    const prop = PROPORCIONES[rm.type];
    if (prop) {
      if (rm.width < prop.minW * 0.8 || rm.height < prop.minH * 0.8) {
        issues.push(`${rm.name} muy chico (${rm.width}×${rm.height}m, mín ${prop.minW}×${prop.minH}m)`);
      }
    }
  });

  // 6. Verificar superposiciones
  for (let i = 0; i < plan.rooms.length; i++) {
    for (let j = i + 1; j < plan.rooms.length; j++) {
      const a = plan.rooms[i];
      const b = plan.rooms[j];
      const overlapX = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
      const overlapY = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
      if (overlapX > 0.1 && overlapY > 0.1) {
        issues.push(`Superposición: ${a.name} y ${b.name}`);
      }
    }
  }

  // SIEMPRE escalar si la diferencia es >5% del target
  if (targetM2 && totalM2 > 0) {
    const ratio = targetM2 / totalM2;
    if (Math.abs(ratio - 1) > 0.05) {
      const scaleFactor = Math.sqrt(ratio);
      // Check if any rooms have user-specified dimensions (from _userSpec flag)
      const hasUserSpec = plan.rooms.some(rm => rm._userSpec);
      if (hasUserSpec) {
        // Only scale auto-generated rooms to absorb the difference
        const userM2 = plan.rooms.filter(rm => rm._userSpec).reduce((s, rm) => s + rm.width * rm.height, 0);
        const autoRooms = plan.rooms.filter(rm => !rm._userSpec);
        const autoM2 = autoRooms.reduce((s, rm) => s + rm.width * rm.height, 0);
        const targetAutoM2 = targetM2 - userM2;
        if (targetAutoM2 > 0 && autoM2 > 0) {
          const autoSf = Math.sqrt(targetAutoM2 / autoM2);
          if (Math.abs(autoSf - 1) > 0.02) {
            autoRooms.forEach(rm => {
              rm.width = r(rm.width * autoSf);
              rm.height = r(rm.height * autoSf);
            });
            issues.push(`Ambientes auto-generados escalados para ajustar a ${targetM2}m² (ambientes del usuario preservados)`);
          }
        }
      } else {
        plan.rooms = plan.rooms.map(rm => ({
          ...rm,
          x: r(rm.x * scaleFactor),
          y: r(rm.y * scaleFactor),
          width: r(rm.width * scaleFactor),
          height: r(rm.height * scaleFactor),
        }));
        plan.doors = (plan.doors || []).map(d => ({
          ...d,
          x: r(d.x * scaleFactor),
          y: r(d.y * scaleFactor),
        }));
        plan.windows = (plan.windows || []).map(w => ({
          ...w,
          x: r(w.x * scaleFactor),
          y: r(w.y * scaleFactor),
        }));
        issues.push(`Plano escalado ${r(scaleFactor * 100)}% para ajustar a ${targetM2}m²`);
      }
    }
  }

  // Recalcular después de escalar
  totalM2 = plan.rooms.reduce((s, rm) => s + rm.width * rm.height, 0);
  return { plan, issues, totalM2 };
}

// ═══════════════════════════════════════════════════════════════
// GENERADOR DE AMBIENTE INDIVIDUAL — Para presupuestos por ambiente
// ═══════════════════════════════════════════════════════════════

function generarPlanoAmbienteIndividual(singleRoom) {
  const { type, w, h } = singleRoom;
  const m2 = r(w * h);
  
  // Capitalize room name
  const typeNames = {
    'baño': 'Baño', 'cocina': 'Cocina', 'dormitorio': 'Dormitorio', 'living': 'Living',
    'comedor': 'Comedor', 'lavadero': 'Lavadero', 'garage': 'Garage', 'oficina': 'Oficina',
    'vestidor': 'Vestidor', 'terraza': 'Terraza', 'balcon': 'Balcón', 'quincho': 'Quincho',
    'deposito': 'Depósito', 'local': 'Local Comercial', 'galeria': 'Galería',
  };
  
  const room = {
    id: `${type}_1`,
    name: typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1),
    type: type,
    x: 0,
    y: 0,
    width: w,
    height: h,
  };
  
  // Simple doors and windows for the single room
  const doors = [
    { x: r(w * 0.4), y: h, orientation: 'horizontal', width: type === 'garage' ? 2.4 : 0.8 }
  ];
  
  const windows = [];
  if (type !== 'deposito' && type !== 'lavadero') {
    windows.push({ x: r(w / 2), y: 0, orientation: 'horizontal', width: type === 'baño' ? 0.6 : 1.2 });
  }
  if (w >= 3.5) {
    windows.push({ x: w, y: r(h / 2), orientation: 'vertical', width: type === 'baño' ? 0.6 : 1.2 });
  }
  
  return {
    rooms: [room],
    doors,
    windows,
    singleRoomMode: true,
    singleRoomType: type,
  };
}

function generarResumenAmbienteIndividual(plan, singleRoom) {
  const room = plan.rooms[0];
  const m2 = r(room.width * room.height);
  const perimeter = r(2 * (room.width + room.height));
  
  const typeDescriptions = {
    'baño': '🚿 **Baño**',
    'cocina': '🍳 **Cocina**',
    'dormitorio': '🛏️ **Dormitorio**',
    'living': '🛋️ **Living**',
    'comedor': '🍽️ **Comedor**',
    'lavadero': '🧺 **Lavadero**',
    'garage': '🚗 **Garage**',
    'oficina': '💼 **Oficina**',
    'vestidor': '👔 **Vestidor**',
    'terraza': '☀️ **Terraza**',
    'balcon': '🌇 **Balcón**',
    'quincho': '🔥 **Quincho**',
    'deposito': '📦 **Depósito**',
    'local': '🏪 **Local Comercial**',
    'galeria': '🏛️ **Galería**',
  };
  
  let msg = `¡Listo! Acá tenés el plano de tu ambiente 🏗️\n\n`;
  msg += `### ${typeDescriptions[singleRoom.type] || '🏠 **Ambiente**'}\n\n`;
  msg += `| Dato | Valor |\n`;
  msg += `|---|---|\n`;
  msg += `| Dimensiones | ${room.width} × ${room.height} m |\n`;
  msg += `| Superficie | ${m2} m² |\n`;
  msg += `| Perímetro | ${perimeter} m |\n`;
  msg += `| Superficie paredes | ${r(perimeter * 2.7)} m² (h=2.7m) |\n\n`;
  msg += `📊 **Hacé clic en "Presupuesto"** para ver el detalle completo de materiales con todas las opciones y terminaciones para este ambiente.\n\n`;
  msg += `💡 *Podés cambiar las dimensiones, pedir otro ambiente, o pedir una casa completa.*`;
  
  return msg;
}

// ═══════════════════════════════════════════════════════════════
// ENDPOINT PRINCIPAL
// ═══════════════════════════════════════════════════════════════

export async function POST(req) {
  try {
    const { message, currentPlan, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    // Extraer datos numéricos del pedido
    const parsed = parseUserRequest(message);

    // ── MODO AMBIENTE INDIVIDUAL ──
    // Si el usuario pide un solo ambiente (ej: "Baño de 3x3"), generar solo eso
    if (parsed.singleRoom && !currentPlan) {
      const singlePlan = generarPlanoAmbienteIndividual(parsed.singleRoom);
      const reply = generarResumenAmbienteIndividual(singlePlan, parsed.singleRoom);
      return NextResponse.json({ plan: singlePlan, reply });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    if (history.length > 0) {
      messages.push(...history.slice(-6));
    }

    // Build user message con datos explícitos para ayudar a la IA
    let userContent = message;
    if (parsed.m2) {
      userContent += `\n\n⚠️ RECORDATORIO: La superficie TOTAL pedida es ${parsed.m2}m². La suma de TODOS los ambientes debe dar ~${parsed.m2}m². NO hagas un plano de ${Math.round(parsed.m2 * 0.5)}m². Incluí SIEMPRE cocina, pasillo y lavadero aunque el usuario no los mencione.`;
    }
    if (parsed.roomSpecs && parsed.roomSpecs.length > 0) {
      const specLines = parsed.roomSpecs.map(s =>
        `  - ${s.count} ${s.type}(s) de ${s.w}×${s.h}m = ${r(s.count * s.w * s.h)}m²`
      ).join('\n');
      const specTotal = parsed.roomSpecs.reduce((s, sp) => s + sp.count * sp.w * sp.h, 0);
      userContent += `\n\n⚠️ DIMENSIONES ESPECÍFICAS DEL USUARIO (RESPETAR EXACTAMENTE):\n${specLines}\n  Subtotal especificado: ${r(specTotal)}m²\n  Restante para otros ambientes: ${parsed.m2 ? r(parsed.m2 - specTotal) : '?'}m²\n  USAR EXACTAMENTE width=${parsed.roomSpecs[0].w} height=${parsed.roomSpecs[0].h} para los ambientes indicados. NO cambiar estas medidas.`;
    }
    if (currentPlan) {
      userContent = `PLANO ACTUAL (${currentPlan.rooms?.length || 0} ambientes, ${r(currentPlan.rooms?.reduce((s, rm) => s + rm.width * rm.height, 0) || 0)}m²):\n${JSON.stringify(currentPlan, null, 2)}\n\nPEDIDO DEL USUARIO: ${userContent}`;
    }

    messages.push({ role: 'user', content: userContent });

    // Llamar a la IA
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.4, // Más determinístico para planos
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content;
    let aiResult;
    try {
      aiResult = JSON.parse(raw);
    } catch {
      const match = raw?.match(/\{[\s\S]*\}/);
      if (match) aiResult = JSON.parse(match[0]);
      else aiResult = null;
    }

    // Si la IA devolvió un plano, validarlo
    if (aiResult?.plan?.rooms?.length > 0) {
      // Limpiar datos
      aiResult.plan.rooms = aiResult.plan.rooms.map((room, i) => ({
        id: room.id || `room_${i}`,
        name: room.name || `Ambiente ${i + 1}`,
        type: room.type || 'otro',
        x: r(Number(room.x) || 0),
        y: r(Number(room.y) || 0),
        width: r(Math.max(1.2, Number(room.width) || 3)),
        height: r(Math.max(1.2, Number(room.height) || 3)),
      }));
      aiResult.plan.doors = (aiResult.plan.doors || []).map(d => ({
        x: r(Number(d.x) || 0),
        y: r(Number(d.y) || 0),
        orientation: d.orientation || 'horizontal',
        width: r(Number(d.width) || 0.9),
      }));
      aiResult.plan.windows = (aiResult.plan.windows || []).map(w => ({
        x: r(Number(w.x) || 0),
        y: r(Number(w.y) || 0),
        orientation: w.orientation || 'vertical',
        width: r(Number(w.width) || 1.2),
      }));

      // Reposicionar ambientes en grilla compacta (eliminar huecos)
      reposicionarPlano(aiResult.plan, parsed.m2);

      // Validar
      const validation = validarYCorregirPlano(
        aiResult.plan,
        parsed.m2,
        parsed.dormitorios,
        parsed.banos
      );

      if (validation) {
        const correctedM2 = validation.totalM2;
        const hasCriticalIssues = validation.issues.some(i =>
          i.includes('Falta cocina') ||
          i.includes('Solo 0') ||
          (parsed.m2 && i.includes('diferencia') && parseFloat(i.match(/(\d+\.?\d*)%/)?.[1] || 0) > 35)
        );

        // Si tiene problemas críticos Y tenemos datos para generar localmente → usar fallback
        if (hasCriticalIssues && parsed.m2 && parsed.dormitorios) {
          console.log('[RAGO] IA generó plano con problemas críticos, usando fallback local:', validation.issues);
          const localPlan = generarPlanoLocal(
            parsed.m2,
            parsed.dormitorios,
            parsed.banos || 1,
            parsed.roomSpecs,
          );
          const localM2 = localPlan.rooms.reduce((s, rm) => s + rm.width * rm.height, 0);

          return NextResponse.json({
            plan: localPlan,
            reply: generarResumenPlano(localPlan, parsed.m2, aiResult.reply),
          });
        }

        // Plano de IA aceptable (con correcciones de escala aplicadas)
        // SIEMPRE usar nuestra tabla de resumen (no la de la IA que puede mentir sobre m²)
        return NextResponse.json({
          plan: validation.plan,
          reply: generarResumenPlano(validation.plan, parsed.m2),
        });
      }
    }

    // Si la IA no generó plano (pregunta general) o plan=null
    if (aiResult && !aiResult.plan) {
      return NextResponse.json({
        plan: null,
        reply: aiResult.reply || 'No entendí tu pedido. ¿Podés describir el espacio que querés?',
      });
    }

    // Si todo falló y tenemos datos → fallback local
    if (parsed.m2 && parsed.dormitorios) {
      const localPlan = generarPlanoLocal(parsed.m2, parsed.dormitorios, parsed.banos || 1, parsed.roomSpecs);
      return NextResponse.json({
        plan: localPlan,
        reply: generarResumenPlano(localPlan, parsed.m2),
      });
    }

    return NextResponse.json({
      plan: null,
      reply: aiResult?.reply || 'Contame más detalles: ¿cuántos m², cuántos dormitorios y baños necesitás? 🏗️',
    });
  } catch (error) {
    console.error('[RAGO Design API Error]:', error);

    // Último fallback: intentar generar localmente
    try {
      const { message } = await req.clone().json();
      const parsed = parseUserRequest(message);
      if (parsed.m2 && parsed.dormitorios) {
        const localPlan = generarPlanoLocal(parsed.m2, parsed.dormitorios, parsed.banos || 1, parsed.roomSpecs);
        return NextResponse.json({
          plan: localPlan,
          reply: generarResumenPlano(localPlan, parsed.m2) + '\n\n⚠️ *Generado localmente (sin IA)*',
        });
      }
    } catch { /* ignore */ }

    return NextResponse.json({
      plan: null,
      reply: 'Hubo un error al generar el diseño. Verificá que la API key de OpenAI esté configurada. ¿Querés intentar de nuevo?',
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// Generar texto resumen del plano
// ═══════════════════════════════════════════════════════════════
function generarResumenPlano(plan, targetM2, iaReply = '') {
  const rooms = plan.rooms || [];
  const totalM2 = rooms.reduce((s, rm) => s + rm.width * rm.height, 0);

  // NO incluir la reply de la IA si tiene tablas falsas (m² inventados)
  // Solo usar nuestra tabla con datos REALES del plano corregido
  let msg = '¡Listo! Acá está tu plano 🏗️\n\n';
  msg += '### 📐 Resumen del diseño\n\n';
  msg += '| Ambiente | Dimensiones | Superficie |\n';
  msg += '|---|---|---|\n';
  rooms.forEach(rm => {
    msg += `| ${rm.name} | ${rm.width}×${rm.height}m | ${r(rm.width * rm.height)}m² |\n`;
  });
  msg += `\n**🏠 Total cubierto: ${r(totalM2)}m²**`;
  if (targetM2) {
    const diffPct = Math.abs(totalM2 - targetM2) / targetM2 * 100;
    if (diffPct < 8) msg += ` ✅`;
    else msg += ` (pedido: ${targetM2}m²) ⚠️`;
  }
  msg += '\n\n💡 *Podés pedirme que modifique cualquier ambiente, agregue garage, cambie dimensiones, etc.*';
  msg += '\n\n🎨 **Tip:** Usá la pestaña **"Render IA"** para generar visualizaciones fotorrealistas de tu diseño con distintos estilos arquitectónicos.';
  return msg;
}
