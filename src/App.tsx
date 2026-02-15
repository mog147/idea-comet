import { useState, useCallback } from 'react';
import type { CometData } from './types';
import SpaceCanvas from './components/SpaceCanvas';
import InputManager from './components/InputManager';
import StarField from './components/StarField';

function App() {
  const [comets, setComets] = useState<CometData[]>([]);

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
