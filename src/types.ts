export interface CometData {
  id: string;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  createdAt?: string;
  color?: string;
}

export const COMET_COLORS = [
  { name: 'white', value: '#e2e8f0', glow: '#e2e8f020' },
  { name: 'blue', value: '#93c5fd', glow: '#93c5fd20' },
  { name: 'purple', value: '#c4b5fd', glow: '#c4b5fd20' },
  { name: 'pink', value: '#f9a8d4', glow: '#f9a8d420' },
  { name: 'amber', value: '#fcd34d', glow: '#fcd34d20' },
  { name: 'green', value: '#86efac', glow: '#86efac20' },
] as const;
