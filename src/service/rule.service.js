import isEmail from 'validator/lib/isEmail';

// Rule Errors
class RuleError extends Error {}
export const AllowRuleError = class extends RuleError {};
export const DenyRuleError = class extends RuleError {};
export const RangeRuleError = class extends RuleError {};
export const EmailRuleError = class extends RuleError {};
export const RequiredRuleError = class extends RuleError {};
export const SelflessRuleError = class extends RuleError {};
export const ImmutableRuleError = class extends RuleError {};
export const NoRepeatRuleError = class extends RuleError {};
export const DistinctRuleError = class extends RuleError {};

export const allow = (...args) => (val, cmp = v => args.indexOf(v) === -1) => {
  if (val == null) return;
  if (cmp(val)) throw new AllowRuleError();
};

export const deny = (...args) => (val, cmp = v => args.indexOf(v) > -1) => {
  if (val == null) return;
  if (cmp(val)) throw new DenyRuleError();
};

export const range = (min, max) => {
  if (min == null) min = undefined;
  if (max == null) max = undefined;

  return (val, cmp = v => Number.isNaN(v) || v < min || v > max) => {
    if (val == null) return;
    if (cmp(Number(val))) throw new RangeRuleError();
  };
};

export const email = () => (val, cmp = v => !isEmail(v)) => {
  if (val == null) return;
  if (cmp(val)) throw new EmailRuleError();
};

export const required = () => Object.defineProperty((val, cmp = v => v == null) => {
  if (cmp(val)) throw new RequiredRuleError();
}, 'name', { value: 'required' });

export const selfless = () => (val, cmp = v => false) => {
  if (val == null) return;
  if (cmp(val)) throw new SelflessRuleError();
};

export const immutable = () => (val, cmp = v => false) => {
  if (cmp(val)) throw new ImmutableRuleError();
};

export const norepeat = () => (val, cmp = v => false) => {
  if (cmp(val)) throw new NoRepeatRuleError();
};

export const distinct = () => (val, cmp = v => false) => {
  if (cmp(val)) throw new DistinctRuleError();
};
