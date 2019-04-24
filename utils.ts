export const debounce = (callback, timeout) => {
  let id: number;
  return (...args: any) => {
    clearTimeout(id);
    return id = setTimeout(() => callback(...args), timeout);
  };
};