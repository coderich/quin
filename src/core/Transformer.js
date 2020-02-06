import { map, castCmp } from '../service/app.service';

const jsStringMethods = [
  'charAt', 'charCodeAt', 'codePointAt', 'concat', 'indexOf', 'lastIndexOf', 'localeCompare',
  'normalize', 'padEnd', 'padStart', 'repeat', 'replace', 'search', 'slice', 'split', 'substr', 'substring',
  'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toString', 'toUpperCase', 'trim', 'trimEnd', 'trimStart', 'raw',
];

export default class Transformer {
  constructor(thunk, ignoreNull = true) {
    return Object.defineProperty((val, cmp = v => thunk(v)) => {
      if (ignoreNull && val == null) return val;
      if (!ignoreNull) return cmp(val);
      return map(val, v => cmp(v));
    }, 'type', { value: 'transformer' });
  }

  static factory(name, thunk, ignoreNull = true, descriptor = {}) {
    return Object.defineProperty(Transformer, name, {
      value: (...args) => Object.defineProperty(new Transformer(thunk(...args), ignoreNull), 'method', { value: name }),
      ...descriptor,
    })[name];
  }
}

// Factory methods
const enumerables = ['toLowerCase', 'toUpperCase', 'trim', 'trimEnd', 'trimStart', 'toString'];
jsStringMethods.forEach(name => Transformer.factory(name, (...args) => v => String(v)[name](...args), true, { enumerable: enumerables.indexOf(name) > -1 }));
Transformer.factory('toTitleCase', () => v => v.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()), true, { enumerable: true });
Transformer.factory('toLocaleTitleCase', (...args) => v => v.replace(/\w\S*/g, w => w.charAt(0).toLocaleUpperCase(...args) + w.slice(1).toLocaleLowerCase()));
Transformer.factory('toSentenceCase', () => v => v.charAt(0).toUpperCase() + v.slice(1), true, { enumerable: true });
Transformer.factory('toLocaleSentenceCase', (...args) => v => v.charAt(0).toLocaleUpperCase(...args) + v.slice(1));
Transformer.factory('dedupe', () => a => [...new Set(a.map(v => `${v}`))].map(v => a.find(b => `${b}` === v)), false, { enumerable: true });
Transformer.factory('timestamp', () => v => Date.now(), true, { enumerable: true });
Transformer.factory('cast', type => v => castCmp(type, v));
