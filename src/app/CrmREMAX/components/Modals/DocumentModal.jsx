// components/DocumentModal.js
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Search, X, ExternalLink } from 'lucide-react';

export default function DocumentModal({ open, onClose, documents = [], telefono, fetchArchivos, showToast }) {
  const [search, setSearch] = useState('');
  const [docs, setDocs] = useState(documents);

  // Actualiza docs si cambia la prop
  useEffect(() => {
    setDocs(documents);
  }, [documents]);

  // Filtrar los documentos según el nombre
  const filteredDocs = docs.map(d => {
    let nombreBase = d.nombre || d.name || '';
    if (!nombreBase && d.url) {
      try {
        const urlPath = d.url.split('?')[0];
        nombreBase = urlPath.substring(urlPath.lastIndexOf('/') + 1) || 'archivo';
      } catch { nombreBase = 'archivo'; }
    }
    return { ...d, nombre: nombreBase };
  }).filter((doc) => {
    const nombre = (doc.nombre || '').toLowerCase();
    return nombre.includes(search.toLowerCase());
  });

  // Función para abrir archivo en nueva pestaña
  const handleOpenFile = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Cuando se cierre el modal, recarga la lista si hay función fetchArchivos
  useEffect(() => {
    if (!open && typeof fetchArchivos === 'function') {
      fetchArchivos();
    }
  }, [open, fetchArchivos]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[85vh] flex flex-col bg-white border-0 shadow-2xl p-0">
        {/* Header minimalista con título oculto pero accesible */}
        <DialogTitle className="sr-only">Documentos Compartidos</DialogTitle>
        
        {/* Barra superior compacta con buscador y cerrar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50/50 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar archivos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 py-2 bg-white border-gray-200 rounded-lg text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => onClose(false)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            title="Cerrar"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Lista de archivos minimalista */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {filteredDocs.length > 0 ? (
            <div className="space-y-2">
              {filteredDocs.map((doc, idx) => {
                const fileUrl = doc.url;
                const fileName = doc.nombre || doc.name || '';
                const fileExtension = fileName.split('.').pop()?.toLowerCase();
                
                // Determinar icono según tipo de archivo
                let icon = '📎';
                let iconColor = 'bg-gray-100 text-gray-600';
                
                if (fileUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
                  icon = '🖼️';
                  iconColor = 'bg-blue-50 text-blue-600';
                } else if (fileUrl.match(/\.pdf$/i)) {
                  icon = '📄';
                  iconColor = 'bg-red-50 text-red-600';
                } else if (['doc', 'docx'].includes(fileExtension)) {
                  icon = '📝';
                  iconColor = 'bg-indigo-50 text-indigo-600';
                } else if (['xls', 'xlsx'].includes(fileExtension)) {
                  icon = '📊';
                  iconColor = 'bg-green-50 text-green-600';
                } else if (['ppt', 'pptx'].includes(fileExtension)) {
                  icon = '📈';
                  iconColor = 'bg-orange-50 text-orange-600';
                } else if (['zip', 'rar'].includes(fileExtension)) {
                  icon = '🗜️';
                  iconColor = 'bg-purple-50 text-purple-600';
                }

                return (
                  <button
                    key={doc.url + (doc.nombre || doc.name || idx)}
                    onClick={() => handleOpenFile(doc.url)}
                    className="w-full group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md"
                  >
                    {/* Icono del archivo */}
                    <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center text-xl shrink-0`}>
                      {icon}
                    </div>
                    
                    {/* Información del archivo */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {fileName}
                      </p>
                      {doc.fecha && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(doc.fecha).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                    
                    {/* Icono de abrir */}
                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-indigo-500" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl opacity-50">📁</span>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-1">No hay archivos</h3>
              <p className="text-sm text-gray-500 text-center">
                {search
                  ? `No se encontraron archivos con "${search}"`
                  : 'No hay documentos compartidos en este chat'
                }
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
