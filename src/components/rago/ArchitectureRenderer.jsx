'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paintbrush,
  Camera,
  Layers,
  TreePine,
  Sparkles,
  Download,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
  ZoomIn,
  Image as ImageIcon,
  Palette,
  Wand2,
  History,
  AlertCircle,
  Eye,
  Maximize2,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  ARCHITECTURE_STYLES,
  CAMERA_VIEWS,
  QUALITY_PRESETS,
  FINISHING_MATERIALS,
  ENVIRONMENTS,
} from '@/lib/architectureStyles';

// ═══════════════════════════════════════════════════════════════
// ArchitectureRenderer — Panel de generación de renders tipo OpenArt.ai
// ═══════════════════════════════════════════════════════════════

const ArchitectureRenderer = ({ plan, onClose }) => {
  // ─── State ───
  const [selectedStyle, setSelectedStyle] = useState('moderno');
  const [selectedView, setSelectedView] = useState('exterior_frontal');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState('suburbano');
  const [selectedQuality, setSelectedQuality] = useState('hd');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // Gallery
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Panels
  const [activePanel, setActivePanel] = useState('style'); // style | view | materials | environment | prompt
  const [showAdvanced, setShowAdvanced] = useState(false);

  const galleryRef = useRef(null);

  // ─── Generate Render ───
  const generateRender = useCallback(async (mode = 'render') => {
    if (!plan?.rooms?.length) {
      setError('Necesitás tener un plano diseñado primero.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    // Simular progreso visual
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 800);

    try {
      const res = await fetch('/api/rago/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          styleId: selectedStyle,
          viewId: selectedView,
          materialIds: selectedMaterials,
          environmentId: selectedEnvironment,
          qualityId: selectedQuality,
          customPrompt,
          mode,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${res.status}`);
      }

      const data = await res.json();

      const newImage = {
        id: Date.now(),
        url: data.imageUrl,
        metadata: data.metadata,
        revisedPrompt: data.revisedPrompt,
        timestamp: new Date(),
      };

      setGallery(prev => [newImage, ...prev]);
      setSelectedImage(newImage);

      // Scroll to gallery
      setTimeout(() => {
        galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    } catch (err) {
      setError(err.message || 'Error al generar el render.');
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [plan, selectedStyle, selectedView, selectedMaterials, selectedEnvironment, selectedQuality, customPrompt]);

  // ─── Toggle material ───
  const toggleMaterial = (id) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  // ─── Download image ───
  const downloadImage = async (image) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rago-render-${image.metadata?.style || 'arquitectura'}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(image.url, '_blank');
    }
  };

  // ─── Panel content ───
  const panels = {
    style: {
      icon: Paintbrush,
      label: 'Estilo',
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ARCHITECTURE_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`group relative p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                selectedStyle === style.id
                  ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{style.emoji}</span>
                <span className={`text-xs font-bold ${selectedStyle === style.id ? 'text-emerald-700' : 'text-slate-700'}`}>
                  {style.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                {style.description}
              </p>
              {selectedStyle === style.id && (
                <motion.div
                  layoutId="styleIndicator"
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"
                />
              )}
            </button>
          ))}
        </div>
      ),
    },
    view: {
      icon: Camera,
      label: 'Vista',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {CAMERA_VIEWS.map(view => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                selectedView === view.id
                  ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
              }`}
            >
              <span className="text-xl flex-shrink-0">{view.icon}</span>
              <span className={`text-xs font-semibold ${selectedView === view.id ? 'text-emerald-700' : 'text-slate-700'}`}>
                {view.label}
              </span>
            </button>
          ))}
        </div>
      ),
    },
    materials: {
      icon: Layers,
      label: 'Materiales',
      content: (
        <div className="space-y-2">
          <p className="text-[10px] text-slate-400 mb-2">Seleccioná uno o más materiales de acabado</p>
          <div className="grid grid-cols-2 gap-2">
            {FINISHING_MATERIALS.map(mat => (
              <button
                key={mat.id}
                onClick={() => toggleMaterial(mat.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedMaterials.includes(mat.id)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedMaterials.includes(mat.id)
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-slate-300'
                }`}>
                  {selectedMaterials.includes(mat.id) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs font-medium ${selectedMaterials.includes(mat.id) ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {mat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    environment: {
      icon: TreePine,
      label: 'Entorno',
      content: (
        <div className="grid grid-cols-2 gap-2">
          {ENVIRONMENTS.map(env => (
            <button
              key={env.id}
              onClick={() => setSelectedEnvironment(env.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                selectedEnvironment === env.id
                  ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-500/10'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
              }`}
            >
              <span className={`text-xs font-semibold ${selectedEnvironment === env.id ? 'text-emerald-700' : 'text-slate-700'}`}>
                {env.label}
              </span>
            </button>
          ))}
        </div>
      ),
    },
    prompt: {
      icon: Wand2,
      label: 'Custom',
      content: (
        <div className="space-y-3">
          <p className="text-[10px] text-slate-400">
            Agregá detalles extra al prompt de generación (opcional)
          </p>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ej: piscina infinity en el jardín, jardín vertical en la fachada, iluminación cálida LED..."
            className="w-full h-24 px-3 py-2 text-sm border border-slate-200 rounded-xl resize-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 outline-none transition-all text-slate-700 placeholder:text-slate-300"
          />
          <div className="flex flex-wrap gap-1.5">
            {['Piscina infinity', 'Jardín vertical', 'Techo verde', 'Pérgola con enredadera', 'Iluminación LED', 'Deck de madera'].map(tag => (
              <button
                key={tag}
                onClick={() => setCustomPrompt(prev => prev ? `${prev}, ${tag.toLowerCase()}` : tag.toLowerCase())}
                className="text-[10px] px-2 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-full border border-slate-200 hover:border-emerald-300 transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      ),
    },
  };

  const currentStyle = ARCHITECTURE_STYLES.find(s => s.id === selectedStyle);
  const currentView = CAMERA_VIEWS.find(v => v.id === selectedView);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Render Arquitectónico</h2>
            <p className="text-[10px] text-slate-400">Visualización IA con DALL-E 3</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {gallery.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-600 font-semibold rounded-full border border-purple-200">
              {gallery.length} render{gallery.length > 1 ? 's' : ''}
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ═══ Main Content (scrollable) ═══ */}
      <div className="flex-1 overflow-y-auto">
        {/* ─── Current Selection Summary ─── */}
        <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600 font-medium">
              {currentStyle?.emoji} {currentStyle?.label}
            </span>
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600 font-medium">
              {currentView?.icon} {currentView?.label}
            </span>
            {selectedMaterials.length > 0 && (
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600 font-medium">
                🧱 {selectedMaterials.length} material{selectedMaterials.length > 1 ? 'es' : ''}
              </span>
            )}
            <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600 font-medium">
              {QUALITY_PRESETS.find(q => q.id === selectedQuality)?.label || 'HD'}
            </span>
          </div>
        </div>

        {/* ─── Control Panels ─── */}
        <div className="px-4 py-3 space-y-3">
          {/* Panel tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {Object.entries(panels).map(([key, panel]) => {
              const Icon = panel.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActivePanel(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                    activePanel === key
                      ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {panel.label}
                </button>
              );
            })}
          </div>

          {/* Active panel content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {panels[activePanel]?.content}
            </motion.div>
          </AnimatePresence>

          {/* ─── Advanced options toggle ─── */}
          <button
            onClick={() => setShowAdvanced(v => !v)}
            className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Opciones avanzadas
          </button>

          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              {/* Quality selector */}
              <div>
                <label className="text-[10px] font-semibold text-slate-500 mb-1.5 block">Calidad / Resolución</label>
                <div className="flex gap-2">
                  {QUALITY_PRESETS.map(q => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuality(q.id)}
                      className={`flex-1 p-2 rounded-lg border-2 text-center transition-all ${
                        selectedQuality === q.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className={`text-[11px] font-bold ${selectedQuality === q.id ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {q.label}
                      </div>
                      <div className="text-[9px] text-slate-400">{q.size}</div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ═══ Generate Buttons ═══ */}
        <div className="px-4 py-3 border-t border-slate-100 space-y-2">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-600">{error}</p>
            </motion.div>
          )}

          {/* Progress bar */}
          {loading && (
            <div className="space-y-1.5">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-[10px] text-center text-slate-400">
                {progress < 30 ? '🎨 Componiendo escena...' :
                 progress < 60 ? '🏗️ Generando arquitectura...' :
                 progress < 90 ? '✨ Aplicando detalles finales...' :
                 '📸 Finalizando render...'}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => generateRender('render')}
              disabled={loading || !plan?.rooms?.length}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? 'Generando...' : 'Generar Render'}
            </button>

            <button
              onClick={() => generateRender('blueprint')}
              disabled={loading || !plan?.rooms?.length}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition-all disabled:opacity-40"
              title="Generar plano técnico"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Plano</span>
            </button>
          </div>

          {!plan?.rooms?.length && (
            <p className="text-[10px] text-center text-amber-500">
              ⚠️ Diseñá un plano primero en el chat para generar renders
            </p>
          )}
        </div>

        {/* ═══ Gallery ═══ */}
        <div ref={galleryRef} className="px-4 py-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Galería de Renders</span>
            </div>
            {gallery.length > 0 && (
              <button
                onClick={() => { setGallery([]); setSelectedImage(null); }}
                className="text-[10px] text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Limpiar
              </button>
            )}
          </div>

          {gallery.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-7 h-7 text-purple-300" />
              </div>
              <p className="text-xs text-slate-400 mb-1">Sin renders todavía</p>
              <p className="text-[10px] text-slate-300">Generá tu primer render arquitectónico</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {gallery.map((img) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedImage?.id === img.id
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.url}
                    alt={`Render ${img.metadata?.style}`}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-[9px] text-white/80 font-medium truncate">
                        {img.metadata?.style} · {img.metadata?.view}
                      </p>
                    </div>
                    <div className="absolute top-1.5 right-1.5 flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(img); setLightboxOpen(true); }}
                        className="p-1 bg-black/40 backdrop-blur-sm rounded-md hover:bg-black/60 transition-colors"
                      >
                        <ZoomIn className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadImage(img); }}
                        className="p-1 bg-black/40 backdrop-blur-sm rounded-md hover:bg-black/60 transition-colors"
                      >
                        <Download className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ═══ Selected Image Detail ═══ */}
        {selectedImage && (
          <div className="px-4 py-3 border-t border-slate-100">
            <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
              <img
                src={selectedImage.url}
                alt="Render seleccionado"
                className="w-full aspect-video object-cover cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-[10px] text-slate-400">
                {selectedImage.metadata?.style} · {selectedImage.metadata?.view} · {selectedImage.metadata?.quality}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="Ver en grande"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => downloadImage(selectedImage)}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Descargar"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => generateRender('render')}
                  disabled={loading}
                  className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-40"
                  title="Generar variación"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {selectedImage.revisedPrompt && (
              <details className="mt-2">
                <summary className="text-[10px] text-slate-400 cursor-pointer hover:text-slate-600">
                  Ver prompt utilizado
                </summary>
                <p className="text-[10px] text-slate-400 mt-1 p-2 bg-slate-50 rounded-lg leading-relaxed">
                  {selectedImage.revisedPrompt}
                </p>
              </details>
            )}
          </div>
        )}
      </div>

      {/* ═══ Lightbox ═══ */}
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt="Render"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => downloadImage(selectedImage)}
                  className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="p-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-center">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white text-xs text-center">
                  {selectedImage.metadata?.style} · {selectedImage.metadata?.view} · {selectedImage.metadata?.size}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchitectureRenderer;
