export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'primary' | 'secondary';
}

export interface Message {
  id: string;
  // CHANGED: 'ai' -> 'assistant'
  role: 'user' | 'assistant'; 
  content: string;
}

export interface Suggestion {
  id: number;
  icon: string;
  label: string;
  prompt: string;
  color: string;
}
