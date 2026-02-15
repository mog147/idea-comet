import { motion } from 'framer-motion';
import type { CometData } from '../types';

interface Props {
  comet: CometData;
  onRemove: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
}

export default function Comet({ comet, onRemove, onDragEnd }: Props) {
  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{ left: comet.x, top: comet.y, x: '-50%', y: '-50%' }}
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onDragEnd(comet.id, comet.x + info.offset.x, comet.y + info.offset.y);
      }}
      onDoubleClick={() => onRemove(comet.id)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.6, 1, 0.6],
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0,
        filter: 'blur(12px)',
        transition: { duration: 0.6 },
      }}
      transition={{
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
