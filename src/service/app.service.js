export const ucFirst = string => string.charAt(0).toUpperCase() + string.slice(1);

export const isScalarDataType = value => ['ID', 'String', 'Float', 'Int', 'Boolean'].indexOf(value) > -1;

export const castCmp = (type, value) => {
  switch (type) {
    case 'String': {
      return `${value}`;
    }
    case 'Float': case 'Number': {
      return Number(value);
    }
    case 'Int': {
      return parseInt(value, 10);
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
