import type { CometData } from '../types';

interface Props {
  comets: CometData[];
  threshold?: number;
}

export default function ConstellationLines({ comets, threshold = 200 }: Props) {
  const lines: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];

  for (let i = 0; i < comets.length; i++) {
    for (let j = i + 1; j < comets.length; j++) {
      const dx = comets[i].x - comets[j].x;
      const dy = comets[i].y - comets[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < threshold) {
        lines.push({
          x1: comets[i].x,
          y1: comets[i].y,
          x2: comets[j].x,
          y2: comets[j].y,
          opacity: 1 - dist / threshold,
        });
      }
    }
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {lines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="currentColor"
          strokeWidth={0.5}
          className="text-line"
          style={{ opacity: line.opacity * 0.4 }}
        />
      ))}
    </svg>
  );
}
