export const lowerCase = () => Object.defineProperty((val, fn = v => v.toLowerCase()) => fn(val), 'name', { value: 'lowerCase' });
export const upperCase = () => Object.defineProperty((val, fn = v => v.toUpperCase()) => fn(val), 'name', { value: 'upperCase' });
export const titleCase = () => Object.defineProperty((val, fn = v => v.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())) => fn(val), 'name', { value: 'titleCase' });
export const sentenceCase = () => Object.defineProperty((val, fn = v => v.charAt(0).toUpperCase() + v.slice(1)) => fn(val), 'name', { value: 'sentenceCase' });
export const dedupe = () => Object.defineProperty((val, fn = v => [...new Set(v)]) => fn(val), 'name', { value: 'dedupe' });

const castCmp = (type, value) => {
  switch (type) {
    case 'String': {
      value = `${value}`;
      break;
    }
    case 'Number': case 'Float': case 'Int': {
      const num = Number(value);
      if (!Number.isNaN(num)) value = num;
      break;
    }
    case 'Boolean': {
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      break;
    }
    default: {
      break;
    }
  }

  return value;
};
export const cast = type => Object.defineProperty((val, fn = v => castCmp(type, v)) => fn(val), 'name', { value: 'cast' });
// export const createdAt = val => val.charAt(0).toUpperCase() + val.slice(1);
// export const updatedAt = val => val.charAt(0).toUpperCase() + val.slice(1);
