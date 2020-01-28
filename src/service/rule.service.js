import isEmail from 'validator/lib/isEmail';
import * as Errors from './error.service';

export const allow = (...args) => (val, cmp = v => args.indexOf(v) === -1) => {
  if (val == null) return;
  if (cmp(val)) throw new Errors.AllowRuleError();
};

export const deny = (...args) => (val, cmp = v => args.indexOf(v) > -1) => {
  if (val == null) return;
  if (cmp(val)) throw new Errors.DenyRuleError();
};

export const range = (min, max) => {
  if (min == null) min = undefined;
  if (max == null) max = undefined;

  return (val, cmp = v => Number.isNaN(v) || v < min || v > max) => {
    if (val == null) return;
    if (cmp(Number(val))) throw new Errors.RangeRuleError();
  };
};

export const email = () => (val, cmp = v => !isEmail(v)) => {
  if (val == null) return;
  if (cmp(val)) throw new Errors.EmailRuleError();
};

export const required = () => (val, cmp = v => v == null) => {
  if (cmp(val)) throw new Errors.RequiredRuleError();
};

export const selfless = () => (val, cmp = v => false) => {
  if (val == null) return;
  if (cmp(val)) throw new Errors.SelflessRuleError();
};

export const immutable = () => (val, cmp = v => false) => {
  if (cmp(val)) throw new Errors.ImmutableRuleError();
};
