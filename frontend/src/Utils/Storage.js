

export const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};