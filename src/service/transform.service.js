export const lowerCase = val => val.toLowerCase();
export const upperCase = val => val.toUpperCase();
export const titleCase = val => val.replace(/\w\S*/g, v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase());
export const sentenceCase = val => val.charAt(0).toUpperCase() + val.slice(1);
// export const createdAt = val => val.charAt(0).toUpperCase() + val.slice(1);
// export const updatedAt = val => val.charAt(0).toUpperCase() + val.slice(1);
