import { castCmp } from '../service/app.service';

const jsStringMethods = [
  'charAt', 'charCodeAt', 'codePointAt', 'concat', 'indexOf', 'lastIndexOf', 'localeCompare',
  'normalize', 'padEnd', 'padStart', 'repeat', 'replace', 'search', 'slice', 'split', 'substr', 'substring',
  'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toString', 'toUpperCase', 'trim', 'trimEnd', 'trimStart', 'raw',
];

export default class Transformer {
  constructor(thunk) {
    const fn = (val, cmp = v => thunk(v)) => cmp(val);
    return Object.defineProperties(fn, { type: { value: 'transformer' } });
  }

  static defaults() {
    return [
      'toLowerCase',
      'toUpperCase',
      'toTitleCase',
      'toSentenceCase',
      'trim',
      'dedupe',
      'toString',
      'timestamp',
    ];
  }

  static factory(name, thunk) {
    Object.defineProperty(Transformer, name, { value: new Transformer(thunk) });
  }
}

// Factory methods
jsStringMethods.forEach(name => Transformer.factory(name, (...args) => v => String(v)[name](...args)));
Transformer.factory('toTitleCase', () => v => v.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()));
Transformer.factory('toLocaleTitleCase', (...args) => v => v.replace(/\w\S*/g, w => w.charAt(0).toLocaleUpperCase(...args) + w.slice(1).toLocaleLowerCase()));
Transformer.factory('toSentenceCase', () => v => v.charAt(0).toUpperCase() + v.slice(1));
Transformer.factory('toLocaleSentenceCase', (...args) => v => v.charAt(0).toLocaleUpperCase(...args) + v.slice(1));
Transformer.factory('dedupe', () => v => [...new Set(v)]);
Transformer.factory('timestamp', () => v => Date.now());
Transformer.factory('cast', type => v => castCmp(type, v));
