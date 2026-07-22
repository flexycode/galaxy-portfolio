/**
 * Shared category → color mapping used by ProjectGalaxy and GlowCursor.
 * Single source of truth so both components stay in sync.
 */

export type ProjectCategory = 'ai' | 'cybersecurity' | 'blockchain' | 'fullstack';

export const CATEGORY_COLORS: Record<ProjectCategory, { tw: string; hex: string }> = {
  ai:            { tw: 'bg-purple-600', hex: '#9333ea' },
  cybersecurity: { tw: 'bg-red-600',    hex: '#dc2626' },
  blockchain:    { tw: 'bg-blue-600',   hex: '#2563eb' },
  fullstack:     { tw: 'bg-green-600',  hex: '#16a34a' },
};

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  ai:            'AI/ML',
  cybersecurity: 'Cybersecurity',
  blockchain:    'Blockchain',
  fullstack:     'Full Stack',
};
