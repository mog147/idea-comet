import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { CometData } from '../types';

interface Props {
  comet: CometData;
  onRemove: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number, vx?: number, vy?: number) => void;
}

export default function Comet({ comet, onRemove, onDragEnd }: Props) {
  const [melting, setMelting] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging = useRef(false);

  const startMelt = () => {
    longPressTimer.current = setTimeout(() => {
      if (!isDragging.current) {
        setMelting(true);
        setTimeout(() => onRemove(comet.id), 600);
      }
    }, 800);
  };

  const cancelMelt = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{ left: comet.x, top: comet.y, x: '-50%', y: '-50%' }}
      drag
      dragMomentum={false}
      onDragStart={() => { isDragging.current = true; cancelMelt(); }}
      onDragEnd={(_, info) => {
        isDragging.current = false;
        // Give a gentle drift based on drag velocity
        const vx = Math.max(-1, Math.min(1, info.velocity.x * 0.003));
        const vy = Math.max(-1, Math.min(1, info.velocity.y * 0.003));
        onDragEnd(comet.id, comet.x + info.offset.x, comet.y + info.offset.y, vx, vy);
      }}
      onDoubleClick={() => onRemove(comet.id)}
      onPointerDown={startMelt}
      onPointerUp={cancelMelt}
      onPointerLeave={cancelMelt}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={melting ? {
        opacity: 0,
        scale: 0,
        filter: 'blur(16px)',
      } : {
        opacity: [0.6, 1, 0.6],
        scale: 1,
        filter: 'blur(0px)',
      }}
      exit={{
        opacity: 0,
        scale: 0,
        filter: 'blur(12px)',
        transition: { duration: 0.6 },
      }}
      transition={melting ? {
        duration: 0.6,
        ease: 'easeOut',
      } : {
        opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: 0.4 },
      }}
      whileHover={{ scale: 1.1 }}
    >
      <div className="relative px-4 py-2 rounded-full bg-space-800/60 backdrop-blur-sm border border-white/5 text-sm text-comet whitespace-nowrap max-w-[240px] truncate">
        <div className="absolute -inset-1 rounded-full bg-comet/5 blur-md -z-10" />
        {comet.text}
      </div>
    </motion.div>
  );
}
