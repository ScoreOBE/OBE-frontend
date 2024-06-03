export const setLocalStorage = (name: string, value: any) => {
  localStorage.setItem(name, JSON.stringify(value));
};

export const getLocalStorage = (name: string) => {
  return localStorage.getItem(name)
    ? JSON.parse(localStorage.getItem(name) || "")
    : null;
};

export const removeLocalStorage = (name: string) => {
  localStorage.removeItem(name);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
