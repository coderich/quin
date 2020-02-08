import IPO from 'is-plain-object';

export const ucFirst = string => string.charAt(0).toUpperCase() + string.slice(1);
export const isScalarDataType = value => ['ID', 'String', 'Float', 'Int', 'Boolean'].indexOf(value) > -1;
export const isPlainObject = value => IPO(value);
export const ensureArray = a => (Array.isArray(a) ? a : [a]);

export const castCmp = (type, value) => {
  switch (type) {
    case 'String': {
      return `${value}`;
    }
    case 'Float': case 'Number': {
      const num = Number(value);
      if (!Number.isNaN(num)) return num;
      return value;
    }
    case 'Int': {
      const num = parseInt(value, 10);
      if (!Number.isNaN(num)) return num;
      return value;
    }
    case 'Boolean': {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    }
    default: {
      return value;
    }
  }
};

export const map = (mixed, fn) => {
  if (mixed == null) return mixed;
  const isArray = Array.isArray(mixed);
  const arr = isArray ? mixed : [mixed];
  const results = arr.map(el => fn(el));
  return isArray ? results : results[0];
};
