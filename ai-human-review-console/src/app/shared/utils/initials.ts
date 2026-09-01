export function initials(name: string): string {
  return name
    .split(' ')
    .filter((part) => part.length > 0)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
