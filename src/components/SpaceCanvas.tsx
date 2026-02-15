import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { CometData } from '../types';
import Comet from './Comet';
import ConstellationLines from './ConstellationLines';

interface Props {
  comets: CometData[];
  setComets: React.Dispatch<React.SetStateAction<CometData[]>>;
  onRemove: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number, vx?: number, vy?: number) => void;
  drifting: boolean;
}

export default function SpaceCanvas({ comets, setComets, onRemove, onDragEnd, drifting }: Props) {
  const rafRef = useRef<number>(0);
  const driftingRef = useRef(drifting);

  useEffect(() => {
    driftingRef.current = drifting;
  }, [drifting]);

  const tick = useCallback(() => {
    if (driftingRef.current) {
      setComets(prev => prev.map(c => {
        if (c.vx === 0 && c.vy === 0) return c;

        let nx = c.x + c.vx;
        let ny = c.y + c.vy;

        const w = window.innerWidth;
        const h = window.innerHeight;
        if (nx < -50) nx = w + 50;
        if (nx > w + 50) nx = -50;
        if (ny < -50) ny = h + 50;
        if (ny > h + 50) ny = -50;

        return { ...c, x: nx, y: ny };
      }));
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [setComets]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  return (
    <div className="absolute inset-0">
      <ConstellationLines comets={comets} />
      <AnimatePresence>
        {comets.map(c => (
          <Comet key={c.id} comet={c} onRemove={onRemove} onDragEnd={onDragEnd} />
        ))}
      </AnimatePresence>
    </div>
  );
}
