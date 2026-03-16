// ═══════════════════════════════════════════════════════════════
// BIBLIOTECA DE ESTILOS ARQUITECTÓNICOS Y PRESETS DE RENDER
// Para generación de renders con DALL-E 3
// ═══════════════════════════════════════════════════════════════

// ─── Estilos arquitectónicos ───
export const ARCHITECTURE_STYLES = [
  {
    id: 'moderno',
    label: 'Moderno',
    emoji: '🏢',
    description: 'Líneas rectas, vidrio, hormigón visto',
    promptBase: 'modern contemporary architecture, clean lines, large glass windows, exposed concrete, flat roof, minimalist landscaping',
    color: '#3B82F6',
  },
  {
    id: 'minimalista',
    label: 'Minimalista',
    emoji: '◻️',
    description: 'Formas puras, colores neutros, espacios abiertos',
    promptBase: 'minimalist architecture, pure geometric forms, white walls, neutral tones, open spaces, natural light flooding in, zen garden',
    color: '#6B7280',
  },
  {
    id: 'colonial',
    label: 'Colonial',
    emoji: '🏛️',
    description: 'Estilo argentino clásico, tejas, galerías',
    promptBase: 'Argentine colonial architecture, clay tile roof, covered gallery with columns, white stucco walls, iron railings, courtyard, traditional style',
    color: '#92400E',
  },
  {
    id: 'industrial',
    label: 'Industrial',
    emoji: '🏗️',
    description: 'Acero expuesto, ladrillo visto, techos altos',
    promptBase: 'industrial loft architecture, exposed steel beams, raw brick walls, high ceilings, large industrial windows, polished concrete floors',
    color: '#78716C',
  },
  {
    id: 'nordico',
    label: 'Nórdico',
    emoji: '🌲',
    description: 'Madera clara, naturaleza, calidez escandinava',
    promptBase: 'Scandinavian architecture, light wood cladding, large windows, warm interior lighting, integration with nature, pitched roof, cozy atmosphere',
    color: '#059669',
  },
  {
    id: 'mediterraneo',
    label: 'Mediterráneo',
    emoji: '☀️',
    description: 'Terracota, arcos, ambientes luminosos',
    promptBase: 'Mediterranean architecture, terracotta roof tiles, arched doorways, stucco walls in warm cream, lush courtyard, bougainvillea, natural stone accents',
    color: '#EA580C',
  },
  {
    id: 'rustico',
    label: 'Rústico',
    emoji: '🪵',
    description: 'Piedra, madera, campo argentino',
    promptBase: 'rustic Argentine countryside architecture, natural stone walls, exposed wooden beams, thatched or tile roof, large fireplace, pastoral setting, ranch style',
    color: '#854D0E',
  },
  {
    id: 'brutalista',
    label: 'Brutalista',
    emoji: '🔲',
    description: 'Hormigón masivo, formas geométricas audaces',
    promptBase: 'brutalist architecture, massive raw concrete forms, geometric boldness, monolithic appearance, dramatic shadows, textured concrete surfaces',
    color: '#475569',
  },
  {
    id: 'tropical',
    label: 'Tropical',
    emoji: '🌴',
    description: 'Ventilación natural, jardines integrados',
    promptBase: 'tropical modern architecture, open air design, lush green vegetation, infinity pool, natural ventilation, wooden louvers, palm trees, resort style luxury',
    color: '#16A34A',
  },
  {
    id: 'japones',
    label: 'Japonés',
    emoji: '⛩️',
    description: 'Zen, simplicidad, naturaleza en armonía',
    promptBase: 'Japanese contemporary architecture, zen garden, sliding shoji screens, natural materials, water features, bamboo elements, tatami-inspired proportions, wabi-sabi aesthetic',
    color: '#DC2626',
  },
  {
    id: 'art_deco',
    label: 'Art Déco',
    emoji: '✨',
    description: 'Glamour geométrico, detalles ornamentales',
    promptBase: 'art deco architecture, geometric patterns, luxurious materials, bold symmetry, ornamental metalwork, terrazzo floors, curved corners, glamorous facade',
    color: '#CA8A04',
  },
  {
    id: 'sustentable',
    label: 'Sustentable',
    emoji: '🌿',
    description: 'Eco-friendly, techos verdes, solar',
    promptBase: 'sustainable green architecture, living roof with plants, solar panels integrated, reclaimed wood, large south-facing windows, rainwater collection, passive design, eco-friendly materials',
    color: '#15803D',
  },
];

