export const lowerCase = () => (val, fn = v => v.toLowerCase()) => fn(val);
export const upperCase = () => (val, fn = v => v.toUpperCase()) => fn(val);
export const titleCase = () => (val, fn = v => v.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())) => fn(val);
export const sentenceCase = () => (val, fn = v => v.charAt(0).toUpperCase() + v.slice(1)) => fn(val);
export const dedupe = () => (val, fn = v => [...new Set(v)]) => fn(val);

// export const createdAt = val => val.charAt(0).toUpperCase() + val.slice(1);
// export const updatedAt = val => val.charAt(0).toUpperCase() + val.slice(1);
