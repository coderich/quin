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

export const allow = (...args) => Object.defineProperty((val, cmp = v => args.indexOf(v) === -1) => {
  if (val == null) return;
  if (cmp(val)) throw new AllowRuleError();
}, 'name', { value: 'allow' });

export const deny = (...args) => Object.defineProperty((val, cmp = v => args.indexOf(v) > -1) => {
  if (val == null) return;
  if (cmp(val)) throw new DenyRuleError();
}, 'name', { value: 'deny' });

export const range = (min, max) => {
  if (min == null) min = undefined;
  if (max == null) max = undefined;

  return Object.defineProperty((val, cmp = v => Number.isNaN(v) || v < min || v > max) => {
    if (val == null) return;
    if (cmp(Number(val))) throw new RangeRuleError();
  }, 'name', { value: 'range' });
};

export const email = () => Object.defineProperty((val, cmp = v => !isEmail(v)) => {
  if (val == null) return;
  if (cmp(val)) throw new EmailRuleError();
}, 'name', { value: 'email' });

export const required = () => Object.defineProperty((val, cmp = v => v == null) => {
  if (cmp(val)) throw new RequiredRuleError();
}, 'name', { value: 'required' });

export const selfless = () => Object.defineProperty((val, cmp = v => false) => {
  if (val == null) return;
  if (cmp(val)) throw new SelflessRuleError();
}, 'name', { value: 'selfless' });

export const immutable = () => Object.defineProperty((val, cmp = v => false) => {
  if (cmp(val)) throw new ImmutableRuleError();
}, 'name', { value: 'immutable' });

export const norepeat = () => Object.defineProperty((val, cmp = v => false) => {
  if (cmp(val)) throw new NoRepeatRuleError();
}, 'name', { value: 'norepeat' });

export const distinct = () => Object.defineProperty((val, cmp = v => false) => {
  if (cmp(val)) throw new DistinctRuleError();
}, 'name', { value: 'distinct' });