// ─── Ángulos / vistas de cámara ───
export const CAMERA_VIEWS = [
  {
    id: 'exterior_frontal',
    label: 'Exterior Frontal',
    icon: '🏠',
    prompt: 'front exterior view, eye-level perspective, showing full facade, driveway and entrance visible, landscaped front yard',
  },
  {
    id: 'exterior_angular',
    label: 'Exterior Angular',
    icon: '📐',
    prompt: 'three-quarter exterior view, dramatic angle, showing two sides of the building, heroic perspective',
  },
  {
    id: 'aerea',
    label: 'Vista Aérea',
    icon: '🛩️',
    prompt: 'aerial view, drone shot from 45 degree angle, showing roof and surroundings, bird eye perspective',
  },
  {
    id: 'interior_living',
    label: 'Interior Living',
    icon: '🛋️',
    prompt: 'interior living room wide angle, showing furniture layout and decor, natural light from windows, cozy atmosphere, interior design photography',
  },
  {
    id: 'interior_cocina',
    label: 'Interior Cocina',
    icon: '🍳',
    prompt: 'interior kitchen view, modern appliances, countertop island, pendant lighting, functional and beautiful kitchen design',
  },
  {
    id: 'interior_dormitorio',
    label: 'Interior Dormitorio',
    icon: '🛏️',
    prompt: 'interior master bedroom, elegant bed, soft lighting, window with view, wardrobe, comfortable and luxurious bedroom design',
  },
  {
    id: 'jardin',
    label: 'Jardín / Patio',
    icon: '🌳',
    prompt: 'backyard garden view, outdoor living space, patio area, lush vegetation, exterior lighting at dusk, outdoor furniture',
  },
  {
    id: 'nocturna',
    label: 'Vista Nocturna',
    icon: '🌙',
    prompt: 'dramatic night exterior view, warm interior lighting glowing through windows, landscape lighting, blue hour sky, architectural lighting design',
  },
];

// ─── Calidad / resolución presets ───
export const QUALITY_PRESETS = [
  { id: 'standard', label: 'Estándar', size: '1024x1024', quality: 'standard', description: 'Rápido, ideal para borradores' },
  { id: 'hd', label: 'HD', size: '1792x1024', quality: 'hd', description: 'Alta definición, panorámico' },
  { id: 'hd_vertical', label: 'HD Vertical', size: '1024x1792', quality: 'hd', description: 'Alta definición, formato vertical' },
];

// ─── Materiales de acabado ───
export const FINISHING_MATERIALS = [
  { id: 'hormigon', label: 'Hormigón visto', prompt: 'exposed raw concrete surfaces' },
  { id: 'ladrillo', label: 'Ladrillo visto', prompt: 'exposed red brick walls' },
  { id: 'madera', label: 'Revestimiento madera', prompt: 'warm wood cladding and panels' },
  { id: 'piedra', label: 'Piedra natural', prompt: 'natural stone facade' },
  { id: 'vidrio', label: 'Fachada vidriada', prompt: 'large glass curtain wall facade' },
  { id: 'estuco', label: 'Estuco blanco', prompt: 'smooth white stucco render' },
  { id: 'metal', label: 'Panel metálico', prompt: 'metallic cladding panels, zinc or corten steel' },
  { id: 'mixto', label: 'Mixto moderno', prompt: 'mixed materials: wood, glass and concrete combination' },
];

// ─── Ambientación / entorno ───
export const ENVIRONMENTS = [
  { id: 'suburbano', label: 'Barrio residencial', prompt: 'suburban residential neighborhood, sidewalk, trees' },
  { id: 'campo', label: 'Campo abierto', prompt: 'open countryside, green fields, wide horizon' },
  { id: 'montaña', label: 'Montaña', prompt: 'mountain setting, scenic views, rocky terrain' },
  { id: 'playa', label: 'Playa / Costa', prompt: 'beachfront, ocean view, sandy terrain, coastal' },
  { id: 'bosque', label: 'Bosque', prompt: 'surrounded by tall trees, forest setting, dappled light' },
  { id: 'urbano', label: 'Urbano / Ciudad', prompt: 'urban city lot, tight site, city skyline nearby' },
];

