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
    <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-8" style={{ bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}>
      {cometCount > 0 && (
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[11px] text-comet-dim/35 tracking-wide">{cometCount} comets</span>
          <div className="flex items-center gap-5">
            <button
              onClick={onToggleDrift}
              className="text-[11px] text-comet-dim/25 hover:text-comet-dim/50 transition-colors flex items-center gap-1.5"
            >
              {drifting ? <Wind size={10} /> : <Anchor size={10} />}
              {drifting ? 'drifting' : 'pinned'}
            </button>
            <button
              onClick={onClearAll}
              className="text-[11px] text-comet-dim/25 hover:text-comet-dim/50 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={10} />
              clear
            </button>
          </div>
        </div>
      )}
      {showColors && (
        <div className="flex items-center justify-center gap-4 mb-5">
          {COMET_COLORS.map(c => (
            <button
              key={c.name}
              onClick={() => setSelectedColor(c.value)}
              className="w-5 h-5 rounded-full transition-all duration-200"
              style={{
                background: c.value,
                opacity: selectedColor === c.value ? 1 : 0.25,
                transform: selectedColor === c.value ? 'scale(1.3)' : 'scale(1)',
                boxShadow: selectedColor === c.value ? `0 0 12px ${c.value}30` : 'none',
              }}
            />
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 bg-space-800/50 backdrop-blur-md border border-white/[0.04] rounded-full px-6 py-3.5">
        <button onClick={() => setShowColors(prev => !prev)} className="shrink-0 p-0.5">
          <Sparkles size={15} style={{ color: selectedColor, opacity: 0.7 }} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="思いつきを放つ..."
          className="flex-1 bg-transparent outline-none text-[13px] text-comet placeholder:text-comet-dim/35 tracking-wide"
        />
        {value.trim() && (
          <button onClick={handleSubmit} className="shrink-0 w-7 h-7 rounded-full bg-comet-dim/15 flex items-center justify-center hover:bg-comet-dim/25 transition-colors">
            <ArrowUp size={13} className="text-comet/70" />
          </button>
        )}
      </div>
    </div>
  );
}
