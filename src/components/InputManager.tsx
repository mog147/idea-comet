import { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  onSubmit: (text: string) => void;
}

export default function InputManager({ onSubmit }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const text = value.trim();
    if (!text) return;
    onSubmit(text);
    setValue('');
  };

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
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
