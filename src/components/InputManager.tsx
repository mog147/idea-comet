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
    <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-10" style={{ bottom: 'calc(32px + env(safe-area-inset-bottom, 0px))' }}>
      {cometCount > 0 && (
        <div className="flex items-center justify-between mb-6 px-2">
          <span className="text-[10px] text-comet-dim/25 tracking-widest">{cometCount} comets</span>
          <div className="flex items-center gap-6">
            <button
              onClick={onToggleDrift}
              className="text-[10px] text-comet-dim/20 hover:text-comet-dim/40 transition-colors flex items-center gap-2 tracking-wide"
            >
              {drifting ? <Wind size={10} /> : <Anchor size={10} />}
              {drifting ? 'drifting' : 'pinned'}
            </button>
            <button
              onClick={onClearAll}
              className="text-[10px] text-comet-dim/20 hover:text-comet-dim/40 transition-colors flex items-center gap-2 tracking-wide"
            >
              <Trash2 size={10} />
              clear
            </button>
          </div>
        </div>
      )}
      {showColors && (
        <div className="flex items-center justify-center gap-5 mb-7">
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
      <div className="flex items-center gap-5 bg-space-800/35 backdrop-blur-md border border-white/[0.03] rounded-full px-7 py-4">
        <button onClick={() => setShowColors(prev => !prev)} className="shrink-0 p-1">
          <Sparkles size={14} style={{ color: selectedColor, opacity: 0.6 }} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="思いつきを放つ..."
          className="flex-1 bg-transparent outline-none text-[13px] text-comet placeholder:text-comet-dim/25 tracking-widest"
        />
        {value.trim() && (
          <button onClick={handleSubmit} className="shrink-0 w-8 h-8 rounded-full bg-comet-dim/10 flex items-center justify-center hover:bg-comet-dim/20 transition-colors">
            <ArrowUp size={13} className="text-comet/60" />
          </button>
        )}
      </div>
    </div>
  );
}
