const jsStringMethods = ['endsWith', 'includes', 'match', 'search', 'startsWith'];

export default class Rule {
  constructor(thunk) {
    return Object.defineProperties(thunk, {
      type: { value: 'rule' },
    });
  }

  static defaults() {
    return ['required'];
  }

  static factory(name, thunk) {
    Object.defineProperty(Rule, name, {
      value: (...args) => {
        const fn = thunk(...args);

        return (val, cmp = v => fn(v)) => {
          if (cmp(val)) throw new Error();
        };
      },
      writable: true,
    });
  }
}

// Factory methods
jsStringMethods.forEach((name) => {
  Rule.factory(name, (...args) => (val) => {
    if (val === null) return false;
    return !String(val)[name](...args);
  });
});
Rule.factory('allow', (...args) => (val) => {
  if (val == null) return false;
  return args.indexOf(val) === -1;
});
Rule.factory('deny', (...args) => (val) => {
  if (val == null) return false;
  return args.indexOf(val) > -1;
});
Rule.factory('range', (min, max) => {
  if (min == null) min = undefined;
  if (max == null) max = undefined;

  return (val) => {
    if (val == null) return false;
    return (Number.isNaN(val) || val < min || val > max);
  };
});
Rule.factory('required', () => val => val == null);
