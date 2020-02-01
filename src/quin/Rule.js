export default class Rule {
  constructor(name, thunk) {
    return Object.defineProperties(thunk, {
      name: { value: name },
      type: { value: 'rule' },
    });
  }

  static factory(name, thunk) {
    Object.defineProperty(Rule, name, {
      value: (...args) => {
        const fn = thunk(...args);
        return (val, cmp = v => fn(v)) => cmp(val);
      },
    });
  }
}

// Factory methods
['endsWith', 'includes', 'match', 'search', 'startsWith'].forEach((name) => {
  Rule.factory(name, (...args) => (val) => {
    if (val === null) return;
    if (!String(val)[name](...args)) throw new Error();
  });
});
Rule.factory('allow', (...args) => (val) => {
  if (val == null) return;
  if (args.indexOf(val) === -1) throw new Error();
});
Rule.factory('deny', (...args) => (val) => {
  if (val == null) return;
  if (args.indexOf(val) > -1) throw new Error();
});
Rule.factory('range', (min, max) => {
  if (min == null) min = undefined;
  if (max == null) max = undefined;

  return (val) => {
    if (val == null) return;
    if (Number.isNaN(val) || val < min || val > max) throw new Error();
  };
});
