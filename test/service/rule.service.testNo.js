import RuleService, { Errors } from '../../src/service/rule.service';

describe('TransformService', () => {
  test('Allow', () => {
    const thunk = RuleService.allow('blue', 'red', 'green');
    expect(() => thunk('blue')).not.toThrow();
    expect(() => thunk('red')).not.toThrow();
    expect(() => thunk('green')).not.toThrow();
    expect(() => thunk('yellow')).toThrow(Errors.AllowRuleError);
    expect(() => thunk('greenish')).toThrow(Errors.AllowRuleError);
    expect(() => thunk('greenish', v => false)).not.toThrow();
  });

  test('Deny', () => {
    const thunk = RuleService.deny('purple', 'poison');
    expect(() => thunk('blue')).not.toThrow();
    expect(() => thunk('red')).not.toThrow();
    expect(() => thunk('green')).not.toThrow();
    expect(() => thunk('purple.')).not.toThrow();
    expect(() => thunk('purple')).toThrow(Errors.DenyRuleError);
    expect(() => thunk('poison')).toThrow(Errors.DenyRuleError);
    expect(() => thunk('poison', v => false)).not.toThrow();
  });

  test('Range', () => {
    const pct = RuleService.range(0, 100);
    expect(() => pct(0)).not.toThrow();
    expect(() => pct(2)).not.toThrow();
    expect(() => pct(22.33)).not.toThrow();
    expect(() => pct(100)).not.toThrow();
    expect(() => pct(100.000)).not.toThrow();
    expect(() => pct(-1)).toThrow(Errors.RangeError);
    expect(() => pct(100.0001)).toThrow(Errors.RangeError);
    expect(() => pct(100.0001, v => false)).not.toThrow();

    const floor = RuleService.range(0);
    expect(() => floor(0)).not.toThrow();
    expect(() => floor(2)).not.toThrow();
    expect(() => floor(22.33)).not.toThrow();
    expect(() => floor(100)).not.toThrow();
    expect(() => floor(10000)).not.toThrow();
    expect(() => floor(-1)).toThrow(Errors.RangeError);
    expect(() => floor(-100)).toThrow(Errors.RangeError);
    expect(() => floor(-100, v => false)).not.toThrow();

    const ceil = RuleService.range(null, 100);
    expect(() => ceil(0)).not.toThrow();
    expect(() => ceil(2)).not.toThrow();
    expect(() => ceil(22.33)).not.toThrow();
    expect(() => ceil(100)).not.toThrow();
    expect(() => ceil(-1)).not.toThrow();
    expect(() => ceil(-1000)).not.toThrow();
    expect(() => ceil(100.01)).toThrow(Errors.RangeError);
    expect(() => ceil(100.01, v => false)).not.toThrow();
  });

  test('Email', () => {
    const thunk = RuleService.email();
    expect(() => thunk('me@mail.com')).not.toThrow();
    expect(() => thunk('you@mail.com')).not.toThrow();
    expect(() => thunk('them@mail.com')).not.toThrow();
    expect(() => thunk('me.you.them@email.com')).not.toThrow();
    expect(() => thunk('me.you.email.com')).toThrow(Errors.EmailRuleError);
    expect(() => thunk('me@')).toThrow(Errors.EmailRuleError);
    expect(() => thunk('me@.com')).toThrow(Errors.EmailRuleError);
    expect(() => thunk('me@.com', v => false)).not.toThrow();
  });

  test('Required', () => {
    const required = RuleService.required();
    expect(() => required()).toThrow();
    expect(() => required(null)).toThrow();
    expect(() => required(undefined)).toThrow();
    expect(() => required({})).not.toThrow();
    expect(() => required({ name: 'Rich' })).not.toThrow();
  });
});
