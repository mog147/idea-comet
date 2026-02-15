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
    const data = JSON.parse(raw) as CometData[];
    // Give restored comets a gentle drift
    return data.map(c => ({
      ...c,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  } catch {
    return [];
  }
}

function App() {
  const [comets, setComets] = useState<CometData[]>(loadComets);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comets.map(c => ({
      id: c.id,
      text: c.text,
      x: c.x,
      y: c.y,
      vx: 0,
      vy: 0,
    }))));
  }, [comets]);

  const addComet = useCallback((text: string) => {
    const comet: CometData = {
      id: crypto.randomUUID(),
      text,
      x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
      y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    };
    setComets(prev => [...prev, comet]);
  }, []);

  const removeComet = useCallback((id: string) => {
    setComets(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateComet = useCallback((id: string, x: number, y: number) => {
    setComets(prev => prev.map(c => c.id === id ? { ...c, x, y, vx: 0, vy: 0 } : c));
  }, []);

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-space-950 via-space-900 to-space-950">
      <StarField />
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-4 pointer-events-none" style={{ paddingTop: 'calc(16px + env(safe-area-inset-top, 0px))' }}>
        <h1 className="text-sm font-light tracking-[0.2em] text-comet-dim/40">IDEA COMET</h1>
      </header>
      {comets.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-comet-dim/20 text-sm">思いつきを入力して、宇宙に放とう</p>
        </div>
      )}
      <SpaceCanvas
        comets={comets}
        setComets={setComets}
        onRemove={removeComet}
        onDragEnd={updateComet}
      />
      <InputManager onSubmit={addComet} cometCount={comets.length} onClearAll={() => setComets([])} />
    </div>
  );
}

export default App;
