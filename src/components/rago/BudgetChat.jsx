'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Loader2,
  RotateCcw,
  ChevronDown,
  Sparkles,
  Download,
  History,
  ChevronLeft,
  ChevronRight,
  Calculator,
  PanelLeftClose,
  PanelLeftOpen,
  Building2,
  FileText,
  Image as ImageIcon,
  Pencil,
  Blocks,
} from 'lucide-react';
import FloorPlanRenderer from './FloorPlanRenderer';
import FurnishedPlanRenderer from './FurnishedPlanRenderer';

// ═══════════════════════════════════════════════════════════════
// ESPECIFICACIONES DE MAMPOSTERÍA — por m² de pared
// ═══════════════════════════════════════════════════════════════

const MASONRY_SPECS = {
  comun: {
    label: 'Ladrillo Común',
    walls: {
      15: { label: 'Pared de 15 cm', ladrillos: 50, mezcla: 0.046, arena: 0.060, cal: 9, cemento: 9 },
      20: { label: 'Pared de 20 cm', ladrillos: 75, mezcla: 0.2, arena: 0.26, cal: 30, cemento: 30 },
      30: { label: 'Pared de 30 cm', ladrillos: 105, mezcla: 0.3, arena: 0.37, cal: 44, cemento: 44 },
    },
  },
  hueco: {
    label: 'Ladrillo Hueco',
    walls: {
      8:  { label: 'Pared de 8 cm', ladrillos: 18, mezcla: 0.016, arena: 0.021, cal: 2.5, cemento: 2.5 },
      12: { label: 'Pared de 12 cm', ladrillos: 18, mezcla: 0.024, arena: 0.0312, cal: 3.6, cemento: 3.6 },
      18: { label: 'Pared de 18 cm', ladrillos: 18, mezcla: 0.036, arena: 0.046, cal: 5.4, cemento: 5.4 },
    },
  },
  block: {
    label: 'Ladrillo Block',
    walls: {
      12: { label: 'Pared de 12 cm', ladrillos: 12.5, mezcla: 0.24, arena: 0.31, cal: 0, cemento: 4.5 },
      15: { label: 'Pared de 15 cm', ladrillos: 12.5, mezcla: 0.03, arena: 0.04, cal: 0, cemento: 5.5 },
      20: { label: 'Pared de 20 cm', ladrillos: 12.5, mezcla: 0.045, arena: 0.56, cal: 0, cemento: 7 },
    },
  },
};

const WALL_HEIGHT_DEFAULT = 2.7; // metros

// ═══ Precios reales de elamigo.com.ar (actualizados) ═══
const PRECIOS_ELAMIGO = {
  cemento: { precio: 5399.89, peso: 25, nombre: 'Cemento Portland Loma Negra CPC30 x25kg', url: 'https://www.elamigo.com.ar/loma-negra?sc=2' },
  cal:     { precio: 7721.34, peso: 25, nombre: 'Cal Hidratada María Virginia x25kg',      url: 'https://www.elamigo.com.ar/cal-hidratada-maria-virginia-bolsa-grande/p' },
  ladrillos: {
    comun_15: { precio: 360, nombre: 'Ladrillo Común 15cm', url: null },
    comun_20: { precio: 500, nombre: 'Ladrillo Común 20cm', url: null },
    comun_30: { precio: 500, nombre: 'Ladrillo Común 30cm (ref.)', url: null },
    hueco_8:  { precio: 604.33,  nombre: 'Lad. Hueco Cer. Del Norte 8X18X30',  url: 'https://www.elamigo.com.ar/ladrillo-hueco-ceramica-del-norte-8x18x30/p' },
    hueco_12: { precio: 784.96,  nombre: 'Lad. Hueco Cer. Del Norte 12X18X30', url: 'https://www.elamigo.com.ar/ladrillo-hueco-ceramica-del-norte-12x18x30/p' },
    hueco_18: { precio: 1053.80, nombre: 'Lad. Hueco Cer. Del Norte 18X18X30', url: 'https://www.elamigo.com.ar/ladrillo-hueco-ceramica-del-norte-18x18x30/p' },
    block_12: { precio: 2250.13, nombre: 'Bloque Scac Rapilosa 12.5X40X25',    url: 'https://www.elamigo.com.ar/bloque-scac-ceramica-del-norte-12-5x40x25/p' },
    block_15: { precio: 1498.27, nombre: 'Bloque Hormigón 13X19X39 T13',       url: 'https://www.elamigo.com.ar/bloque-de-hormigon-13x19x39-liso-t13/p' },
    block_20: { precio: 1498.27, nombre: 'Bloque Hormigón 13X19X39 T13 (ref.)', url: 'https://www.elamigo.com.ar/bloque-de-hormigon-13x19x39-liso-t13/p' },
  },
};

// Helper para obtener precio de ladrillo según tipo y espesor
const getLadrilloPrice = (brickType, wallSize) => {
  return PRECIOS_ELAMIGO.ladrillos[`${brickType}_${wallSize}`] || { precio: null, nombre: 'N/D', url: null };
};

