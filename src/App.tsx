import { useState, useCallback, useEffect } from 'react';
import type { CometData } from './types';
import SpaceCanvas from './components/SpaceCanvas';
import InputManager from './components/InputManager';
import StarField from './components/StarField';
import ListView from './components/ListView';
import { List } from 'lucide-react';

const STORAGE_KEY = 'idea-comet-data';

function loadComets(): CometData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as CometData[];
    const w = window.innerWidth;
    const h = window.innerHeight;
    return data.map(c => ({
      ...c,
      x: Math.max(20, Math.min(w - 20, c.x)),
      y: Math.max(40, Math.min(h - 120, c.y)),
    }));
  } catch {
    return [];
  }
}

function App() {
  const [comets, setComets] = useState<CometData[]>(loadComets);
  const [drifting, setDrifting] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  // Persist on change (throttled)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comets.map(c => ({
        id: c.id,
        text: c.text,
        x: c.x,
        y: c.y,
        vx: 0,
        vy: 0,
        createdAt: c.createdAt,
        color: c.color,
      }))));
    }, 500);
    return () => clearTimeout(timer);
  }, [comets]);

  const addComet = useCallback((text: string, color?: string) => {
    const comet: CometData = {
      id: crypto.randomUUID(),
      text,
      x: 40 + Math.random() * (window.innerWidth - 80),
      y: 80 + Math.random() * (window.innerHeight * 0.55),
      vx: drifting ? (Math.random() - 0.5) * 0.6 : 0,
      vy: drifting ? (Math.random() - 0.5) * 0.6 : 0,
      createdAt: new Date().toISOString(),
      color,
    };
    setComets(prev => [...prev, comet]);
  }, [drifting]);

  const updateCometText = useCallback((id: string, text: string) => {
    setComets(prev => prev.map(c => c.id === id ? { ...c, text } : c));
  }, []);

  const removeComet = useCallback((id: string) => {
    setComets(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateComet = useCallback((id: string, x: number, y: number, vx = 0, vy = 0) => {
    setComets(prev => prev.map(c => c.id === id ? { ...c, x, y, vx, vy } : c));
  }, []);

  const toggleDrift = useCallback(() => {
    setDrifting(prev => {
      const next = !prev;
      if (next) {
        // Give all stationary comets a gentle drift
        setComets(cs => cs.map(c => c.vx === 0 && c.vy === 0
          ? { ...c, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 }
          : c
        ));
      }
      return next;
    });
  }, []);

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-space-950 via-space-900 to-space-950">
      <StarField />
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5" style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}>
        <h1 className="text-sm font-light tracking-[0.2em] text-comet-dim/40">IDEA COMET</h1>
        {comets.length > 0 && (
          <button onClick={() => setListOpen(true)} className="text-comet-dim/30 hover:text-comet-dim/60 transition-colors">
            <List size={18} />
          </button>
        )}
      </header>
      {comets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-3">
            <p className="text-comet-dim/25 text-base font-light">思いつきを宇宙に放とう</p>
            <div className="text-comet-dim/15 text-xs space-y-1">
              <p>入力して Enter で追加</p>
              <p>ドラッグで移動 ・ 長押しで消す</p>
              <p>ダブルタップで編集</p>
            </div>
          </div>
        </div>
      )}
      <SpaceCanvas
        comets={comets}
        setComets={setComets}
        onRemove={removeComet}
        onUpdate={updateCometText}
        onDragEnd={updateComet}
        drifting={drifting}
      />
      <InputManager
        onSubmit={addComet}
        cometCount={comets.length}
        onClearAll={() => setComets([])}
        drifting={drifting}
        onToggleDrift={toggleDrift}
      />
      {listOpen && (
        <ListView comets={comets} onClose={() => setListOpen(false)} onRemove={removeComet} />
      )}
    </div>
  );
}

export default App;
