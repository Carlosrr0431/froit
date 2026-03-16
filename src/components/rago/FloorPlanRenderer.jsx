'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Grid3X3,
  Trash2,
  ArrowRightLeft,
  Undo2,
  MousePointer2,
  Lock,
  Unlock,
} from 'lucide-react';

// ─── Color palette for room types ───
const ROOM_COLORS = {
  living: { fill: '#E8F5E9', stroke: '#66BB6A', label: 'Living' },
  comedor: { fill: '#FFF3E0', stroke: '#FFA726', label: 'Comedor' },
  cocina: { fill: '#FFF8E1', stroke: '#FFCA28', label: 'Cocina' },
  dormitorio: { fill: '#E3F2FD', stroke: '#42A5F5', label: 'Dormitorio' },
  bano: { fill: '#F3E5F5', stroke: '#AB47BC', label: 'Baño' },
  garage: { fill: '#ECEFF1', stroke: '#78909C', label: 'Garage' },
  lavadero: { fill: '#E0F7FA', stroke: '#26C6DA', label: 'Lavadero' },
  pasillo: { fill: '#F5F5F5', stroke: '#BDBDBD', label: 'Pasillo' },
  hall: { fill: '#FBE9E7', stroke: '#FF7043', label: 'Hall' },
  balcon: { fill: '#F1F8E9', stroke: '#9CCC65', label: 'Balcón' },
  patio: { fill: '#E8F5E9', stroke: '#81C784', label: 'Patio' },
  oficina: { fill: '#E8EAF6', stroke: '#5C6BC0', label: 'Oficina' },
  vestidor: { fill: '#FCE4EC', stroke: '#EC407A', label: 'Vestidor' },
  default: { fill: '#FAFAFA', stroke: '#9E9E9E', label: '' },
};

const SCALE = 40; // pixels per meter
const SNAP = 0.1; // snap to 10cm
const MIN_SIZE = 1.2; // min room dimension in meters
const HANDLE_SIZE = 8;

function snap(val) {
  return Math.round(val / SNAP) * SNAP;
}
function rd(n) {
  return Math.round(n * 10) / 10;
}

