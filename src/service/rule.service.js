// import isEmail from 'validator/lib/isEmail';
import { makeThunk, ucFirst } from './app.service';

// Rule Errors
const Errors = {};
class RuleError extends Error {}
Errors.AllowRuleError = class extends RuleError {};
Errors.DenyRuleError = class extends RuleError {};
Errors.RangeRuleError = class extends RuleError {};
Errors.EmailRuleError = class extends RuleError {};
Errors.RequiredRuleError = class extends RuleError {};
Errors.SelflessRuleError = class extends RuleError {};
Errors.ImmutableRuleError = class extends RuleError {};
Errors.NoRepeatRuleError = class extends RuleError {};
Errors.DistinctRuleError = class extends RuleError {};
Errors.EndsWithRuleError = class extends RuleError {};
Errors.IncludesRuleError = class extends RuleError {};
Errors.MatchRuleError = class extends RuleError {};
Errors.SearchRuleError = class extends RuleError {};
Errors.StartsWithRuleError = class extends RuleError {};

// Start with JS built-in String methods
const rules = ['endsWith', 'includes', 'match', 'search', 'startsWith'].reduce((prev, name) => {
  return Object.assign(prev, {
    [name]: (...args) => makeThunk(name, (val, cmp = v => String(v)[name](...args)) => {
      if (val === null) return;
      if (!cmp(val)) throw new Errors[`${ucFirst(name)}RuleError`]();
    }),
  });
}, {});

rules.allow = (...args) => makeThunk('allow', (val, cmp = v => args.indexOf(v) === -1) => {
  if (val == null) return;
  if (cmp(val)) throw new Errors.AllowRuleError();
});

rules.deny = (...args) => makeThunk('deny', (val, cmp = v => args.indexOf(v) > -1) => {
  if (val == null) return;
  if (cmp(val)) throw new Errors.DenyRuleError();
});

rules.range = (min, max) => {
  if (min == null) min = undefined;
  if (max == null) max = undefined;

  return makeThunk('range', (val, cmp = v => Number.isNaN(v) || v < min || v > max) => {
    if (val == null) return;
    if (cmp(Number(val))) throw new Errors.RangeRuleError();
  });
};

rules.norepeat = (...args) => makeThunk('norepeat', (val, cmp = v => false) => {
  if (cmp(val)) throw new Errors.NoRepeatRuleError();
});


// Enforcable
// rules.email = () => makeThunk('email', (val, cmp = v => !isEmail(v)) => {
//   if (val == null) return;
//   if (cmp(val)) throw new Errors.EmailRuleError();
// });

rules.selfless = () => makeThunk('selfless', (val, cmp = v => false) => {
  if (val == null) return;
  if (cmp(val)) throw new Errors.SelflessRuleError();
});

rules.immutable = () => makeThunk('immutable', (val, cmp = v => false) => {
  if (cmp(val)) throw new Errors.ImmutableRuleError();
});

rules.distinct = () => makeThunk('distinct', (val, cmp = v => false) => {
  if (cmp(val)) throw new Errors.DistinctRuleError();
});


// Used internally
rules.required = () => makeThunk('required', (val, cmp = v => v == null) => {
  if (cmp(val)) throw new Errors.RequiredRuleError();
});


export { Errors };
export default rules;