// ═══════════════════════════════════════════════════════════════
// Generador de prompts arquitectónicos
// ═══════════════════════════════════════════════════════════════

/**
 * Construir prompt optimizado para DALL-E 3
 * @param {Object} params
 * @param {Object} params.plan - Floor plan JSON con rooms
 * @param {string} params.styleId - ID del estilo arquitectónico
 * @param {string} params.viewId - ID del ángulo de cámara
 * @param {string[]} params.materialIds - IDs de materiales de acabado
 * @param {string} params.environmentId - ID del entorno
 * @param {string} params.customPrompt - Prompt personalizado adicional
 * @returns {string} Prompt optimizado
 */
export function buildArchitecturePrompt({ plan, styleId, viewId, materialIds = [], environmentId, customPrompt = '' }) {
  const style = ARCHITECTURE_STYLES.find(s => s.id === styleId) || ARCHITECTURE_STYLES[0];
  const view = CAMERA_VIEWS.find(v => v.id === viewId) || CAMERA_VIEWS[0];
  const environment = ENVIRONMENTS.find(e => e.id === environmentId);
  const materials = materialIds
    .map(id => FINISHING_MATERIALS.find(m => m.id === id))
    .filter(Boolean);

  // Describir la casa a partir del plan
  let houseDescription = '';
  if (plan?.rooms?.length) {
    const totalM2 = plan.rooms.reduce((s, r) => s + r.width * r.height, 0);
    const dormCount = plan.rooms.filter(r => r.type === 'dormitorio').length;
    const banoCount = plan.rooms.filter(r => r.type === 'baño').length;
    const hasGarage = plan.rooms.some(r => r.type === 'garage');
    const hasTerrace = plan.rooms.some(r => ['terraza', 'balcon', 'quincho'].includes(r.type));

    houseDescription = `A ${Math.round(totalM2)} square meter single-family house with ${dormCount} bedroom${dormCount > 1 ? 's' : ''}, ${banoCount} bathroom${banoCount > 1 ? 's' : ''}`;
    if (hasGarage) houseDescription += ', attached garage';
    if (hasTerrace) houseDescription += ', outdoor terrace';
    houseDescription += '. ';

    // Rooms detail for interior views
    if (viewId?.startsWith('interior_')) {
      const roomType = viewId.replace('interior_', '');
      const targetRoom = plan.rooms.find(r => r.type === roomType || r.type === 'living');
      if (targetRoom) {
        houseDescription += `Showing the ${targetRoom.name} (${targetRoom.width}x${targetRoom.height}m, ${(targetRoom.width * targetRoom.height).toFixed(0)}m²). `;
      }
    }
  }

  // Construir prompt completo
  const parts = [
    'Professional architectural visualization render',
    houseDescription,
    style.promptBase,
    view.prompt,
  ];

  if (materials.length > 0) {
    parts.push(materials.map(m => m.prompt).join(', '));
  }

  if (environment) {
    parts.push(environment.prompt);
  }

  if (customPrompt.trim()) {
    parts.push(customPrompt.trim());
  }

  // Calidad fotográfica
  parts.push(
    'photorealistic, architectural photography, professional lighting, 8K quality, detailed textures, volumetric lighting, golden hour'
  );

  return parts.filter(Boolean).join(', ');
}

/**
 * Generar prompt de plano técnico / croquis
 */
export function buildBlueprintPrompt({ plan, styleId }) {
  const style = ARCHITECTURE_STYLES.find(s => s.id === styleId) || ARCHITECTURE_STYLES[0];
  const totalM2 = plan?.rooms?.reduce((s, r) => s + r.width * r.height, 0) || 100;
  const dormCount = plan?.rooms?.filter(r => r.type === 'dormitorio').length || 2;

  return `Architectural blueprint technical drawing of a ${Math.round(totalM2)}m² ${style.label.toLowerCase()} style house with ${dormCount} bedrooms. Professional CAD-style floor plan on blue background, white lines, engineering precision, dimensioned rooms, north arrow, scale bar, title block, professional architectural drafting`;
}
