export function cn(...classes: (string | undefined | null | boolean | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