const FloorPlanRenderer = ({
  plan,
  version,
  onRoomClick,
  selectedRoom,
  showDimensions = true,
  showGrid = true,
  editable = true,
  onPlanChange,
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dims, setDims] = useState(true);
  const [grid, setGrid] = useState(showGrid);
  const [locked, setLocked] = useState(false);

  // ─── Interaction state ───
  const [dragState, setDragState] = useState(null);
  const [hoveredHandle, setHoveredHandle] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editValues, setEditValues] = useState({ width: '', height: '' });

  // ─── History for undo ───
  const [history, setHistory] = useState([]);

  const isInteractive = editable && !locked && !!onPlanChange;

  // ─── Property boundary (captured once per version) ───
  const propertyBoundsRef = useRef(null);
  const lastBoundsVersion = useRef(null);

  // Capture the initial bounding box of the plan as the immutable property boundary
  useEffect(() => {
    if (plan?.rooms?.length && version !== lastBoundsVersion.current) {
      lastBoundsVersion.current = version;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      plan.rooms.forEach((rm) => {
        minX = Math.min(minX, rm.x);
        minY = Math.min(minY, rm.y);
        maxX = Math.max(maxX, rm.x + rm.width);
        maxY = Math.max(maxY, rm.y + rm.height);
      });
      propertyBoundsRef.current = { minX, minY, maxX, maxY };
    }
  }, [plan, version]);

  // ─── Collision detection: does rect A overlap rect B? ───
  const rectsOverlap = useCallback((a, b, tolerance = 0.05) => {
    return (
      a.x < b.x + b.width - tolerance &&
      a.x + a.width > b.x + tolerance &&
      a.y < b.y + b.height - tolerance &&
      a.y + a.height > b.y + tolerance
    );
  }, []);

  // Check if a candidate room rect collides with any OTHER room
  const hasCollision = useCallback((candidate, roomId, rooms) => {
    return rooms.some(rm => rm.id !== roomId && rectsOverlap(candidate, rm));
  }, [rectsOverlap]);

  // Check if a candidate room rect is within property bounds
  const isWithinBounds = useCallback((candidate) => {
    const bounds = propertyBoundsRef.current;
    if (!bounds) return true; // no bounds yet = allow
    return (
      candidate.x >= bounds.minX - 0.01 &&
      candidate.y >= bounds.minY - 0.01 &&
      candidate.x + candidate.width <= bounds.maxX + 0.01 &&
      candidate.y + candidate.height <= bounds.maxY + 0.01
    );
  }, []);

  // Calculate total plan dimensions
  const planBounds = useMemo(() => {
    if (!plan || !plan.rooms || plan.rooms.length === 0) {
      return { width: 12, height: 10, minX: 0, minY: 0 };
    }
    // Use the property boundary when available so canvas doesn't shrink
    const pb = propertyBoundsRef.current;
    let minX, minY, maxX, maxY;
    if (pb) {
      minX = pb.minX;
      minY = pb.minY;
      maxX = pb.maxX;
      maxY = pb.maxY;
    } else {
      minX = Infinity; minY = Infinity; maxX = -Infinity; maxY = -Infinity;
      plan.rooms.forEach((rm) => {
        minX = Math.min(minX, rm.x);
        minY = Math.min(minY, rm.y);
        maxX = Math.max(maxX, rm.x + rm.width);
        maxY = Math.max(maxY, rm.y + rm.height);
      });
    }
    return {
      width: maxX - minX + 3,
      height: maxY - minY + 3,
      minX: minX - 1.5,
      minY: minY - 1.5,
    };
  }, [plan]);

  const svgWidth = planBounds.width * SCALE;
  const svgHeight = planBounds.height * SCALE;

  // Auto-fit zoom on plan change (only on version change, not every edit)
  const lastFitVersion = useRef(null);
  useEffect(() => {
    if (containerRef.current && plan?.rooms?.length && version !== lastFitVersion.current) {
      lastFitVersion.current = version;
      const container = containerRef.current;
      const cw = container.clientWidth - 32;
      const ch = container.clientHeight - 32;
      const fitZoom = Math.min(cw / svgWidth, ch / svgHeight, 1.5);
      setZoom(Math.max(0.3, Math.min(fitZoom, 1.5)));
      setPan({ x: 0, y: 0 });
    }
  }, [plan, version, svgWidth, svgHeight]);

  // ─── Convert screen coords to SVG meters ───
  const screenToMeters = useCallback((clientX, clientY) => {
    if (!svgRef.current) return { mx: 0, my: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const sx = (clientX - rect.left) / zoom;
    const sy = (clientY - rect.top) / zoom;
    const mx = sx / SCALE + planBounds.minX;
    const my = sy / SCALE + planBounds.minY;
    return { mx, my };
  }, [zoom, planBounds.minX, planBounds.minY]);

  // ─── Push plan update ───
  const emitPlanChange = useCallback((newRooms) => {
    if (!onPlanChange || !plan) return;
    onPlanChange({ ...plan, rooms: newRooms });
  }, [onPlanChange, plan]);

  // ─── Save state for undo ───
  const saveToHistory = useCallback(() => {
    if (!plan?.rooms) return;
    setHistory(prev => [...prev.slice(-20), JSON.stringify(plan.rooms)]);
  }, [plan]);

  // ─── Undo ───
  const undo = useCallback(() => {
    if (history.length === 0 || !onPlanChange || !plan) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    onPlanChange({ ...plan, rooms: JSON.parse(prev) });
  }, [history, onPlanChange, plan]);

  // ─── Delete room ───
  const deleteRoom = useCallback((roomId) => {
    if (!plan?.rooms || !onPlanChange) return;
    saveToHistory();
    emitPlanChange(plan.rooms.filter(rm => rm.id !== roomId));
    if (selectedRoom === roomId) onRoomClick?.(null);
  }, [plan, onPlanChange, saveToHistory, emitPlanChange, selectedRoom, onRoomClick]);

  // ─── Mouse: start drag ───
  const handleRoomMouseDown = useCallback((e, room, handle = null) => {
    if (!isInteractive) return;
    e.stopPropagation();
    e.preventDefault();
    saveToHistory();
    const { mx, my } = screenToMeters(e.clientX, e.clientY);
    setDragState({
      type: handle ? 'resize' : 'move',
      roomId: room.id,
      startMouse: { mx, my },
      startRoom: { x: room.x, y: room.y, width: room.width, height: room.height },
      handle,
    });
  }, [isInteractive, screenToMeters, saveToHistory]);

  // ─── Mouse: dragging (with boundary + collision constraints) ───
  const handleSvgMouseMove = useCallback((e) => {
    if (!dragState || !plan?.rooms) return;
    const { mx, my } = screenToMeters(e.clientX, e.clientY);
    const dx = mx - dragState.startMouse.mx;
    const dy = my - dragState.startMouse.my;
    const src = dragState.startRoom;
    const bounds = propertyBoundsRef.current;
    const otherRooms = plan.rooms.filter(rm => rm.id !== dragState.roomId);

    const newRooms = plan.rooms.map(rm => {
      if (rm.id !== dragState.roomId) return rm;

      let newX, newY, newW, newH;

      if (dragState.type === 'move') {
        newX = rd(snap(src.x + dx));
        newY = rd(snap(src.y + dy));
        newW = src.width;
        newH = src.height;

        // Clamp to property boundary
        if (bounds) {
          newX = Math.max(bounds.minX, Math.min(newX, rd(bounds.maxX - newW)));
          newY = Math.max(bounds.minY, Math.min(newY, rd(bounds.maxY - newH)));
        }
      } else {
        // Resize
        newX = src.x; newY = src.y; newW = src.width; newH = src.height;
        const h = dragState.handle;

        if (h.includes('e')) {
          newW = Math.max(MIN_SIZE, snap(src.width + dx));
          if (bounds) newW = Math.min(newW, rd(bounds.maxX - src.x));
        }
        if (h.includes('w')) {
          let d = Math.min(dx, src.width - MIN_SIZE);
          let candidateX = snap(src.x + d);
          if (bounds) candidateX = Math.max(bounds.minX, candidateX);
          d = candidateX - src.x;
          newX = rd(candidateX);
          newW = Math.max(MIN_SIZE, rd(src.width - d));
        }
        if (h.includes('s')) {
          newH = Math.max(MIN_SIZE, snap(src.height + dy));
          if (bounds) newH = Math.min(newH, rd(bounds.maxY - src.y));
        }
        if (h.includes('n')) {
          let d = Math.min(dy, src.height - MIN_SIZE);
          let candidateY = snap(src.y + d);
          if (bounds) candidateY = Math.max(bounds.minY, candidateY);
          d = candidateY - src.y;
          newY = rd(candidateY);
          newH = Math.max(MIN_SIZE, rd(src.height - d));
        }
      }

      const candidate = { x: newX, y: newY, width: newW, height: newH };

      // Check collision with other rooms — if would overlap, reject this move
      const collides = otherRooms.some(other => rectsOverlap(candidate, other));
      if (collides) {
        return rm; // keep current position
      }

      return { ...rm, ...candidate };
    });

    emitPlanChange(newRooms);
  }, [dragState, plan, screenToMeters, emitPlanChange, rectsOverlap]);

  // ─── Mouse: end drag ───
  const handleSvgMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  // ─── Keyboard: delete selected / undo ───
  useEffect(() => {
    if (!isInteractive) return;
    const handler = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedRoom && !editingRoom) {
        e.preventDefault();
        deleteRoom(selectedRoom);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isInteractive, selectedRoom, editingRoom, deleteRoom, undo]);

  // ─── Canvas panning (ctrl+click) ───
  const handleCanvasMouseDown = useCallback((e) => {
    if (dragState) return;
    if (e.button === 0 && (e.ctrlKey || e.metaKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [dragState, pan]);

  const handleCanvasMouseMove = useCallback((e) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    if (dragState) handleSvgMouseMove(e);
  }, [isPanning, panStart, dragState, handleSvgMouseMove]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false);
    handleSvgMouseUp();
  }, [handleSvgMouseUp]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.2, Math.min(3, z + delta)));
  }, []);

  // ─── Inline dimension editing ───
  const startEditDimensions = useCallback((room) => {
    setEditingRoom(room.id);
    setEditValues({ width: String(room.width), height: String(room.height) });
  }, []);

  const applyEditDimensions = useCallback(() => {
    if (!editingRoom || !plan?.rooms || !onPlanChange) return;
    const w = parseFloat(editValues.width);
    const h = parseFloat(editValues.height);
    if (isNaN(w) || isNaN(h) || w < MIN_SIZE || h < MIN_SIZE) {
      setEditingRoom(null);
      return;
    }

    const room = plan.rooms.find(rm => rm.id === editingRoom);
    if (!room) { setEditingRoom(null); return; }

    const candidate = { x: room.x, y: room.y, width: rd(w), height: rd(h) };

    // Validate against property bounds
    if (!isWithinBounds(candidate)) {
      // Try to keep it inside by clamping dimensions to what fits
      const bounds = propertyBoundsRef.current;
      if (bounds) {
        candidate.width = rd(Math.min(candidate.width, bounds.maxX - room.x));
        candidate.height = rd(Math.min(candidate.height, bounds.maxY - room.y));
        if (candidate.width < MIN_SIZE || candidate.height < MIN_SIZE) {
          setEditingRoom(null);
          return;
        }
      }
    }

    // Validate against collisions
    const otherRooms = plan.rooms.filter(rm => rm.id !== editingRoom);
    if (hasCollision(candidate, editingRoom, plan.rooms)) {
      setEditingRoom(null);
      return; // reject: would overlap another room
    }

    saveToHistory();
    emitPlanChange(plan.rooms.map(rm =>
      rm.id === editingRoom ? { ...rm, width: candidate.width, height: candidate.height } : rm
    ));
    setEditingRoom(null);
  }, [editingRoom, editValues, plan, onPlanChange, saveToHistory, emitPlanChange, isWithinBounds, hasCollision]);

  const getColor = (type) => ROOM_COLORS[type] || ROOM_COLORS.default;

  const getCursorClass = () => {
    if (dragState?.type === 'move') return 'cursor-grabbing';
    if (dragState?.type === 'resize') return 'cursor-nwse-resize';
    if (isPanning) return 'cursor-grabbing';
    return 'cursor-default';
  };

  // ─── Resize handle positions ───
  const getHandlePositions = (room) => {
    const rx = room.x * SCALE;
    const ry = room.y * SCALE;
    const rw = room.width * SCALE;
    const rh = room.height * SCALE;
    const hs = HANDLE_SIZE;
    return [
      { id: 'nw', x: rx - hs / 2, y: ry - hs / 2, cursor: 'nwse-resize' },
      { id: 'n',  x: rx + rw / 2 - hs / 2, y: ry - hs / 2, cursor: 'ns-resize' },
      { id: 'ne', x: rx + rw - hs / 2, y: ry - hs / 2, cursor: 'nesw-resize' },
      { id: 'e',  x: rx + rw - hs / 2, y: ry + rh / 2 - hs / 2, cursor: 'ew-resize' },
      { id: 'se', x: rx + rw - hs / 2, y: ry + rh - hs / 2, cursor: 'nwse-resize' },
      { id: 's',  x: rx + rw / 2 - hs / 2, y: ry + rh - hs / 2, cursor: 'ns-resize' },
      { id: 'sw', x: rx - hs / 2, y: ry + rh - hs / 2, cursor: 'nesw-resize' },
      { id: 'w',  x: rx - hs / 2, y: ry + rh / 2 - hs / 2, cursor: 'ew-resize' },
    ];
  };

  // ─── Empty state ───
  if (!plan || !plan.rooms || plan.rooms.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-2xl border-2 border-dashed border-slate-200 min-h-[300px]">
        <div className="text-center p-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-4"
          >
            <Grid3X3 className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h3 className="font-bold text-slate-700 mb-2">Tu plano aparecerá aquí</h3>
          <p className="text-sm text-slate-400 max-w-xs">
            Describí tu casa en el chat y la IA va a dibujar el plano automáticamente
          </p>
        </div>
      </div>
    );
  }

  const selectedRoomObj = plan.rooms.find(rm => rm.id === selectedRoom);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
      {/* ═══ Toolbar ═══ */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-emerald-600 transition-colors" title="Acercar">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(z => Math.max(0.2, z - 0.2))} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-emerald-600 transition-colors" title="Alejar">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-emerald-600 transition-colors" title="Resetear vista">
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button onClick={() => setDims(d => !d)} className={`p-1.5 rounded-lg transition-colors ${dims ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-white text-slate-400'}`} title="Mostrar medidas">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => setGrid(g => !g)} className={`p-1.5 rounded-lg transition-colors ${grid ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-white text-slate-400'}`} title="Mostrar grilla">
            <Grid3X3 className="w-4 h-4" />
          </button>

          {editable && onPlanChange && (
            <>
              <div className="w-px h-5 bg-slate-200 mx-1" />
              <button
                onClick={() => setLocked(l => !l)}
                className={`p-1.5 rounded-lg transition-colors ${locked ? 'bg-amber-100 text-amber-600' : 'hover:bg-white text-slate-400'}`}
                title={locked ? 'Desbloquear edición' : 'Bloquear edición'}
              >
                {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <button
                onClick={undo}
                disabled={history.length === 0}
                className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-emerald-600 transition-colors disabled:opacity-30"
                title="Deshacer (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isInteractive && (
            <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 font-semibold rounded-full border border-emerald-200">
              Editable
            </span>
          )}
          <span className="text-[10px] text-slate-400 font-mono">{Math.round(zoom * 100)}%</span>
          {version !== undefined && (
            <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 font-semibold rounded-full border border-emerald-200">
              v{version}
            </span>
          )}
        </div>
      </div>

      {/* ═══ Selected Room Toolbar ═══ */}
      <AnimatePresence>
        {selectedRoomObj && isInteractive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: getColor(selectedRoomObj.type).stroke }} />
                <span className="text-xs font-bold text-slate-700 truncate">{selectedRoomObj.name}</span>
                <span className="text-[10px] text-slate-400">
                  {selectedRoomObj.width}×{selectedRoomObj.height}m · {rd(selectedRoomObj.width * selectedRoomObj.height)}m²
                </span>
              </div>

              <div className="flex items-center gap-1">
                {editingRoom === selectedRoomObj.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number" step="0.1" min={MIN_SIZE}
                      value={editValues.width}
                      onChange={(e) => setEditValues(v => ({ ...v, width: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && applyEditDimensions()}
                      className="w-14 px-1.5 py-0.5 text-[11px] border border-emerald-300 rounded-md bg-white text-center font-mono focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      autoFocus
                    />
                    <span className="text-[10px] text-slate-400">×</span>
                    <input
                      type="number" step="0.1" min={MIN_SIZE}
                      value={editValues.height}
                      onChange={(e) => setEditValues(v => ({ ...v, height: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && applyEditDimensions()}
                      className="w-14 px-1.5 py-0.5 text-[11px] border border-emerald-300 rounded-md bg-white text-center font-mono focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    />
                    <span className="text-[10px] text-slate-400">m</span>
                    <button onClick={applyEditDimensions} className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors">
                      OK
                    </button>
                    <button onClick={() => setEditingRoom(null)} className="px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-slate-600 transition-colors">
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => startEditDimensions(selectedRoomObj)}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold bg-white text-slate-600 rounded-lg border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 transition-all"
                      title="Editar dimensiones"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      Dimensiones
                    </button>
                    <button
                      onClick={() => deleteRoom(selectedRoomObj.id)}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold bg-white text-red-500 rounded-lg border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-all"
                      title="Eliminar ambiente (Del)"
                    >
                      <Trash2 className="w-3 h-3" />
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SVG Canvas ═══ */}
      <div
        ref={containerRef}
        className={`flex-1 overflow-hidden relative ${getCursorClass()}`}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onWheel={handleWheel}
      >
        <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '300px' }}>
          <svg
            ref={svgRef}
            width={svgWidth * zoom}
            height={svgHeight * zoom}
            viewBox={`${planBounds.minX * SCALE} ${planBounds.minY * SCALE} ${svgWidth} ${svgHeight}`}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              transition: isPanning || dragState ? 'none' : 'transform 0.2s ease',
            }}
            className="select-none"
          >
            {/* Grid */}
            {grid && (
              <g opacity="0.15">
                {Array.from({ length: Math.ceil(planBounds.width) + 1 }).map((_, i) => (
                  <line key={`gv-${i}`} x1={(planBounds.minX + i) * SCALE} y1={planBounds.minY * SCALE} x2={(planBounds.minX + i) * SCALE} y2={(planBounds.minY + planBounds.height) * SCALE} stroke="#94A3B8" strokeWidth="0.5" />
                ))}
                {Array.from({ length: Math.ceil(planBounds.height) + 1 }).map((_, i) => (
                  <line key={`gh-${i}`} x1={planBounds.minX * SCALE} y1={(planBounds.minY + i) * SCALE} x2={(planBounds.minX + planBounds.width) * SCALE} y2={(planBounds.minY + i) * SCALE} stroke="#94A3B8" strokeWidth="0.5" />
                ))}
              </g>
            )}

            {/* Property boundary outline */}
            {propertyBoundsRef.current && (
              <rect
                x={propertyBoundsRef.current.minX * SCALE}
                y={propertyBoundsRef.current.minY * SCALE}
                width={(propertyBoundsRef.current.maxX - propertyBoundsRef.current.minX) * SCALE}
                height={(propertyBoundsRef.current.maxY - propertyBoundsRef.current.minY) * SCALE}
                fill="none"
                stroke="#EF4444"
                strokeWidth={1.5}
                strokeDasharray="8,4"
                opacity={0.45}
                rx={3}
                className="pointer-events-none"
              />
            )}

            {/* Rooms */}
            {plan.rooms.map((room, i) => {
              const color = getColor(room.type);
              const isSelected = selectedRoom === room.id;
              const isDragging = dragState?.roomId === room.id;
              const rx = room.x * SCALE;
              const ry = room.y * SCALE;
              const rw = room.width * SCALE;
              const rh = room.height * SCALE;

              return (
                <g key={room.id || i}>
                  {/* Room fill */}
                  <rect
                    x={rx} y={ry} width={rw} height={rh}
                    fill={isDragging ? `${color.fill}CC` : color.fill}
                    stroke={isSelected ? '#10B981' : isDragging ? '#10B981' : color.stroke}
                    strokeWidth={isSelected || isDragging ? 3 : 2}
                    rx={2}
                    className={isInteractive ? 'cursor-move' : 'cursor-pointer'}
                    onMouseDown={(e) => {
                      if (isInteractive) handleRoomMouseDown(e, room);
                    }}
                    onClick={(e) => {
                      if (!dragState) {
                        e.stopPropagation();
                        onRoomClick?.(room);
                      }
                    }}
                  />

                  {/* Selected pattern overlay */}
                  {isSelected && !isDragging && (
                    <rect x={rx} y={ry} width={rw} height={rh} fill="url(#selectedPattern)" rx={2} className="pointer-events-none" />
                  )}

                  {/* Drag dashed outline */}
                  {isDragging && dragState.type === 'move' && (
                    <rect x={rx} y={ry} width={rw} height={rh} fill="none" stroke="#10B981" strokeWidth={1} strokeDasharray="6,3" rx={2} className="pointer-events-none" />
                  )}

                  {/* Room name */}
                  <text
                    x={rx + rw / 2} y={ry + rh / 2 - (dims ? 6 : 0)}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={Math.min(14, rw / 6)} fontWeight="600"
                    fill={color.stroke} className="pointer-events-none"
                    style={{ fontFamily: 'system-ui, sans-serif' }}
                  >
                    {room.name}
                  </text>

                  {/* Dimensions */}
                  {dims && (
                    <text
                      x={rx + rw / 2} y={ry + rh / 2 + 12}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize={Math.min(10, rw / 8)}
                      fill="#94A3B8" className="pointer-events-none"
                      style={{ fontFamily: 'system-ui, sans-serif' }}
                    >
                      {room.width}×{room.height}m ({(room.width * room.height).toFixed(1)}m²)
                    </text>
                  )}

                  {/* Move icon hint */}
                  {isInteractive && isSelected && !isDragging && rh > 60 && (
                    <g className="pointer-events-none" opacity={0.35}>
                      <circle cx={rx + rw / 2} cy={ry + rh - 16} r={8} fill="white" stroke="#10B981" strokeWidth={1} />
                      <g transform={`translate(${rx + rw / 2 - 4.5}, ${ry + rh - 20.5})`}>
                        <path d="M4.5 0L4.5 9M0 4.5L9 4.5M4.5 0L2.5 2M4.5 0L6.5 2M4.5 9L2.5 7M4.5 9L6.5 7M0 4.5L2 2.5M0 4.5L2 6.5M9 4.5L7 2.5M9 4.5L7 6.5" stroke="#10B981" strokeWidth={1} fill="none" />
                      </g>
                    </g>
                  )}

                  {/* ─── Resize Handles ─── */}
                  {isSelected && isInteractive && !isDragging && getHandlePositions(room).map((hp) => (
                    <rect
                      key={hp.id}
                      x={hp.x} y={hp.y}
                      width={HANDLE_SIZE} height={HANDLE_SIZE}
                      fill={hoveredHandle === `${room.id}-${hp.id}` ? '#10B981' : 'white'}
                      stroke="#10B981" strokeWidth={1.5} rx={1.5}
                      style={{ cursor: hp.cursor }}
                      onMouseDown={(e) => handleRoomMouseDown(e, room, hp.id)}
                      onMouseEnter={() => setHoveredHandle(`${room.id}-${hp.id}`)}
                      onMouseLeave={() => setHoveredHandle(null)}
                    />
                  ))}
                </g>
              );
            })}

            {/* Doors */}
            {plan.doors?.map((door, i) => {
              const dx = door.x * SCALE;
              const dy = door.y * SCALE;
              const isH = door.orientation === 'horizontal';
              const len = (door.width || 0.9) * SCALE;
              return (
                <g key={`door-${i}`} className="pointer-events-none">
                  <line x1={dx} y1={dy} x2={isH ? dx + len : dx} y2={isH ? dy : dy + len} stroke="#F59E0B" strokeWidth={4} strokeLinecap="round" />
                  <path
                    d={isH ? `M ${dx} ${dy} A ${len} ${len} 0 0 1 ${dx + len} ${dy}` : `M ${dx} ${dy} A ${len} ${len} 0 0 0 ${dx} ${dy + len}`}
                    fill="none" stroke="#F59E0B" strokeWidth={1} strokeDasharray="3,3" opacity={0.5}
                  />
                </g>
              );
            })}

            {/* Windows */}
            {plan.windows?.map((win, i) => {
              const wx = win.x * SCALE;
              const wy = win.y * SCALE;
              const isH = win.orientation === 'horizontal';
              const len = (win.width || 1.2) * SCALE;
              return (
                <g key={`win-${i}`} className="pointer-events-none">
                  <line x1={wx} y1={wy} x2={isH ? wx + len : wx} y2={isH ? wy : wy + len} stroke="#38BDF8" strokeWidth={5} strokeLinecap="round" />
                  <line x1={wx} y1={wy} x2={isH ? wx + len : wx} y2={isH ? wy : wy + len} stroke="white" strokeWidth={2} strokeLinecap="round" />
                </g>
              );
            })}

            {/* Outer dimension lines */}
            {dims && plan.rooms.length > 0 && (() => {
              let minRX = Infinity, minRY = Infinity, maxRX = -Infinity, maxRY = -Infinity;
              plan.rooms.forEach((rm) => {
                minRX = Math.min(minRX, rm.x);
                minRY = Math.min(minRY, rm.y);
                maxRX = Math.max(maxRX, rm.x + rm.width);
                maxRY = Math.max(maxRY, rm.y + rm.height);
              });
              const totalW = maxRX - minRX;
              const totalH = maxRY - minRY;
              const off = 25;
              return (
                <g className="pointer-events-none">
                  <line x1={minRX * SCALE} y1={minRY * SCALE - off} x2={maxRX * SCALE} y2={minRY * SCALE - off} stroke="#64748B" strokeWidth={1} />
                  <line x1={minRX * SCALE} y1={minRY * SCALE - off - 5} x2={minRX * SCALE} y2={minRY * SCALE - off + 5} stroke="#64748B" strokeWidth={1} />
                  <line x1={maxRX * SCALE} y1={minRY * SCALE - off - 5} x2={maxRX * SCALE} y2={minRY * SCALE - off + 5} stroke="#64748B" strokeWidth={1} />
                  <text x={(minRX + totalW / 2) * SCALE} y={minRY * SCALE - off - 8} textAnchor="middle" fontSize={10} fill="#64748B" fontWeight="600" style={{ fontFamily: 'system-ui' }}>
                    {totalW.toFixed(1)}m
                  </text>
                  <line x1={minRX * SCALE - off} y1={minRY * SCALE} x2={minRX * SCALE - off} y2={maxRY * SCALE} stroke="#64748B" strokeWidth={1} />
                  <line x1={minRX * SCALE - off - 5} y1={minRY * SCALE} x2={minRX * SCALE - off + 5} y2={minRY * SCALE} stroke="#64748B" strokeWidth={1} />
                  <line x1={minRX * SCALE - off - 5} y1={maxRY * SCALE} x2={minRX * SCALE - off + 5} y2={maxRY * SCALE} stroke="#64748B" strokeWidth={1} />
                  <text x={minRX * SCALE - off - 8} y={(minRY + totalH / 2) * SCALE} textAnchor="middle" fontSize={10} fill="#64748B" fontWeight="600" style={{ fontFamily: 'system-ui' }} transform={`rotate(-90, ${minRX * SCALE - off - 8}, ${(minRY + totalH / 2) * SCALE})`}>
                    {totalH.toFixed(1)}m
                  </text>
                </g>
              );
            })()}

            <defs>
              <pattern id="selectedPattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#10B981" strokeWidth="0.5" opacity="0.15" />
              </pattern>
            </defs>
          </svg>
        </div>

        {/* Help tooltip */}
        {isInteractive && !dragState && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 shadow-sm">
            <MousePointer2 className="w-3 h-3 text-slate-400" />
            <span className="text-[9px] text-slate-400">
              Click = seleccionar · Arrastrar = mover · Handles = redimensionar · Del = eliminar
            </span>
          </div>
        )}
      </div>

      {/* ═══ Info Bar ═══ */}
      {plan.rooms.length > 0 && (
        <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span>{plan.rooms.length} ambientes</span>
            <span>·</span>
            <span>{plan.rooms.reduce((s, rm) => s + rm.width * rm.height, 0).toFixed(0)} m² totales</span>
            {propertyBoundsRef.current && (
              <>
                <span>·</span>
                <span className="text-red-400/70">
                  Límite: {rd(propertyBoundsRef.current.maxX - propertyBoundsRef.current.minX)}×{rd(propertyBoundsRef.current.maxY - propertyBoundsRef.current.minY)}m
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="inline-block w-3 h-0.5 bg-amber-400 rounded" /> Puerta
            <span className="inline-block w-3 h-0.5 bg-sky-400 rounded ml-2" /> Ventana
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlanRenderer;
