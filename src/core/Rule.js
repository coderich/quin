import { map } from '../service/app.service';

const jsStringMethods = ['endsWith', 'includes', 'match', 'search', 'startsWith'];

export default class Rule {
  constructor(thunk, ignoreNull = true, name = 'Unknown') {
    return Object.defineProperty((val, cmp = v => thunk(v)) => {
      if (ignoreNull && val == null) return;
      if (!ignoreNull && cmp(val)) throw new Error(`Rule Error: ${name}`);
      if (ignoreNull) map(val, (v) => { if (cmp(v)) throw new Error(`Rule Error: ${name}`); });
    }, 'type', { value: 'rule' });
  }

  static factory(name, thunk, ignoreNull = true, descriptor = {}) {
    return Object.defineProperty(Rule, name, {
      value: (...args) => Object.defineProperty(new Rule(thunk(...args), ignoreNull, name), 'method', { value: name }),
      ...descriptor,
    })[name];
  }
}

// Factory methods
jsStringMethods.forEach(name => Rule.factory(name, (...args) => v => !String(v)[name](...args)));
Rule.factory('required', () => v => v == null, false, { enumerable: true });
Rule.factory('allow', (...args) => v => args.indexOf(v) === -1);
Rule.factory('deny', (...args) => v => args.indexOf(v) > -1);
Rule.factory('range', (min, max) => {
  if (min == null) min = undefined;
  if (max == null) max = undefined;
  return v => Number.isNaN(v) || v < min || v > max;
});
