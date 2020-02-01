const jsStringMethods = ['endsWith', 'includes', 'match', 'search', 'startsWith'];

export default class Rule {
  constructor(thunk, ignoreNull = true) {
    return Object.defineProperty((val, cmp = v => thunk(v)) => {
      if (ignoreNull && val == null) return;
      if (cmp(val)) throw new Error();
    }, 'type', { value: 'rule' });
  }

  static defaults() {
    return ['required'];
  }

  static factory(name, thunk, ignoreNull) {
    Object.defineProperty(Rule, name, { value: (...args) => new Rule(thunk(...args), ignoreNull) });
  }
}

// Factory methods
jsStringMethods.forEach(name => Rule.factory(name, (...args) => val => !String(val)[name](...args)));
Rule.factory('required', () => val => val == null, false);
Rule.factory('allow', (...args) => val => args.indexOf(val) === -1);
Rule.factory('deny', (...args) => val => args.indexOf(val) > -1);
Rule.factory('range', (min, max) => {
  if (min == null) min = undefined;
  if (max == null) max = undefined;
  return val => Number.isNaN(val) || val < min || val > max;
});
