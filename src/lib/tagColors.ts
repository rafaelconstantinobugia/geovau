// Tag color system - generates consistent colors for tags
export const tagColors = [
  'hsl(0, 70%, 60%)',     // Red
  'hsl(30, 70%, 60%)',    // Orange
  'hsl(60, 70%, 60%)',    // Yellow
  'hsl(90, 70%, 60%)',    // Green-Yellow
  'hsl(120, 70%, 60%)',   // Green
  'hsl(150, 70%, 60%)',   // Cyan-Green
  'hsl(180, 70%, 60%)',   // Cyan
  'hsl(210, 70%, 60%)',   // Blue
  'hsl(240, 70%, 60%)',   // Indigo
  'hsl(270, 70%, 60%)',   // Purple
  'hsl(300, 70%, 60%)',   // Magenta
  'hsl(330, 70%, 60%)',   // Pink
];

// Simple hash function to get consistent color for each tag
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function getTagColor(tag: string): string {
  const hash = hashString(tag.toLowerCase());
  const colorIndex = hash % tagColors.length;
  return tagColors[colorIndex];
}

export function getDominantTagColor(tags: string[]): string {
  if (tags.length === 0) return 'hsl(24, 100%, 52%)'; // Default primary color
  return getTagColor(tags[0]); // Use first tag's color
}