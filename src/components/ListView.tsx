import { X } from 'lucide-react';
import type { CometData } from '../types';

interface Props {
  comets: CometData[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

function formatTime(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ListView({ comets, onClose, onRemove }: Props) {
  const sorted = [...comets].sort((a, b) =>
    (b.createdAt || '').localeCompare(a.createdAt || '')
  );

  return (
    <div className="absolute inset-0 z-20 bg-space-950/95 backdrop-blur-md flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-3" style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}>
        <h2 className="text-sm font-light tracking-[0.15em] text-comet-dim/60">ALL COMETS</h2>
        <button onClick={onClose} className="text-comet-dim/40 hover:text-comet-dim/80 transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-8" style={{ touchAction: 'pan-y' }}>
        {sorted.length === 0 ? (
          <p className="text-comet-dim/20 text-sm text-center mt-20">まだコメットがありません</p>
        ) : (
          <div className="space-y-2">
            {sorted.map(c => (
              <div
                key={c.id}
                className="flex items-start gap-3 py-3 border-b border-white/5 group"
              >
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: c.color || '#e2e8f0' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-comet break-words">{c.text}</p>
                  <p className="text-[10px] text-comet-dim/30 mt-1">{formatTime(c.createdAt)}</p>
                </div>
                <button
                  onClick={() => onRemove(c.id)}
                  className="text-comet-dim/0 group-hover:text-comet-dim/30 hover:!text-comet-dim/60 transition-colors shrink-0 mt-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
