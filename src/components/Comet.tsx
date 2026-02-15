import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { CometData } from '../types';

interface Props {
  comet: CometData;
  onRemove: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDragEnd: (id: string, x: number, y: number, vx?: number, vy?: number) => void;
}

function formatTime(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${h}:${m}`;
}

export default function Comet({ comet, onRemove, onUpdate, onDragEnd }: Props) {
  const [melting, setMelting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comet.text);
  const [showTime, setShowTime] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging = useRef(false);
  const didDrag = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startMelt = () => {
    if (editing) return;
    didDrag.current = false;
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

  const handleClick = () => {
    if (!didDrag.current && !editing) {
      setShowTime(prev => !prev);
    }
  };

  const startEdit = () => {
    if (didDrag.current) return;
    setEditing(true);
    setEditText(comet.text);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitEdit = () => {
    const text = editText.trim();
    if (text && text !== comet.text) {
      onUpdate(comet.id, text);
    }
    setEditing(false);
  };

  return (
    <motion.div
      className="absolute select-none"
      style={{ left: comet.x, top: comet.y, x: '-50%', y: '-50%', cursor: editing ? 'text' : 'grab' }}
      drag={!editing}
      dragMomentum={false}
      onDragStart={() => { isDragging.current = true; didDrag.current = true; cancelMelt(); }}
      onDragEnd={(_, info) => {
        isDragging.current = false;
        const vx = Math.max(-1, Math.min(1, info.velocity.x * 0.003));
        const vy = Math.max(-1, Math.min(1, info.velocity.y * 0.003));
        onDragEnd(comet.id, comet.x + info.offset.x, comet.y + info.offset.y, vx, vy);
      }}
      onDoubleClick={startEdit}
      onPointerDown={startMelt}
      onPointerUp={() => { cancelMelt(); handleClick(); }}
      onPointerLeave={cancelMelt}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={melting ? {
        opacity: 0,
        scale: 0,
        filter: 'blur(16px)',
      } : {
        opacity: 1,
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
        duration: 0.3,
      }}
      whileHover={editing ? {} : { scale: 1.05 }}
    >
      <div
        className="relative px-4 py-2 rounded-2xl bg-space-800/60 backdrop-blur-sm border text-sm max-w-[260px]"
        style={{
          color: comet.color || '#e2e8f0',
          borderColor: editing ? `${comet.color || '#e2e8f0'}30` : 'rgba(255,255,255,0.05)',
        }}
      >
        <div className="absolute -inset-1 rounded-2xl blur-md -z-10" style={{ background: `${comet.color || '#e2e8f0'}08` }} />
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(false); }}
            onBlur={commitEdit}
            className="bg-transparent outline-none w-full text-inherit"
            style={{ minWidth: '60px' }}
          />
        ) : (
          <span className="break-words">{comet.text}</span>
        )}
        {showTime && !editing && comet.createdAt && (
          <div className="text-[10px] text-comet-dim/40 mt-1">{formatTime(comet.createdAt)}</div>
        )}
      </div>
    </motion.div>
  );
}
