export function debounce(fn: (...args: any[]) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}