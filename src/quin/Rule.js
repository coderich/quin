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

  static allow(...args) {
    return (val, cmp = v => args.indexOf(v) === -1) => {
      if (val == null) return;
      if (cmp(val)) throw new Errors.AllowRuleError();
    };
  }
}


const rgb = new Rule('rgb', Rule.allow('red', 'green', 'blue'));


Rule.factory('myRule', (...args) => (val) => {
  if (val === null) return;
  if (val > 10) throw new Error();
});
