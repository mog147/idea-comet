import type { CometData } from '../types';

interface Props {
  comets: CometData[];
  threshold?: number;
}

export default function ConstellationLines({ comets, threshold = 200 }: Props) {
  const lines: { key: string; x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];

  for (let i = 0; i < comets.length; i++) {
    for (let j = i + 1; j < comets.length; j++) {
      const dx = comets[i].x - comets[j].x;
      const dy = comets[i].y - comets[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < threshold) {
        const strength = 1 - dist / threshold;
        lines.push({
          key: `${comets[i].id}-${comets[j].id}`,
          x1: comets[i].x,
          y1: comets[i].y,
          x2: comets[j].x,
          y2: comets[j].y,
          opacity: strength,
        });
      }
    }
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {lines.map(line => (
        <line
          key={line.key}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="#94a3b8"
          strokeWidth={line.opacity > 0.6 ? 1 : 0.5}
          filter={line.opacity > 0.6 ? 'url(#glow)' : undefined}
          style={{
            opacity: line.opacity * 0.35,
            transition: 'opacity 0.3s',
          }}
        />
      ))}
    </svg>
  );
}
