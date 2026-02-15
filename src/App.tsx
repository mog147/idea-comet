import { useState, useCallback, useEffect } from 'react';
import type { CometData } from './types';
import SpaceCanvas from './components/SpaceCanvas';
import InputManager from './components/InputManager';
import StarField from './components/StarField';

const STORAGE_KEY = 'idea-comet-data';

function loadComets(): CometData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CometData[];
  } catch {
    return [];
  }
}

function App() {
  const [comets, setComets] = useState<CometData[]>(loadComets);
  const [drifting, setDrifting] = useState(false);

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
      }))));
    }, 500);
    return () => clearTimeout(timer);
  }, [comets]);

  const addComet = useCallback((text: string, color?: string) => {
    const comet: CometData = {
      id: crypto.randomUUID(),
      text,
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 2 + (Math.random() - 0.5) * 100,
      vx: drifting ? (Math.random() - 0.5) * 0.6 : 0,
      vy: drifting ? (Math.random() - 0.5) * 0.6 : 0,
      createdAt: new Date().toISOString(),
      color,
    };
    setComets(prev => [...prev, comet]);
  }, [drifting]);

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
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pointer-events-none" style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}>
        <h1 className="text-sm font-light tracking-[0.2em] text-comet-dim/40">IDEA COMET</h1>
      </header>
      {comets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-comet-dim/20 text-sm">思いつきを入力して、宇宙に放とう</p>
            <p className="text-comet-dim/15 text-xs mt-2">長押しで消す ・ ドラッグで移動</p>
          </div>
        </div>
      )}
      <SpaceCanvas
        comets={comets}
        setComets={setComets}
        onRemove={removeComet}
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
    </div>
  );
}

export default App;
