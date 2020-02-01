export const ucFirst = string => string.charAt(0).toUpperCase() + string.slice(1);
export const isScalarDataType = value => ['ID', 'String', 'Float', 'Int', 'Boolean'].indexOf(value) > -1;
export const makeThunk = (name, fn) => Object.defineProperty((val, cmp = fn) => cmp(val), 'name', { value: name });
export const castCmp = (type, value) => {
  switch (type) {
    case 'String': {
      return `${value}`;
    }
    case 'Number': case 'Float': case 'Int': {
      return Number(value);
    }
    case 'Boolean': {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return Boolean(value);
    }
    default: {
      return value;
    }
  }
};
