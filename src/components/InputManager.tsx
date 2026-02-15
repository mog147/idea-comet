import { useState, useRef } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';

interface Props {
  onSubmit: (text: string) => void;
  cometCount: number;
  onClearAll: () => void;
}

export default function InputManager({ onSubmit, cometCount, onClearAll }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const text = value.trim();
    if (!text) return;
    onSubmit(text);
    setValue('');
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-6" style={{ bottom: 'calc(8px + env(safe-area-inset-bottom, 0px))' }}>
      {cometCount > 0 && (
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs text-comet-dim/50">{cometCount} comets</span>
          <button
            onClick={onClearAll}
            className="text-xs text-comet-dim/30 hover:text-comet-dim/60 transition-colors flex items-center gap-1"
          >
            <Trash2 size={10} />
            clear
          </button>
        </div>
      )}
      <div className="flex items-center gap-3 bg-space-800/60 backdrop-blur-md border border-white/5 rounded-full px-5 py-3">
        <Sparkles size={16} className="text-comet-dim shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="思いつきを放つ..."
          className="flex-1 bg-transparent outline-none text-sm text-comet placeholder:text-comet-dim/50"
        />
      </div>
    </div>
  );
}
