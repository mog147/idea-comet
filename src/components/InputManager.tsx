import { useState, useRef } from 'react';
import { Sparkles, Trash2, Wind, Anchor, ArrowUp } from 'lucide-react';
import { COMET_COLORS } from '../types';

interface Props {
  onSubmit: (text: string, color?: string) => void;
  cometCount: number;
  onClearAll: () => void;
  drifting: boolean;
  onToggleDrift: () => void;
}

export default function InputManager({ onSubmit, cometCount, onClearAll, drifting, onToggleDrift }: Props) {
  const [value, setValue] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(COMET_COLORS[0].value);
  const [showColors, setShowColors] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const text = value.trim();
    if (!text) return;
    onSubmit(text, selectedColor);
    setValue('');
    setShowColors(false);
    inputRef.current?.focus();
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-6" style={{ bottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
      {cometCount > 0 && (
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs text-comet-dim/50">{cometCount} comets</span>
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleDrift}
              className="text-xs text-comet-dim/30 hover:text-comet-dim/60 transition-colors flex items-center gap-1"
            >
              {drifting ? <Wind size={10} /> : <Anchor size={10} />}
              {drifting ? 'drifting' : 'pinned'}
            </button>
            <button
              onClick={onClearAll}
              className="text-xs text-comet-dim/30 hover:text-comet-dim/60 transition-colors flex items-center gap-1"
            >
              <Trash2 size={10} />
              clear
            </button>
          </div>
        </div>
      )}
      {showColors && (
        <div className="flex items-center justify-center gap-3 mb-3">
          {COMET_COLORS.map(c => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c.value)}
              className="w-6 h-6 rounded-full transition-transform"
              style={{
                background: c.value,
                opacity: selectedColor === c.value ? 1 : 0.3,
                transform: selectedColor === c.value ? 'scale(1.2)' : 'scale(1)',
                boxShadow: selectedColor === c.value ? `0 0 8px ${c.value}40` : 'none',
              }}
            />
          ))}
        </div>
      )}
      <div className="flex items-center gap-3 bg-space-800/60 backdrop-blur-md border border-white/5 rounded-full px-5 py-3">
        <button onClick={() => setShowColors(prev => !prev)} className="shrink-0">
          <Sparkles size={16} style={{ color: selectedColor }} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="思いつきを放つ..."
          className="flex-1 bg-transparent outline-none text-sm text-comet placeholder:text-comet-dim/50"
        />
        {value.trim() && (
          <button onClick={handleSubmit} className="shrink-0 w-7 h-7 rounded-full bg-comet-dim/20 flex items-center justify-center hover:bg-comet-dim/30 transition-colors">
            <ArrowUp size={14} className="text-comet" />
          </button>
        )}
      </div>
    </div>
  );
}
