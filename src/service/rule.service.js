import { get } from 'lodash';
import { isEmail } from 'validator';
import * as Errors from './error.service';
import { hashObject } from './app.service';

export const allow = (...args) => (val, oldData, op, path) => {
  if (val == null) return;
  if (args.indexOf(val) === -1) throw new Errors.AllowRuleError(`${path} must contain: { ${args.join(' ')} }, found '${val}'`);
};

export const deny = (...args) => (val, oldData, op, path) => {
  if (val == null) return;
  if (args.indexOf(val) > -1) throw new Errors.RejectRuleError(`${path} must not contain: { ${args.join(' ')} }, found '${val}'`);
};

export const range = (min, max) => {
  if (min == null) min = undefined;
  if (max == null) max = undefined;

  return (val) => {
    if (val == null) return;
    const num = Number(val);
    if (Number.isNaN(num)) throw new Errors.RangeRuleError(`${val} is not a valid number`);
    if (num < min) throw new Errors.RangeRuleError(`${val} cannot be less than ${min}`);
    if (num > max) throw new Errors.RangeRuleError(`${val} cannot be greater than ${max}`);
  };
};

export const email = () => (val, oldData, op, path) => {
  if (val == null) return;
  if (!isEmail(val)) throw new Errors.EmailRuleError(`${path} is not a valid email`);
};

export const required = () => (val, oldData, op, path) => {
  if (op === 'create' && val == null) throw new Errors.RequiredRuleError(`${path} is a required field`);
  if (op === 'update' && val === null) throw new Errors.RequiredRuleError(`${path} cannot be set to null`);
};

export const selfless = () => (val, oldData, op, path) => {
  if (val == null) return;
  if (`${val}` === `${get(oldData, 'id')}`) throw new Errors.SelflessRuleError(`${path} cannot hold a reference to itself`);
};

export const immutable = () => (val, oldData, op, path) => {
  const p = path.substr(path.indexOf('.') + 1);
  const oldVal = get(oldData, p);
  if (op === 'update' && val !== undefined && `${hashObject(val)}` !== `${hashObject(oldVal)}`) throw new Errors.ImmutableRuleError(`${path} is immutable; cannot be changed once set`);
};
