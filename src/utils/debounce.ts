export const debounce = (fn: any, delay: any) => {
  let timeoutId: any = null;
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
