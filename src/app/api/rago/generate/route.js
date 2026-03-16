import { NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════
// BASE DE DATOS DE MATERIALES — Precios ARS (Feb 2026 aprox.)
// ═══════════════════════════════════════════════════════════════

const MATERIALS = {
  // ─── LADRILLOS ───
  ladrillo_comun: { name: 'Ladrillo común', unit: 'u', price: 120, category: 'Mampostería' },
  ladrillo_hueco_8: { name: 'Ladrillo hueco 8cm', unit: 'u', price: 95, category: 'Mampostería' },
  ladrillo_hueco_12: { name: 'Ladrillo hueco 12cm', unit: 'u', price: 130, category: 'Mampostería' },
  ladrillo_hueco_18: { name: 'Ladrillo hueco 18cm', unit: 'u', price: 180, category: 'Mampostería' },

  // ─── CEMENTO Y CAL ───
  cemento: { name: 'Cemento Portland (50kg)', unit: 'bolsa', price: 12500, category: 'Aglomerantes' },
  cal: { name: 'Cal hidráulica (25kg)', unit: 'bolsa', price: 5800, category: 'Aglomerantes' },
  arena_gruesa: { name: 'Arena gruesa', unit: 'm³', price: 28000, category: 'Áridos' },
  arena_fina: { name: 'Arena fina', unit: 'm³', price: 32000, category: 'Áridos' },
  piedra_partida: { name: 'Piedra partida', unit: 'm³', price: 35000, category: 'Áridos' },

  // ─── HIERRO ───
  hierro_8mm: { name: 'Hierro Ø8mm (barra 12m)', unit: 'barra', price: 8500, category: 'Hierro' },
  hierro_10mm: { name: 'Hierro Ø10mm (barra 12m)', unit: 'barra', price: 13500, category: 'Hierro' },
  hierro_12mm: { name: 'Hierro Ø12mm (barra 12m)', unit: 'barra', price: 19500, category: 'Hierro' },
  malla_sima: { name: 'Malla SIMA 15x15 Ø4.2', unit: 'paño', price: 22000, category: 'Hierro' },
  alambre_negro: { name: 'Alambre negro Nº17', unit: 'kg', price: 3200, category: 'Hierro' },

  // ─── PISOS Y REVESTIMIENTOS ───
  ceramico_piso: { name: 'Cerámico piso 45x45', unit: 'm²', price: 9500, category: 'Pisos' },
  porcelanato: { name: 'Porcelanato 60x60', unit: 'm²', price: 18000, category: 'Pisos' },
  porcelanato_premium: { name: 'Porcelanato rectificado 80x80', unit: 'm²', price: 32000, category: 'Pisos' },
  ceramico_pared: { name: 'Cerámico pared 30x45', unit: 'm²', price: 8500, category: 'Revestimientos' },
  ceramico_pared_premium: { name: 'Revestimiento pared premium', unit: 'm²', price: 16000, category: 'Revestimientos' },
  pastina: { name: 'Pastina (1kg)', unit: 'kg', price: 1800, category: 'Pisos' },
  pegamento: { name: 'Pegamento cerámico (30kg)', unit: 'bolsa', price: 6500, category: 'Pisos' },
  piso_flotante: { name: 'Piso flotante 8mm', unit: 'm²', price: 12000, category: 'Pisos' },
  piso_vinilico: { name: 'Piso vinílico SPC click', unit: 'm²', price: 15000, category: 'Pisos' },
  zocalo_ceramico: { name: 'Zócalo cerámico 8cm', unit: 'ml', price: 2200, category: 'Pisos' },
  zocalo_mdf: { name: 'Zócalo MDF 7cm', unit: 'ml', price: 3500, category: 'Pisos' },

  // ─── ABERTURAS ───
  puerta_interior: { name: 'Puerta interior completa', unit: 'u', price: 185000, category: 'Aberturas' },
  puerta_interior_premium: { name: 'Puerta interior madera maciza', unit: 'u', price: 350000, category: 'Aberturas' },
  puerta_entrada: { name: 'Puerta de entrada', unit: 'u', price: 350000, category: 'Aberturas' },
  puerta_corrediza: { name: 'Puerta corrediza aluminio', unit: 'u', price: 280000, category: 'Aberturas' },
  ventana_060x040: { name: 'Ventana aluminio 60x40 (baño)', unit: 'u', price: 85000, category: 'Aberturas' },
  ventana_120x100: { name: 'Ventana aluminio 120x100', unit: 'u', price: 195000, category: 'Aberturas' },
  ventana_150x120: { name: 'Ventana aluminio 150x120', unit: 'u', price: 275000, category: 'Aberturas' },
  ventana_200x150: { name: 'Ventanal aluminio 200x150', unit: 'u', price: 420000, category: 'Aberturas' },

  // ─── SANITARIOS (BAÑO) ───
  inodoro_estandar: { name: 'Inodoro largo deposito (estándar)', unit: 'u', price: 145000, category: 'Sanitarios' },
  inodoro_premium: { name: 'Inodoro Ferrum de Loza premium', unit: 'u', price: 320000, category: 'Sanitarios' },
  bidet_estandar: { name: 'Bidet 1 agujero (estándar)', unit: 'u', price: 95000, category: 'Sanitarios' },
  bidet_premium: { name: 'Bidet Ferrum de Loza premium', unit: 'u', price: 220000, category: 'Sanitarios' },
  lavatorio_estandar: { name: 'Lavatorio con columna', unit: 'u', price: 75000, category: 'Sanitarios' },
  vanitory_estandar: { name: 'Vanitory 60cm con mesada', unit: 'u', price: 180000, category: 'Sanitarios' },
  vanitory_premium: { name: 'Vanitory 80cm doble cajón', unit: 'u', price: 380000, category: 'Sanitarios' },
  ducha_estandar: { name: 'Set ducha (grifería + flor)', unit: 'u', price: 65000, category: 'Sanitarios' },
  ducha_premium: { name: 'Columna de ducha termost.', unit: 'u', price: 250000, category: 'Sanitarios' },
  banera: { name: 'Bañera acrílica 1.50m', unit: 'u', price: 350000, category: 'Sanitarios' },
  banera_hidromasaje: { name: 'Bañera hidromasaje', unit: 'u', price: 850000, category: 'Sanitarios' },
  mampara_estandar: { name: 'Mampara ducha 1 hoja fija', unit: 'u', price: 180000, category: 'Sanitarios' },
  mampara_premium: { name: 'Mampara ducha corrediza completa', unit: 'u', price: 350000, category: 'Sanitarios' },
  espejo_estandar: { name: 'Espejo biselado 60x80', unit: 'u', price: 35000, category: 'Sanitarios' },
  espejo_led: { name: 'Espejo con iluminación LED', unit: 'u', price: 120000, category: 'Sanitarios' },
  griferia_lavatorio: { name: 'Grifería lavatorio monocomando', unit: 'u', price: 55000, category: 'Sanitarios' },
  griferia_lavatorio_premium: { name: 'Grifería lavatorio FV/Piazza', unit: 'u', price: 145000, category: 'Sanitarios' },
  griferia_bidet: { name: 'Grifería bidet monocomando', unit: 'u', price: 48000, category: 'Sanitarios' },
  accesorios_bano: { name: 'Kit accesorios (toallero,jabonera,portarrollo)', unit: 'kit', price: 45000, category: 'Sanitarios' },
  accesorios_bano_premium: { name: 'Kit accesorios acero inox premium', unit: 'kit', price: 120000, category: 'Sanitarios' },

  // ─── COCINA ───
  mesada_granito: { name: 'Mesada granito gris mara', unit: 'ml', price: 85000, category: 'Cocina' },
  mesada_cuarzo: { name: 'Mesada cuarzo Silestone', unit: 'ml', price: 250000, category: 'Cocina' },
  mesada_marmol: { name: 'Mesada mármol de Carrara', unit: 'ml', price: 180000, category: 'Cocina' },
  bajo_mesada: { name: 'Bajo mesada melamina 1.20m', unit: 'u', price: 280000, category: 'Cocina' },
  bajo_mesada_premium: { name: 'Bajo mesada MDF laqueado 1.20m', unit: 'u', price: 550000, category: 'Cocina' },
  alacena: { name: 'Alacena melamina 1.20m', unit: 'u', price: 180000, category: 'Cocina' },
  alacena_premium: { name: 'Alacena MDF laqueado 1.20m', unit: 'u', price: 380000, category: 'Cocina' },
  pileta_cocina_simple: { name: 'Pileta inox. simple 52x37', unit: 'u', price: 65000, category: 'Cocina' },
  pileta_cocina_doble: { name: 'Pileta inox. doble 84x44', unit: 'u', price: 120000, category: 'Cocina' },
  pileta_cocina_granito: { name: 'Pileta granito sintético', unit: 'u', price: 185000, category: 'Cocina' },
  griferia_cocina: { name: 'Grifería cocina monocomando', unit: 'u', price: 65000, category: 'Cocina' },
  griferia_cocina_premium: { name: 'Grifería cocina extensible FV', unit: 'u', price: 190000, category: 'Cocina' },
  campana_estandar: { name: 'Campana extractora 60cm', unit: 'u', price: 140000, category: 'Cocina' },
  campana_premium: { name: 'Campana isla/empotrada 90cm', unit: 'u', price: 380000, category: 'Cocina' },

  // ─── INSTALACIONES ───
  cano_agua_25: { name: 'Caño agua fría 25mm (x4m)', unit: 'tira', price: 4200, category: 'Instalación sanitaria' },
  cano_agua_caliente: { name: 'Caño agua caliente 20mm (x4m)', unit: 'tira', price: 5500, category: 'Instalación sanitaria' },
  cano_cloaca_110: { name: 'Caño cloaca 110mm (x4m)', unit: 'tira', price: 8500, category: 'Instalación sanitaria' },
  cano_cloaca_63: { name: 'Caño PVC 63mm (x4m)', unit: 'tira', price: 4800, category: 'Instalación sanitaria' },
  llave_paso: { name: 'Llave de paso 25mm', unit: 'u', price: 8500, category: 'Instalación sanitaria' },
  sifon: { name: 'Sifón cromado', unit: 'u', price: 6500, category: 'Instalación sanitaria' },
  pileta_piso: { name: 'Pileta de piso 15x15', unit: 'u', price: 4500, category: 'Instalación sanitaria' },
  cable_2_5: { name: 'Cable 2.5mm² (x100m)', unit: 'rollo', price: 45000, category: 'Instalación eléctrica' },
  cable_4: { name: 'Cable 4mm² (x100m)', unit: 'rollo', price: 65000, category: 'Instalación eléctrica' },
  tablero_electrico: { name: 'Tablero eléctrico completo', unit: 'u', price: 85000, category: 'Instalación eléctrica' },
  punto_luz: { name: 'Punto de luz (caño+caja+cable)', unit: 'u', price: 18000, category: 'Instalación eléctrica' },
  punto_toma: { name: 'Tomacorriente (caja+cable+modulo)', unit: 'u', price: 15000, category: 'Instalación eléctrica' },
  spot_led: { name: 'Spot LED embutido', unit: 'u', price: 8500, category: 'Instalación eléctrica' },
  plafon_led: { name: 'Plafón LED 24W', unit: 'u', price: 18000, category: 'Instalación eléctrica' },
  interruptor: { name: 'Interruptor de luz', unit: 'u', price: 5500, category: 'Instalación eléctrica' },
  cano_gas: { name: 'Caño gas 1/2" (x1m)', unit: 'ml', price: 6500, category: 'Instalación de gas' },
  llave_gas: { name: 'Llave de paso gas 1/2"', unit: 'u', price: 12000, category: 'Instalación de gas' },
  ventilacion_gas: { name: 'Rejilla ventilación 15x15', unit: 'u', price: 3500, category: 'Instalación de gas' },

  // ─── TECHO ───
  vigueta_pretensada: { name: 'Vigueta pretensada (x4m)', unit: 'u', price: 12000, category: 'Techo/Losa' },
  bloque_techo: { name: 'Bloque de techo cerámico', unit: 'u', price: 650, category: 'Techo/Losa' },
  membrana: { name: 'Membrana asfáltica 4mm (x10m²)', unit: 'rollo', price: 42000, category: 'Techo/Losa' },
  chapa_galv: { name: 'Chapa galvanizada acanalada', unit: 'm²', price: 14000, category: 'Techo/Losa' },
  durlock_cielorraso: { name: 'Cielorraso Durlock (placa+perfil)', unit: 'm²', price: 22000, category: 'Techo/Losa' },

  // ─── PINTURA ───
  latex_interior: { name: 'Látex interior (20L)', unit: 'lata', price: 48000, category: 'Pintura' },
  latex_exterior: { name: 'Látex exterior (20L)', unit: 'lata', price: 65000, category: 'Pintura' },
  fijador: { name: 'Fijador sellador (4L)', unit: 'u', price: 15000, category: 'Pintura' },
  impermeabilizante: { name: 'Pintura impermeabilizante 4L', unit: 'u', price: 32000, category: 'Pintura' },

  // ─── DORMITORIO / LIVING ───
  placard_melamina: { name: 'Placard melamina 1.80m frente', unit: 'u', price: 480000, category: 'Amoblamiento' },
  placard_premium: { name: 'Placard MDF laqueado 1.80m+interiores', unit: 'u', price: 950000, category: 'Amoblamiento' },
  cortina_roller: { name: 'Cortina roller screen 1.50m', unit: 'u', price: 75000, category: 'Amoblamiento' },
  cortina_blackout: { name: 'Cortina roller blackout 1.50m', unit: 'u', price: 95000, category: 'Amoblamiento' },

  // ─── GARAGE ───
  porton_levadizo: { name: 'Portón levadizo manual 2.40m', unit: 'u', price: 450000, category: 'Aberturas' },
  porton_automatico: { name: 'Portón seccional automatizado', unit: 'u', price: 850000, category: 'Aberturas' },
  piso_alisado: { name: 'Piso alisado cemento', unit: 'm²', price: 15000, category: 'Pisos' },
};

// ─── Rendimientos por m² de pared (15cm) ───
const WALL_15 = {
  ladrillos: 50,      // por m² de pared
  mezcla_m3: 0.046,
  arena_m3: 0.060,
  cal_kg: 9,
  cemento_kg: 9,
};

// ─── Rendimientos por m² de pared (20cm) ───
const WALL_20 = {
  ladrillos: 62,
  mezcla_m3: 0.057,
  arena_m3: 0.075,
  cal_kg: 11,
  cemento_kg: 11,
};

// ─── Rendimientos por m² de pared (30cm) ───
const WALL_30 = {
  ladrillos: 130,
  mezcla_m3: 0.090,
  arena_m3: 0.110,
  cal_kg: 18,
  cemento_kg: 18,
};

// ─── Rendimientos contrapiso (8cm) por m² ───
const CONTRAPISO = {
  arena_m3: 0.065,
  cemento_kg: 12,
  piedra_m3: 0.050,
};

// ─── Rendimientos carpeta (2cm) por m² ───
const CARPETA = {
  arena_m3: 0.022,
  cemento_kg: 7.5,
};

// ─── Rendimientos revoque grueso por m² ───
const REVOQUE_GRUESO = {
  arena_m3: 0.018,
  cal_kg: 4.5,
  cemento_kg: 3,
};

// ─── Rendimientos revoque fino por m² ───
const REVOQUE_FINO = {
  arena_fina_m3: 0.005,
  cal_kg: 3,
  cemento_kg: 1.5,
};

// ─── Losa / m² ───
const LOSA = {
  viguetas: 3,       // por m²
  bloques: 12,       // por m²
  hierro_8_barras: 0.5,
  hierro_10_barras: 0.3,
  malla_panos: 0.12,
  cemento_kg: 25,
  arena_m3: 0.035,
  piedra_m3: 0.055,
};

// ─── Cimiento corrido / m lineal ───
const CIMIENTO = {
  cemento_kg: 40,
  arena_m3: 0.08,
  piedra_m3: 0.12,
  hierro_12_barras: 0.5,
  hierro_8_barras: 0.8,
};

// Altura estándar de paredes
const WALL_HEIGHT = 2.7;

// ═══════════════════════════════════════════════════════════════
// PRESUPUESTO POR AMBIENTE INDIVIDUAL — Mismo formato que casa completa
// ═══════════════════════════════════════════════════════════════

function generateSingleRoomBudget(plan) {
  const room = plan.rooms[0];
  const roomType = plan.singleRoomType || room.type;
  const m2 = room.width * room.height;
  const perimeter = 2 * (room.width + room.height);
  const wallM2 = perimeter * WALL_HEIGHT;
  const ceilingM2 = m2;

  const materialsList = [];
  let materialTotal = 0;
  let idCounter = 0;

  const addItem = (name, unit, qty, priceUnit, category) => {
    qty = Math.round(qty * 100) / 100;
    if (qty <= 0) return;
    const total = Math.round(qty * priceUnit);
    materialTotal += total;
    materialsList.push({
      id: `room_${idCounter++}`,
      name,
      unit,
      qty,
      priceUnit,
      total,
      category,
    });
  };

  // ─── MAMPOSTERÍA (paredes interiores ladrillo hueco 12) ───
  const ladrillos = Math.ceil(wallM2 * 18);
  addItem('Ladrillo hueco 12cm', 'u', ladrillos, 130, 'Mampostería');
  addItem('Arena gruesa (mampostería)', 'm³', wallM2 * 0.031, 28000, 'Mampostería');
  addItem('Cal (mampostería)', 'bolsa 25kg', Math.ceil(wallM2 * 3.6 / 25), 5800, 'Mampostería');
  addItem('Cemento (mampostería)', 'bolsa 50kg', Math.ceil(wallM2 * 3.6 / 50), 12500, 'Mampostería');

  // ─── CONTRAPISO ───
  addItem('Arena gruesa (contrapiso)', 'm³', m2 * CONTRAPISO.arena_m3, 28000, 'Contrapiso');
  addItem('Cemento (contrapiso)', 'bolsa 50kg', Math.ceil(m2 * CONTRAPISO.cemento_kg / 50), 12500, 'Contrapiso');
  addItem('Piedra partida (contrapiso)', 'm³', m2 * CONTRAPISO.piedra_m3, 35000, 'Contrapiso');

  // ─── CARPETA NIVELADORA ───
  addItem('Arena fina (carpeta)', 'm³', m2 * CARPETA.arena_m3, 32000, 'Carpeta niveladora');
  addItem('Cemento (carpeta)', 'bolsa 50kg', Math.ceil(m2 * CARPETA.cemento_kg / 50), 12500, 'Carpeta niveladora');

  // ─── REVOQUE GRUESO ───
  addItem('Arena gruesa (revoque grueso)', 'm³', wallM2 * REVOQUE_GRUESO.arena_m3, 28000, 'Revoque grueso');
  addItem('Cal (revoque grueso)', 'bolsa 25kg', Math.ceil(wallM2 * REVOQUE_GRUESO.cal_kg / 25), 5800, 'Revoque grueso');
  addItem('Cemento (revoque grueso)', 'bolsa 50kg', Math.ceil(wallM2 * REVOQUE_GRUESO.cemento_kg / 50), 12500, 'Revoque grueso');

  // ─── REVOQUE FINO ───
  addItem('Arena fina (revoque fino)', 'm³', wallM2 * REVOQUE_FINO.arena_fina_m3, 32000, 'Revoque fino');
  addItem('Cal (revoque fino)', 'bolsa 25kg', Math.ceil(wallM2 * REVOQUE_FINO.cal_kg / 25), 5800, 'Revoque fino');
  addItem('Cemento (revoque fino)', 'bolsa 50kg', Math.ceil(wallM2 * REVOQUE_FINO.cemento_kg / 50), 12500, 'Revoque fino');

  // ─── PISOS Y REVESTIMIENTOS (según tipo de ambiente) ───
  if (roomType === 'baño') {
    addItem('Porcelanato 60x60 piso', 'm²', m2 * 1.05, 18000, 'Pisos y revestimientos');
    addItem('Revestimiento cerámico pared 30x45', 'm²', wallM2 * 1.05, 8500, 'Pisos y revestimientos');
    addItem('Pegamento cerámico (30kg)', 'bolsa', Math.ceil((m2 + wallM2) * 1.05 / 5), 6500, 'Pisos y revestimientos');
    addItem('Pastina', 'kg', (m2 + wallM2) * 0.5, 1800, 'Pisos y revestimientos');
  } else if (roomType === 'cocina') {
    const mesadaLineal = Math.max(1.2, room.width * 0.7);
    const salpicaderoM2 = mesadaLineal * 0.6;
    addItem('Porcelanato 60x60 piso', 'm²', m2 * 1.05, 18000, 'Pisos y revestimientos');
    addItem('Cerámico pared 30x45 (salpicadero)', 'm²', salpicaderoM2 * 1.1, 8500, 'Pisos y revestimientos');
    addItem('Pegamento cerámico (30kg)', 'bolsa', Math.ceil((m2 + salpicaderoM2) / 5), 6500, 'Pisos y revestimientos');
    addItem('Pastina', 'kg', (m2 + salpicaderoM2) * 0.5, 1800, 'Pisos y revestimientos');
  } else if (roomType === 'garage') {
    addItem('Piso alisado cemento', 'm²', m2, 15000, 'Pisos y revestimientos');
  } else {
    addItem('Cerámico piso 45x45', 'm²', m2 * 1.05, 9500, 'Pisos y revestimientos');
    addItem('Pegamento cerámico (30kg)', 'bolsa', Math.ceil(m2 / 5), 6500, 'Pisos y revestimientos');
    addItem('Pastina', 'kg', m2 * 0.5, 1800, 'Pisos y revestimientos');
    addItem('Zócalo cerámico 8cm', 'ml', perimeter, 2200, 'Pisos y revestimientos');
  }

  // ─── SANITARIOS (baño) ───
  if (roomType === 'baño') {
    addItem('Inodoro largo depósito', 'u', 1, 145000, 'Sanitarios');
    addItem('Bidet 1 agujero', 'u', 1, 95000, 'Sanitarios');
    addItem('Vanitory 60cm con mesada', 'u', 1, 180000, 'Sanitarios');
    addItem('Set ducha (grifería + flor)', 'u', 1, 65000, 'Sanitarios');
    addItem('Mampara 1 hoja fija', 'u', 1, 180000, 'Sanitarios');
    addItem('Grifería lavatorio monocomando', 'u', 1, 55000, 'Griferías');
    addItem('Grifería bidet monocomando', 'u', 1, 48000, 'Griferías');
    addItem('Espejo biselado 60x80', 'u', 1, 35000, 'Accesorios');
    addItem('Kit accesorios (toallero, jabonera, portarrollo)', 'kit', 1, 45000, 'Accesorios');
  }

  // ─── MESADA Y MUEBLES (cocina) ───
  if (roomType === 'cocina') {
    const mesadaLineal = Math.max(1.2, room.width * 0.7);
    addItem('Mesada granito gris mara', 'ml', mesadaLineal, 85000, 'Mesada y muebles');
    addItem('Bajo mesada melamina 1.20m', 'u', Math.ceil(mesadaLineal / 1.2), 280000, 'Mesada y muebles');
    addItem('Alacena melamina 1.20m', 'u', Math.ceil(mesadaLineal / 1.2), 180000, 'Mesada y muebles');
    addItem('Pileta inox. simple 52x37', 'u', 1, 65000, 'Mesada y muebles');
    addItem('Grifería cocina monocomando', 'u', 1, 65000, 'Mesada y muebles');
    addItem('Campana extractora 60cm', 'u', 1, 140000, 'Mesada y muebles');
  }

  // ─── INSTALACIÓN SANITARIA (ambientes húmedos) ───
  if (roomType === 'baño' || roomType === 'cocina' || roomType === 'lavadero') {
    addItem('Caño agua fría 25mm (x4m)', 'tira', roomType === 'baño' ? 4 : 3, 4200, 'Instalación sanitaria');
    addItem('Caño agua caliente 20mm (x4m)', 'tira', roomType === 'baño' ? 4 : 3, 5500, 'Instalación sanitaria');
    addItem('Caño cloaca 110mm (x4m)', 'tira', roomType === 'baño' ? 2 : 1, 8500, 'Instalación sanitaria');
    addItem('Caño PVC 63mm (x4m)', 'tira', roomType === 'baño' ? 2 : 1, 4800, 'Instalación sanitaria');
    addItem('Llave de paso 25mm', 'u', 2, 8500, 'Instalación sanitaria');
    addItem('Sifón cromado', 'u', roomType === 'baño' ? 2 : 1, 6500, 'Instalación sanitaria');
    addItem('Pileta de piso 15x15', 'u', 1, 4500, 'Instalación sanitaria');
    if (roomType === 'cocina') {
      addItem('Caño gas 1/2" (x1m)', 'ml', 4, 6500, 'Instalación sanitaria');
      addItem('Llave de paso gas', 'u', 1, 12000, 'Instalación sanitaria');
      addItem('Rejilla ventilación 15x15', 'u', 2, 3500, 'Instalación sanitaria');
    }
    if (roomType === 'lavadero') {
      addItem('Pileta lavadero', 'u', 1, 55000, 'Instalación sanitaria');
    }
  }

  // ─── INSTALACIÓN ELÉCTRICA ───
  const puntosLuz = roomType === 'baño' ? 1 : roomType === 'cocina' ? 2 : Math.max(1, Math.ceil(m2 / 12));
  const tomas = roomType === 'baño' ? 1 : roomType === 'cocina' ? 4 : Math.max(2, Math.ceil(perimeter / 3));
  addItem('Punto de luz', 'u', puntosLuz, 18000, 'Instalación eléctrica');
  addItem('Plafón LED 24W', 'u', puntosLuz, 18000, 'Instalación eléctrica');
  addItem('Tomacorriente', 'u', tomas, 15000, 'Instalación eléctrica');
  addItem('Interruptor', 'u', 1, 5500, 'Instalación eléctrica');

  // ─── ABERTURAS ───
  addItem('Puerta interior completa', 'u', 1, 185000, 'Aberturas');
  if (roomType === 'baño' || roomType === 'lavadero') {
    addItem('Ventana aluminio 60x40', 'u', 1, 85000, 'Aberturas');
  } else if (roomType === 'garage') {
    addItem('Portón levadizo manual 2.40m', 'u', 1, 450000, 'Aberturas');
  } else {
    addItem('Ventana aluminio 120x100', 'u', 1, 195000, 'Aberturas');
  }

  // ─── PINTURA ───
  const pinturaM2Total = wallM2 + ceilingM2;
  addItem('Fijador sellador (4L)', 'u', Math.ceil(pinturaM2Total / 50), 15000, 'Pintura');
  if (roomType === 'baño') {
    addItem('Pintura impermeabilizante 4L (cielorraso)', 'u', 1, 32000, 'Pintura');
  } else {
    addItem('Látex interior (20L)', 'lata', Math.ceil(pinturaM2Total / 50), 48000, 'Pintura');
  }

  // ─── MOBILIARIO ESPECÍFICO ───
  if (roomType === 'dormitorio') {
    addItem('Placard melamina 1.80m frente', 'u', 1, 480000, 'Mobiliario');
    addItem('Cortina roller screen 1.50m', 'u', 1, 75000, 'Mobiliario');
  }
  if (roomType === 'living' || roomType === 'comedor') {
    addItem('Cortina roller screen 1.50m', 'u', Math.max(1, Math.ceil(room.width / 3)), 75000, 'Mobiliario');
  }

  // Sort by category then by total descending
  materialsList.sort((a, b) => a.category.localeCompare(b.category) || b.total - a.total);

  // ─── Mano de obra (varía por tipo de ambiente) ───
  const manoObraRate = roomType === 'baño' ? 450000 : roomType === 'cocina' ? 400000 : 300000;
  const manoObra = m2 * manoObraRate;

  // ─── Additional costs (terminaciones extras 15%) ───
  const additional = materialTotal * 0.15;

  // ─── Imprevistos (5%) ───
  const imprevistos = (materialTotal + manoObra + additional) * 0.05;

  // ─── Total ───
  const total = materialTotal + manoObra + additional + imprevistos;

  return {
    totalM2: m2,
    total,
    pricePerM2: total / m2,
    materialTotal,
    manoObra,
    additional,
    imprevistos,
    materials: materialsList,
    rooms: [{
      name: room.name,
      type: roomType,
      m2: m2.toFixed(1),
    }],
  };
}

export async function POST(req) {
  try {
    const { plan } = await req.json();

    if (!plan || !plan.rooms || plan.rooms.length === 0) {
      return NextResponse.json({ error: 'Plan requerido' }, { status: 400 });
    }

    // ═══ MODO AMBIENTE INDIVIDUAL ═══
    if (plan.singleRoomMode || plan.rooms.length === 1) {
      const budget = generateSingleRoomBudget(plan);
      return NextResponse.json(budget);
    }

    const { rooms, doors = [], windows = [] } = plan;

    // ═══ Calculate areas ═══
    const totalM2 = rooms.reduce((s, r) => s + r.width * r.height, 0);

    // ═══ Perimeter / wall length (linear meters) ═══
    // For each room, calculate its perimeter
    const totalPerimeter = rooms.reduce((s, r) => s + 2 * (r.width + r.height), 0);
    // Shared walls: estimate ~30% of perimeter is shared
    const sharedFactor = 0.7; // 70% unique walls
    const totalWallLinear = totalPerimeter * sharedFactor;
    const totalWallM2 = totalWallLinear * WALL_HEIGHT;

    // Exterior walls (estimate ~40% of total)
    const extWallM2 = totalWallM2 * 0.4;
    const intWallM2 = totalWallM2 * 0.6;

    // ═══ Materials accumulator ═══
    const mats = {};

    const addMat = (key, qty) => {
      if (!mats[key]) mats[key] = 0;
      mats[key] += qty;
    };

    // ─── 1) CIMIENTOS (linear meters = exterior perimeter) ───
    const cimientoLineal = totalPerimeter * 0.5; // exterior walls only approx
    addMat('cemento', (cimientoLineal * CIMIENTO.cemento_kg) / 50); // bolsas
    addMat('arena_gruesa', cimientoLineal * CIMIENTO.arena_m3);
    addMat('piedra_partida', cimientoLineal * CIMIENTO.piedra_m3);
    addMat('hierro_12mm', cimientoLineal * CIMIENTO.hierro_12_barras);
    addMat('hierro_8mm', cimientoLineal * CIMIENTO.hierro_8_barras);

    // ─── 2) MAMPOSTERÍA ───
    // Exterior walls: 20cm (ladrillo común)
    addMat('ladrillo_comun', extWallM2 * WALL_20.ladrillos);
    addMat('arena_gruesa', extWallM2 * WALL_20.arena_m3);
    addMat('cal', (extWallM2 * WALL_20.cal_kg) / 25);
    addMat('cemento', (extWallM2 * WALL_20.cemento_kg) / 50);

    // Interior walls: 15cm (ladrillo hueco 12)
    addMat('ladrillo_hueco_12', intWallM2 * WALL_15.ladrillos);
    addMat('arena_gruesa', intWallM2 * WALL_15.arena_m3);
    addMat('cal', (intWallM2 * WALL_15.cal_kg) / 25);
    addMat('cemento', (intWallM2 * WALL_15.cemento_kg) / 50);

    // ─── 3) CONTRAPISO ───
    addMat('arena_gruesa', totalM2 * CONTRAPISO.arena_m3);
    addMat('cemento', (totalM2 * CONTRAPISO.cemento_kg) / 50);
    addMat('piedra_partida', totalM2 * CONTRAPISO.piedra_m3);

    // ─── 4) CARPETA ───
    addMat('arena_fina', totalM2 * CARPETA.arena_m3);
    addMat('cemento', (totalM2 * CARPETA.cemento_kg) / 50);

    // ─── 5) REVOQUES ───
    // Grueso en toda la pared
    addMat('arena_gruesa', totalWallM2 * REVOQUE_GRUESO.arena_m3);
    addMat('cal', (totalWallM2 * REVOQUE_GRUESO.cal_kg) / 25);
    addMat('cemento', (totalWallM2 * REVOQUE_GRUESO.cemento_kg) / 50);
    // Fino interior
    addMat('arena_fina', intWallM2 * REVOQUE_FINO.arena_fina_m3);
    addMat('cal', (intWallM2 * REVOQUE_FINO.cal_kg) / 25);
    addMat('cemento', (intWallM2 * REVOQUE_FINO.cemento_kg) / 50);

    // ─── 6) LOSA ───
    addMat('vigueta_pretensada', totalM2 * LOSA.viguetas);
    addMat('bloque_techo', totalM2 * LOSA.bloques);
    addMat('hierro_8mm', totalM2 * LOSA.hierro_8_barras);
    addMat('hierro_10mm', totalM2 * LOSA.hierro_10_barras);
    addMat('malla_sima', totalM2 * LOSA.malla_panos);
    addMat('cemento', (totalM2 * LOSA.cemento_kg) / 50);
    addMat('arena_gruesa', totalM2 * LOSA.arena_m3);
    addMat('piedra_partida', totalM2 * LOSA.piedra_m3);
    addMat('alambre_negro', totalM2 * 0.8);

    // ─── 7) PISOS ───
    const banoM2 = rooms.filter(r => r.type === 'baño').reduce((s, r) => s + r.width * r.height, 0);
    const cocinaM2 = rooms.filter(r => r.type === 'cocina').reduce((s, r) => s + r.width * r.height, 0);
    const otroM2 = totalM2 - banoM2 - cocinaM2;

    addMat('ceramico_piso', otroM2 * 1.05); // 5% waste
    addMat('porcelanato', (banoM2 + cocinaM2) * 1.05);
    addMat('pegamento', totalM2 * 1.05 / 5); // 5m² per bag
    addMat('pastina', totalM2 * 0.5);

    // ─── 8) REVESTIMIENTO cerámico en baños y cocina ───
    const banoWallM2 = rooms.filter(r => r.type === 'baño').reduce((s, r) => s + 2 * (r.width + r.height) * WALL_HEIGHT, 0);
    const cocinaWallM2 = rooms.filter(r => r.type === 'cocina').reduce((s, r) => s + 2 * (r.width + r.height) * 1.5, 0); // half height
    addMat('ceramico_pared', (banoWallM2 + cocinaWallM2) * 1.05);

    // ─── 9) ABERTURAS ───
    const numDoors = Math.max(doors.length, rooms.length); // at least 1 per room
    addMat('puerta_interior', Math.max(0, numDoors - 1));
    addMat('puerta_entrada', 1);

    const numWindows = Math.max(windows.length, Math.ceil(rooms.length * 1.2));
    const bigWindows = Math.ceil(numWindows * 0.4);
    const smallWindows = numWindows - bigWindows;
    addMat('ventana_120x100', smallWindows);
    addMat('ventana_150x120', bigWindows);

    // ─── 10) MEMBRANA ───
    addMat('membrana', Math.ceil(totalM2 / 10));

    // ─── 11) INSTALACIÓN SANITARIA ───
    const wetRooms = rooms.filter(r => r.type === 'baño' || r.type === 'cocina' || r.type === 'lavadero').length;
    addMat('cano_agua_25', Math.max(5, wetRooms * 6));
    addMat('cano_cloaca_110', Math.max(3, wetRooms * 3));

    // ─── 12) INSTALACIÓN ELÉCTRICA ───
    addMat('cable_2_5', Math.ceil(totalM2 / 100) + 1);
    addMat('tablero_electrico', 1);

    // ─── 13) PINTURA ───
    // Interior: every wall m²
    const pinturaIntM2 = totalWallM2 + totalM2; // walls + ceiling
    addMat('latex_interior', Math.ceil(pinturaIntM2 / 50)); // 50m² coverage for 20L
    addMat('latex_exterior', Math.ceil(extWallM2 / 40));
    addMat('fijador', Math.ceil(pinturaIntM2 / 50));

    // ═══ Calculate costs ═══
    const materialsList = [];
    let materialTotal = 0;

    Object.entries(mats).forEach(([key, qty]) => {
      const mat = MATERIALS[key];
      if (!mat || qty <= 0) return;
      const total = qty * mat.price;
      materialTotal += total;
      materialsList.push({
        id: key,
        name: mat.name,
        unit: mat.unit,
        qty: qty,
        priceUnit: mat.price,
        total: total,
        category: mat.category,
      });
    });

    // Sort by category
    materialsList.sort((a, b) => a.category.localeCompare(b.category) || b.total - a.total);

    // ─── Additional costs ───
    const manoObra = totalM2 * 350000; // ~$350k/m² mano de obra
    const additional = materialTotal * 0.15; // 15% terminaciones extras
    const imprevistos = (materialTotal + manoObra + additional) * 0.05;
    const total = materialTotal + manoObra + additional + imprevistos;

    return NextResponse.json({
      totalM2,
      total,
      pricePerM2: total / totalM2,
      materialTotal,
      manoObra,
      additional,
      imprevistos,
      materials: materialsList,
      rooms: rooms.map(r => ({
        name: r.name,
        type: r.type,
        m2: (r.width * r.height).toFixed(1),
      })),
    });
  } catch (error) {
    console.error('[RAGO Generate API Error]:', error);
    return NextResponse.json({ error: 'Error al generar presupuesto' }, { status: 500 });
  }
}
