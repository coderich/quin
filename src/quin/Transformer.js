import { castCmp } from '../service/app.service';

export default class Transformer {
  constructor(name, thunk) {
    return Object.defineProperties(thunk, {
      name: { value: name },
      type: { value: 'transformer' },
    });
  }

  static factory(name, thunk) {
    Object.defineProperty(Transformer, name, { value: thunk });
  }
}

// Factory methods
[
  'charAt', 'charCodeAt', 'codePointAt', 'concat', 'indexOf', 'lastIndexOf', 'localeCompare',
  'normalize', 'padEnd', 'padStart', 'repeat', 'replace', 'search', 'slice', 'split', 'substr', 'substring',
  'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toString', 'toUpperCase', 'trim', 'trimEnd', 'trimStart', 'raw',
].forEach(name => Transformer.factory(name, (...args) => v => String(v)[name](...args)));
Transformer.factory('toTitleCase', () => v => v.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()));
Transformer.factory('toLocaleTitleCase', () => v => v.replace(/\w\S*/g, w => w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase()));
Transformer.factory('toSentenceCase', () => v => v.charAt(0).toUpperCase() + v.slice(1));
Transformer.factory('toLocaleSentenceCase', () => v => v.charAt(0).toLocaleUpperCase() + v.slice(1));
Transformer.factory('dedupe', () => v => [...new Set(v)]);
Transformer.factory('timestamp', () => v => Date.now());
Transformer.factory('cast', type => v => castCmp(type, v));