// ─── Conversation states ───
const PHASE = {
  WELCOME: 'welcome',
  DESIGNING: 'designing',
  RESULT: 'result',
};

const BudgetChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState(PHASE.WELCOME);
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showPlan, setShowPlan] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Floor plan versions
  const [planVersions, setPlanVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(-1);
  const [budgetResult, setBudgetResult] = useState(null);

  // Left panel mode: 'plan' | 'render'
  const [leftPanelMode, setLeftPanelMode] = useState('plan');

  // Masonry calculator
  const [showMasonryCalc, setShowMasonryCalc] = useState(false);
  const [masonryBrickType, setMasonryBrickType] = useState('comun');
  const [masonryWallSize, setMasonryWallSize] = useState(null);
  const [masonryResults, setMasonryResults] = useState(null);

  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const currentPlan = currentVersion >= 0 && planVersions[currentVersion] ? planVersions[currentVersion] : null;

  // ─── Handle interactive plan edits (move/resize/delete rooms) ───
  const handlePlanChange = useCallback((updatedPlan) => {
    if (currentVersion < 0) return;
    setPlanVersions((prev) => {
      const copy = [...prev];
      copy[currentVersion] = updatedPlan;
      return copy;
    });
  }, [currentVersion]);

  // ─── Helpers ───
  const addBotMessage = useCallback((content, options = null, delay = 400) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), role: 'assistant', content, options, timestamp: new Date() },
        ]);
        resolve();
      }, delay);
    });
  }, []);

  const addUserMessage = useCallback((content) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), role: 'user', content, timestamp: new Date() },
    ]);
  }, []);

  const addSystemMessage = useCallback((content) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), role: 'system', content, timestamp: new Date() },
    ]);
  }, []);

  // Scroll
  useEffect(() => {
    const t = setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    return () => clearTimeout(t);
  }, [messages]);

  useEffect(() => {
    const c = chatContainerRef.current;
    if (!c) return;
    const onScroll = () => {
      setShowScrollBtn(c.scrollHeight - c.scrollTop - c.clientHeight > 100);
    };
    c.addEventListener('scroll', onScroll);
    return () => c.removeEventListener('scroll', onScroll);
  }, []);

  // ─── Welcome ───
  useEffect(() => {
    const init = async () => {
      await addBotMessage(
        `¡Hola! 👋 Soy **RAGO**, tu arquitecto IA.\n\nContame cómo querés que sea tu casa, departamento o espacio, y yo voy a **dibujar el plano** al instante.\n\n**🏠 Casa completa:**\n• *"Quiero una casa de 2 dormitorios, 1 baño y living-comedor de 100m²"*\n• *"Un departamento de 1 ambiente con cocina integrada"*\n\n**🔨 Ambiente individual** (presupuesto detallado con opciones):\n• *"Baño de 3x3"*\n• *"Cocina de 4x3"*\n• *"Dormitorio de 4x4"*\n• *"Living de 5x6"*\n\n¡Describilo como quieras y yo me encargo! 🏗️`,
        null,
        500
      );
      setPhase(PHASE.DESIGNING);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Send message ───
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    addUserMessage(text);
    setLoading(true);

    try {
      // Call design API — it generates/modifies the floor plan
      const res = await fetch('/api/rago/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          currentPlan: currentPlan,
          history: messages.slice(-10).map((m) => ({ role: m.role === 'system' ? 'assistant' : m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // If AI returned a plan update
        if (data.plan && data.plan.rooms && data.plan.rooms.length > 0) {
          const newVersions = [...planVersions, data.plan];
          setPlanVersions(newVersions);
          setCurrentVersion(newVersions.length - 1);
          setShowPlan(true);

          addSystemMessage(`📐 Plano actualizado — Versión ${newVersions.length}`);
          await addBotMessage(data.reply, null, 300);
        } else {
          // Just a chat reply, no plan update
          await addBotMessage(data.reply, null, 300);
        }
      } else {
        await addBotMessage(
          'Disculpá, hubo un error generando el diseño. ¿Podés intentar de nuevo? 🙏',
          null,
          300
        );
      }
    } catch {
      await addBotMessage('Error de conexión. Verificá tu internet e intentá de nuevo. 🔌', null, 300);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  // ─── Shared wall detection ───
  // Detects walls shared between adjacent rooms to avoid double-counting in totals.
  // Returns array of { roomA, roomB, sharedLength } for each shared edge.
  const findSharedWalls = useCallback((rooms) => {
    const TOLERANCE = 0.15; // tolerance in metres for edge alignment
    const shared = [];
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const a = rooms[i];
        const b = rooms[j];
        // Check vertical shared wall (A's right == B's left or vice-versa)
        if (Math.abs((a.x + a.width) - b.x) < TOLERANCE) {
          const overlapStart = Math.max(a.y, b.y);
          const overlapEnd = Math.min(a.y + a.height, b.y + b.height);
          if (overlapEnd - overlapStart > TOLERANCE) {
            shared.push({ roomA: a.name, roomB: b.name, sharedLength: overlapEnd - overlapStart });
          }
        } else if (Math.abs((b.x + b.width) - a.x) < TOLERANCE) {
          const overlapStart = Math.max(a.y, b.y);
          const overlapEnd = Math.min(a.y + a.height, b.y + b.height);
          if (overlapEnd - overlapStart > TOLERANCE) {
            shared.push({ roomA: a.name, roomB: b.name, sharedLength: overlapEnd - overlapStart });
          }
        }
        // Check horizontal shared wall (A's bottom == B's top or vice-versa)
        if (Math.abs((a.y + a.height) - b.y) < TOLERANCE) {
          const overlapStart = Math.max(a.x, b.x);
          const overlapEnd = Math.min(a.x + a.width, b.x + b.width);
          if (overlapEnd - overlapStart > TOLERANCE) {
            shared.push({ roomA: a.name, roomB: b.name, sharedLength: overlapEnd - overlapStart });
          }
        } else if (Math.abs((b.y + b.height) - a.y) < TOLERANCE) {
          const overlapStart = Math.max(a.x, b.x);
          const overlapEnd = Math.min(a.x + a.width, b.x + b.width);
          if (overlapEnd - overlapStart > TOLERANCE) {
            shared.push({ roomA: a.name, roomB: b.name, sharedLength: overlapEnd - overlapStart });
          }
        }
      }
    }
    return shared;
  }, []);

  // ─── Masonry calculator ───
  const calculateMasonry = useCallback(() => {
    if (!currentPlan || !currentPlan.rooms || currentPlan.rooms.length === 0) return;
    const spec = MASONRY_SPECS[masonryBrickType];
    const availableSizes = Object.keys(spec.walls).map(Number);
    const size = masonryWallSize && spec.walls[masonryWallSize] ? masonryWallSize : availableSizes[0];
    const wallSpec = spec.walls[size];
    if (!wallSpec) return;

    const ladrilloRef = getLadrilloPrice(masonryBrickType, size);

    // Per-room calculations (full perimeter of each room)
    const roomResults = currentPlan.rooms.map((room) => {
      const perimeter = 2 * (room.width + room.height);
      const wallM2 = perimeter * WALL_HEIGHT_DEFAULT;
      const calKg = wallM2 * wallSpec.cal;
      const cementoKg = wallM2 * wallSpec.cemento;
      const cantLadrillos = Math.ceil(wallM2 * wallSpec.ladrillos);
      const costoLadrillos = ladrilloRef.precio ? cantLadrillos * ladrilloRef.precio : null;
      return {
        name: room.name,
        type: room.type,
        areaM2: (room.width * room.height).toFixed(1),
        wallM2: wallM2.toFixed(1),
        ladrillos: cantLadrillos,
        mezcla: (wallM2 * wallSpec.mezcla).toFixed(3),
        arena: (wallM2 * wallSpec.arena).toFixed(3),
        cal: calKg.toFixed(1),
        calBolsas: Math.ceil(calKg / PRECIOS_ELAMIGO.cal.peso),
        cemento: cementoKg.toFixed(1),
        cementoBolsas: Math.ceil(cementoKg / PRECIOS_ELAMIGO.cemento.peso),
        costoCal: Math.ceil(calKg / PRECIOS_ELAMIGO.cal.peso) * PRECIOS_ELAMIGO.cal.precio,
        costoCemento: Math.ceil(cementoKg / PRECIOS_ELAMIGO.cemento.peso) * PRECIOS_ELAMIGO.cemento.precio,
        costoLadrillos,
      };
    });

    // Detect shared walls between adjacent rooms
    const sharedWalls = findSharedWalls(currentPlan.rooms);
    const totalSharedLength = sharedWalls.reduce((sum, sw) => sum + sw.sharedLength, 0);
    const sharedWallM2 = totalSharedLength * WALL_HEIGHT_DEFAULT;

    // Raw totals (sum of all rooms, has double-counted shared walls)
    const rawTotals = roomResults.reduce(
      (acc, r) => ({
        wallM2: acc.wallM2 + parseFloat(r.wallM2),
        ladrillos: acc.ladrillos + r.ladrillos,
        mezcla: acc.mezcla + parseFloat(r.mezcla),
        arena: acc.arena + parseFloat(r.arena),
        cal: acc.cal + parseFloat(r.cal),
        cemento: acc.cemento + parseFloat(r.cemento),
        costoLadrillos: acc.costoLadrillos + (r.costoLadrillos || 0),
      }),
      { wallM2: 0, ladrillos: 0, mezcla: 0, arena: 0, cal: 0, cemento: 0, costoLadrillos: 0 }
    );

    // Corrected totals: subtract shared wall contributions (each shared wall counted in 2 rooms, remove 1)
    const correctedWallM2 = rawTotals.wallM2 - sharedWallM2;
    const correctedLadrillos = Math.ceil(correctedWallM2 * wallSpec.ladrillos);
    const correctedMezcla = correctedWallM2 * wallSpec.mezcla;
    const correctedArena = correctedWallM2 * wallSpec.arena;
    const correctedCal = correctedWallM2 * wallSpec.cal;
    const correctedCemento = correctedWallM2 * wallSpec.cemento;
    const correctedCostoLadrillos = ladrilloRef.precio ? correctedLadrillos * ladrilloRef.precio : null;

    setMasonryResults({
      brickType: spec.label,
      wallSize: wallSpec.label,
      isBlock: masonryBrickType === 'block',
      ladrilloRef,
      rooms: roomResults,
      sharedWalls,
      sharedWallM2: sharedWallM2.toFixed(1),
      totals: {
        wallM2Raw: rawTotals.wallM2.toFixed(1),
        wallM2: correctedWallM2.toFixed(1),
        sharedWallM2: sharedWallM2.toFixed(1),
        ladrillos: correctedLadrillos,
        mezcla: correctedMezcla.toFixed(3),
        arena: correctedArena.toFixed(3),
        cal: correctedCal.toFixed(1),
        calBolsas: Math.ceil(correctedCal / PRECIOS_ELAMIGO.cal.peso),
        cemento: correctedCemento.toFixed(1),
        cementoBolsas: Math.ceil(correctedCemento / PRECIOS_ELAMIGO.cemento.peso),
        costoCal: Math.ceil(correctedCal / PRECIOS_ELAMIGO.cal.peso) * PRECIOS_ELAMIGO.cal.precio,
        costoCemento: Math.ceil(correctedCemento / PRECIOS_ELAMIGO.cemento.peso) * PRECIOS_ELAMIGO.cemento.precio,
        costoLadrillos: correctedCostoLadrillos,
      },
    });
  }, [currentPlan, masonryBrickType, masonryWallSize, findSharedWalls]);

  // Recalculate on changes
  useEffect(() => {
    if (showMasonryCalc && currentPlan) {
      calculateMasonry();
    }
  }, [showMasonryCalc, masonryBrickType, masonryWallSize, currentPlan, calculateMasonry]);

  // Auto-select first wall size on brick type change
  useEffect(() => {
    const sizes = Object.keys(MASONRY_SPECS[masonryBrickType].walls).map(Number);
    setMasonryWallSize(sizes[0]);
  }, [masonryBrickType]);

  // ─── Generate budget from current plan ───
  const generateBudget = async () => {
    if (!currentPlan) return;
    setLoading(true);
    addUserMessage('💰 Generar presupuesto del diseño actual');
    await addBotMessage('⏳ Calculando presupuesto detallado con materiales...', null, 300);

    try {
      const res = await fetch('/api/rago/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: currentPlan }),
      });

      if (res.ok) {
        const data = await res.json();
        setBudgetResult(data);
        setPhase(PHASE.RESULT);

        // Format budget message
        const fmt = (n) =>
          new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

        // ═══ PRESUPUESTO (formato unificado para casa y ambiente individual) ═══
          let msg = `## 📊 Presupuesto Estimado\n\n`;
          msg += `**Superficie total:** ${data.totalM2?.toFixed(0) || '?'} m²\n`;
          msg += `**Ambientes:** ${currentPlan.rooms.length}\n\n---\n\n`;
          msg += `### 💰 TOTAL ESTIMADO\n# ${fmt(data.total)}\n`;
          msg += `*(${fmt(data.pricePerM2)} / m²)*\n\n---\n\n`;

          if (data.materials && data.materials.length > 0) {
            msg += `### 🧱 Materiales Principales\n\n`;
            const grouped = {};
            data.materials.forEach((m) => {
              const cat = m.category || 'General';
              if (!grouped[cat]) grouped[cat] = [];
              grouped[cat].push(m);
            });
            Object.entries(grouped).forEach(([cat, items]) => {
              msg += `**${cat}:**\n`;
              items.forEach((m) => {
                const q = m.unit === 'm³' ? m.qty.toFixed(2) : Math.ceil(m.qty).toLocaleString('es-AR');
                msg += `• ${m.name}: **${q} ${m.unit}** → ${fmt(m.total)}\n`;
              });
              msg += `\n`;
            });

            msg += `---\n`;
            msg += `**Subtotal Materiales:** ${fmt(data.materialTotal)}\n`;
            msg += `**Mano de Obra:** ${fmt(data.manoObra)}\n`;
            msg += `**Instalaciones y terminaciones:** ${fmt(data.additional)}\n`;
            msg += `**Imprevistos (5%):** ${fmt(data.imprevistos)}\n`;
          }

          await addBotMessage(msg, null, 500);
          await addBotMessage(
            '¿Querés **modificar el diseño** y recalcular, o tenés alguna **pregunta** sobre el presupuesto? 🤔',
            [
              { id: 'modify', label: '✏️ Modificar diseño' },
              { id: 'new', label: '🔄 Nuevo proyecto' },
            ],
            800
          );
      } else {
        await addBotMessage('Error al calcular el presupuesto. Intentá de nuevo.', null, 300);
      }
    } catch {
      await addBotMessage('Error de conexión al generar presupuesto. 🔌', null, 300);
    }

    setLoading(false);
  };

  // ─── Quick actions ───
  const handleOption = async (id) => {
    if (id === 'new') {
      resetAll();
      return;
    }
    if (id === 'modify') {
      setPhase(PHASE.DESIGNING);
      await addBotMessage('¡Dale! Contame qué querés cambiar del diseño. 🏗️', null, 300);
      inputRef.current?.focus();
      return;
    }
    // Treat as a question
    addUserMessage(id);
    setLoading(true);
    try {
      const res = await fetch('/api/rago/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: id,
          currentPlan,
          history: messages.slice(-8).map((m) => ({ role: m.role === 'system' ? 'assistant' : m.role, content: m.content })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.plan?.rooms?.length > 0) {
          const newV = [...planVersions, data.plan];
          setPlanVersions(newV);
          setCurrentVersion(newV.length - 1);
          addSystemMessage(`📐 Plano actualizado — Versión ${newV.length}`);
        }
        await addBotMessage(data.reply, null, 300);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  const resetAll = async () => {
    setMessages([]);
    setPlanVersions([]);
    setCurrentVersion(-1);
    setBudgetResult(null);
    setPhase(PHASE.WELCOME);
    setSelectedRoom(null);
    setTimeout(async () => {
      await addBotMessage(
        '¡Empecemos de nuevo! 👋\n\nDescribime el espacio que querés construir: una **casa completa** o un **ambiente individual** (ej: *"Baño de 3x3"*). 🏗️',
        null,
        400
      );
      setPhase(PHASE.DESIGNING);
    }, 200);
  };

  // ─── Markdown-like renderer ───
  const renderText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h4 key={i} className="font-bold text-slate-800 text-sm mt-3 mb-1">{line.replace('### ', '')}</h4>;
      if (line.startsWith('## ')) return <h3 key={i} className="font-bold text-slate-900 text-base mt-2 mb-1">{line.replace('## ', '')}</h3>;
      if (line.startsWith('# ')) return <h2 key={i} className="font-extrabold text-emerald-600 text-2xl my-1">{line.replace('# ', '')}</h2>;
      if (line === '---') return <hr key={i} className="border-slate-200 my-2" />;
      if (line.match(/^[•\-] /)) {
        const c = line.replace(/^[•\-] /, '');
        return <div key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed"><span className="text-emerald-400 mt-0.5 flex-shrink-0">•</span><span dangerouslySetInnerHTML={{ __html: bold(c) }} /></div>;
      }
      if (line.trim() === '') return <div key={i} className="h-1" />;
      return <p key={i} className="text-sm text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: bold(line) }} />;
    });
  };
  const bold = (t) => t.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800 font-semibold">$1</strong>').replace(/\*(.*?)\*/g, '<em class="text-slate-500">$1</em>');
  const fmtTime = (d) => new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(d);

  return (
    <div className="h-[calc(100vh-4.5rem)] flex flex-col lg:flex-row gap-0 lg:gap-3 px-2 sm:px-4 lg:px-6 pb-2">
      {/* ═══ LEFT: Floor Plan / Render ═══ */}
      {showPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full lg:w-[55%] flex-shrink-0 flex flex-col h-[40vh] lg:h-full relative"
        >
            {/* ── Tab Switcher: Plano / Render ── */}
            <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-50/80 border-b border-slate-100 rounded-t-2xl">
              <button
                onClick={() => setLeftPanelMode('plan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  leftPanelMode === 'plan'
                    ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                Plano
              </button>
              <button
                onClick={() => setLeftPanelMode('render')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  leftPanelMode === 'render'
                    ? 'bg-white text-purple-700 shadow-sm border border-purple-200'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Vista Amoblada
              </button>

              {/* Version navigator (only in plan mode) */}
              {leftPanelMode === 'plan' && planVersions.length > 1 && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={() => setCurrentVersion((v) => Math.max(0, v - 1))}
                    disabled={currentVersion <= 0}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1">
                    {planVersions.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentVersion(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          i === currentVersion ? 'bg-emerald-500 scale-125' : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentVersion((v) => Math.min(planVersions.length - 1, v + 1))}
                    disabled={currentVersion >= planVersions.length - 1}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[9px] text-slate-400">
                    v{currentVersion + 1}/{planVersions.length}
                  </span>
                </div>
              )}
            </div>

            {/* ── Panel Content ── */}
            <AnimatePresence mode="wait">
              {leftPanelMode === 'plan' ? (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col min-h-0"
                >
                  <FloorPlanRenderer
                    plan={currentPlan}
                    version={currentVersion >= 0 ? currentVersion + 1 : undefined}
                    selectedRoom={selectedRoom}
                    onRoomClick={(room) => setSelectedRoom(room?.id === selectedRoom ? null : room?.id)}
                    editable={true}
                    onPlanChange={handlePlanChange}
                  />

                  {/* Action buttons below plan */}
                  {currentPlan && currentPlan.rooms.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 justify-center py-2"
                    >
                      <button
                        onClick={generateBudget}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all disabled:opacity-50"
                      >
                        <Calculator className="w-4 h-4" />
                        Presupuesto
                      </button>
                      <button
                        onClick={() => setShowMasonryCalc((v) => !v)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02] ${
                          showMasonryCalc
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20 hover:shadow-amber-500/30'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20 hover:shadow-amber-500/30'
                        }`}
                      >
                        <Blocks className="w-4 h-4" />
                        Mampostería
                      </button>
                      <button
                        onClick={() => setLeftPanelMode('render')}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02] transition-all"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Vista Amoblada
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="render"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-h-0"
                >
                  <FurnishedPlanRenderer
                    plan={currentPlan}
                    onClose={() => setLeftPanelMode('plan')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
        </motion.div>
      )}

      {/* ═══ MASONRY CALCULATOR PANEL ═══ */}
      <AnimatePresence>
        {showMasonryCalc && currentPlan && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full lg:w-[48%] flex-shrink-0 flex flex-col h-[50vh] lg:h-full bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Compact selectors bar */}
            <div className="px-4 py-2.5 border-b border-slate-100 bg-gradient-to-r from-amber-50/80 to-orange-50/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Blocks className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Mampostería</span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">· Altura {WALL_HEIGHT_DEFAULT}m</span>
                  {masonryBrickType === 'block' && <span className="text-[10px] text-amber-600 font-medium">(sin cal)</span>}
                </div>
                <button
                  onClick={() => setShowMasonryCalc(false)}
                  className="text-slate-400 hover:text-slate-600 text-base font-bold px-1 -mr-1"
                >
                  ×
                </button>
              </div>
              <div className="flex gap-1.5">
                {Object.entries(MASONRY_SPECS).map(([key, spec]) => (
                  <button
                    key={key}
                    onClick={() => setMasonryBrickType(key)}
                    className={`flex-1 px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      masonryBrickType === key
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    {spec.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5">
                {Object.entries(MASONRY_SPECS[masonryBrickType].walls).map(([size, spec]) => (
                  <button
                    key={size}
                    onClick={() => setMasonryWallSize(Number(size))}
                    className={`flex-1 px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      masonryWallSize === Number(size)
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    {spec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {masonryResults && (
                <div className="space-y-3">
                  {/* Per-room results */}
                  <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Por Ambiente</h4>
                  <div className="space-y-3">
                    {masonryResults.rooms.map((room, i) => (
                      <div key={i} className="bg-white border border-slate-150 rounded-xl p-3.5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-base font-extrabold text-slate-800">{room.name}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{room.areaM2} m² sup. · {room.wallM2} m² pared</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5 text-center">
                          <div className="bg-amber-50 rounded-xl p-2.5">
                            <div className="text-lg font-black text-amber-700 leading-tight">{room.ladrillos.toLocaleString('es-AR')}</div>
                            <div className="text-[10px] text-amber-500 font-semibold mt-0.5">{masonryBrickType === 'block' ? 'Blocks' : 'Ladrillos'}</div>
                            {masonryResults.ladrilloRef?.precio && (
                              <div className="text-[9px] text-amber-400 mt-0.5">${masonryResults.ladrilloRef.precio.toLocaleString('es-AR')} c/u</div>
                            )}
                          </div>
                          <div className="bg-orange-50 rounded-xl p-2.5">
                            <div className="text-lg font-black text-orange-700 leading-tight">{room.mezcla}</div>
                            <div className="text-[10px] text-orange-500 font-semibold mt-0.5">m³ {masonryBrickType === 'block' ? 'Concreto' : 'Mezcla'}</div>
                          </div>
                          <div className="bg-yellow-50 rounded-xl p-2.5">
                            <div className="text-lg font-black text-yellow-700 leading-tight">{room.arena}</div>
                            <div className="text-[10px] text-yellow-600 font-semibold mt-0.5">m³ Arena</div>
                          </div>
                          {!masonryResults.isBlock && (
                            <div className="bg-lime-50 rounded-xl p-2.5">
                              <div className="text-lg font-black text-lime-700 leading-tight">{room.cal}</div>
                              <div className="text-[10px] text-lime-600 font-bold mt-0.5">{room.calBolsas} bolsa{room.calBolsas !== 1 ? 's' : ''} ({PRECIOS_ELAMIGO.cal.peso}kg)</div>
                              <div className="text-[10px] text-lime-500 font-semibold">kg Cal</div>
                            </div>
                          )}
                          <div className={`${masonryResults.isBlock ? 'col-span-2' : 'col-span-2'} bg-emerald-50 rounded-xl p-2.5`}>
                            <div className="text-lg font-black text-emerald-700 leading-tight">{room.cemento}</div>
                            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{room.cementoBolsas} bolsa{room.cementoBolsas !== 1 ? 's' : ''} ({PRECIOS_ELAMIGO.cemento.peso}kg)</div>
                            <div className="text-[10px] text-emerald-500 font-semibold">kg Cemento</div>
                          </div>
                        </div>
                        {/* Costo por ambiente */}
                        <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-green-700 font-semibold">💰 Costo materiales</span>
                            <span className="text-base font-black text-green-800">
                              ${((room.costoLadrillos || 0) + room.costoCemento + (masonryResults.isBlock ? 0 : room.costoCal)).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                            {room.costoLadrillos !== null ? (
                              <span className="text-[10px] text-green-600">🧱 Ladrillos: ${room.costoLadrillos.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                            ) : (
                              <span className="text-[10px] text-slate-400">🧱 Ladrillos: sin precio ref.</span>
                            )}
                            {!masonryResults.isBlock && (
                              <span className="text-[10px] text-green-600">Cal: ${room.costoCal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                            )}
                            <span className="text-[10px] text-green-600">Cemento: ${room.costoCemento.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t-2 border-amber-200 pt-4 mt-4">
                    <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-3">Total a Construir</h4>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5">
                      {/* Wall area with shared wall deduction */}
                      <div className="text-center mb-4">
                        <span className="text-[11px] text-slate-500 block font-medium">Superficie neta de pared</span>
                        <span className="text-2xl font-black text-amber-700">{masonryResults.totals.wallM2} m²</span>
                        {parseFloat(masonryResults.totals.sharedWallM2) > 0 && (
                          <div className="mt-1.5 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 inline-block">
                            <div className="text-[10px] text-blue-700 font-semibold">
                              🔗 Paredes compartidas descontadas: <span className="font-black">{masonryResults.totals.sharedWallM2} m²</span>
                            </div>
                            <div className="text-[9px] text-blue-500 mt-0.5">
                              Suma bruta: {masonryResults.totals.wallM2Raw} m² − {masonryResults.totals.sharedWallM2} m² compartidos = {masonryResults.totals.wallM2} m²
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Shared walls detail */}
                      {masonryResults.sharedWalls && masonryResults.sharedWalls.length > 0 && (
                        <div className="mb-4 bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                          <div className="text-[10px] font-bold text-blue-700 mb-1.5">🧱 Paredes compartidas detectadas:</div>
                          <div className="space-y-1">
                            {masonryResults.sharedWalls.map((sw, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[10px]">
                                <span className="text-blue-600">{sw.roomA} ↔ {sw.roomB}</span>
                                <span className="font-bold text-blue-700">{sw.sharedLength.toFixed(1)}m × {WALL_HEIGHT_DEFAULT}m = {(sw.sharedLength * WALL_HEIGHT_DEFAULT).toFixed(1)} m²</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                          <div className="text-xl font-black text-amber-700">{masonryResults.totals.ladrillos.toLocaleString('es-AR')}</div>
                          <div className="text-[11px] text-amber-500 font-semibold mt-0.5">{masonryBrickType === 'block' ? 'Blocks' : 'Ladrillos'}</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                          <div className="text-xl font-black text-orange-700">{masonryResults.totals.mezcla} m³</div>
                          <div className="text-[11px] text-orange-500 font-semibold mt-0.5">{masonryBrickType === 'block' ? 'Concreto' : 'Mezcla'}</div>
                        </div>
                        <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                          <div className="text-xl font-black text-yellow-700">{masonryResults.totals.arena} m³</div>
                          <div className="text-[11px] text-yellow-600 font-semibold mt-0.5">Arena gruesa</div>
                        </div>
                        {!masonryResults.isBlock && (
                          <div className="bg-white rounded-xl p-3 text-center shadow-sm">
                            <div className="text-xl font-black text-lime-700">{masonryResults.totals.cal} kg</div>
                            <div className="text-sm font-bold text-lime-600">{masonryResults.totals.calBolsas} bolsa{masonryResults.totals.calBolsas !== 1 ? 's' : ''}</div>
                            <div className="text-[11px] text-lime-500 font-semibold">Cal (bolsa {PRECIOS_ELAMIGO.cal.peso}kg)</div>
                          </div>
                        )}
                        <div className={`bg-white rounded-xl p-3 text-center shadow-sm ${masonryResults.isBlock ? '' : 'col-span-2'}`}>
                          <div className="text-xl font-black text-emerald-700">{masonryResults.totals.cemento} kg</div>
                          <div className="text-sm font-bold text-emerald-600">{masonryResults.totals.cementoBolsas} bolsa{masonryResults.totals.cementoBolsas !== 1 ? 's' : ''}</div>
                          <div className="text-[11px] text-emerald-500 font-semibold">Cemento (bolsa {PRECIOS_ELAMIGO.cemento.peso}kg)</div>
                        </div>
                      </div>

                      {/* ═══ Costo Total Estimado ═══ */}
                      <div className="mt-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-2xl p-5">
                        <div className="text-center mb-2">
                          <span className="text-[11px] text-green-700 font-bold uppercase tracking-widest">💰 Costo Estimado Total</span>
                        </div>
                        <div className="text-center">
                          <span className="text-3xl font-black text-green-800">
                            ${((masonryResults.totals.costoLadrillos || 0) + masonryResults.totals.costoCemento + (masonryResults.isBlock ? 0 : masonryResults.totals.costoCal)).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5 mt-3">
                          {/* Ladrillos */}
                          <div className="bg-white/80 rounded-xl p-2.5 text-center">
                            {masonryResults.totals.costoLadrillos !== null ? (
                              <>
                                <div className="text-base font-black text-amber-700">${masonryResults.totals.costoLadrillos.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
                                <div className="text-[10px] text-amber-600 font-medium">🧱 {masonryResults.totals.ladrillos.toLocaleString('es-AR')} × ${masonryResults.ladrilloRef.precio.toLocaleString('es-AR')}</div>
                              </>
                            ) : (
                              <>
                                <div className="text-base font-bold text-slate-400">N/D</div>
                                <div className="text-[10px] text-slate-400">🧱 Ladrillos (sin ref.)</div>
                              </>
                            )}
                          </div>
                          {/* Cal */}
                          {!masonryResults.isBlock && (
                            <div className="bg-white/80 rounded-xl p-2.5 text-center">
                              <div className="text-base font-black text-lime-700">${masonryResults.totals.costoCal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
                              <div className="text-[10px] text-lime-600 font-medium">Cal ({masonryResults.totals.calBolsas} × ${PRECIOS_ELAMIGO.cal.precio.toLocaleString('es-AR')})</div>
                            </div>
                          )}
                          {/* Cemento */}
                          <div className={`bg-white/80 rounded-xl p-2.5 text-center ${masonryResults.isBlock ? 'col-span-2' : ''}`}>
                            <div className="text-base font-black text-emerald-700">${masonryResults.totals.costoCemento.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</div>
                            <div className="text-[10px] text-emerald-600 font-medium">Cemento ({masonryResults.totals.cementoBolsas} × ${PRECIOS_ELAMIGO.cemento.precio.toLocaleString('es-AR')})</div>
                          </div>
                        </div>
                        {/* Producto de referencia */}
                        {masonryResults.ladrilloRef.url && (
                          <div className="mt-2.5 bg-white/60 rounded-lg p-2 text-center">
                            <div className="text-[10px] text-amber-700 font-semibold">{masonryResults.ladrilloRef.nombre}</div>
                            <div className="text-[10px] text-amber-600">${masonryResults.ladrilloRef.precio?.toLocaleString('es-AR')} c/u</div>
                          </div>
                        )}
                        <div className="text-[9px] text-green-600 text-center mt-2 leading-tight">
                          Precios ref: <a href={PRECIOS_ELAMIGO.cemento.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-800">elamigo.com.ar</a> · No incluye arena
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spec reference */}
                  <div className="text-[11px] text-slate-400 text-center pt-2 pb-1">
                    {masonryResults.brickType} · {masonryResults.wallSize} · Altura {WALL_HEIGHT_DEFAULT}m
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ RIGHT: Chat ═══ */}
      <div className={`flex-1 flex flex-col min-w-0 ${showPlan ? '' : 'w-full'} h-[55vh] lg:h-full`}>
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-3 py-2.5 bg-white/80 backdrop-blur-xl rounded-t-2xl border border-slate-100 shadow-sm">
          <button
            onClick={() => setShowPlan((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors lg:block hidden"
            title={showPlan ? 'Ocultar plano' : 'Mostrar plano'}
          >
            {showPlan ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </button>
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Bot className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-slate-900 text-sm">RAGO — Arquitecto IA</h2>
            <p className="text-[10px] text-emerald-600 font-medium">Dibuja planos · Calcula presupuestos</p>
          </div>
          <button
            onClick={resetAll}
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Reiniciar"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gradient-to-b from-slate-50/50 to-white border-x border-slate-100"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              if (msg.role === 'system') {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium">
                      <Sparkles className="w-3 h-3" />
                      {msg.content}
                    </span>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === 'user' ? '' : ''}`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tr-md shadow-md shadow-emerald-500/10'
                          : 'bg-white border border-slate-100 shadow-sm rounded-tl-md'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="[&_p]:text-[13px] [&_h2]:text-xl [&_h3]:text-sm [&_h4]:text-xs">{renderText(msg.content)}</div>
                      )}
                    </div>
                    <p className={`text-[9px] text-slate-300 mt-0.5 ${msg.role === 'user' ? 'text-right' : ''}`}>
                      {fmtTime(msg.timestamp)}
                    </p>

                    {/* Quick options */}
                    {msg.options?.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-1.5 mt-2">
                        {msg.options.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleOption(opt.id)}
                            className="text-[11px] sm:text-xs px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg border border-emerald-200 hover:border-emerald-300 transition-all active:scale-95"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Scroll btn */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="absolute bottom-20 right-4 w-8 h-8 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-50 transition-colors z-10"
            >
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="bg-white/80 backdrop-blur-xl border border-t-0 border-slate-100 rounded-b-2xl px-3 py-2.5">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                !currentPlan
                  ? 'Ej: "Baño de 3x3" o "Casa de 100m² con 2 dormitorios"...'
                  : 'Modificá el diseño o hacé una consulta...'
              }
              disabled={loading}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <p className="text-center text-[9px] text-slate-300 mt-1.5">
            RAGO · Planos y presupuestos generados con IA · Los resultados son estimativos
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetChat;
