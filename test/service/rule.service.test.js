import * as RuleService from '../../src/service/rule.service';

describe('TransformService', () => {
  test('Allow', () => {
    const thunk = RuleService.allow('blue', 'red', 'green');
    expect(() => thunk('blue')).not.toThrow();
    expect(() => thunk('red')).not.toThrow();
    expect(() => thunk('green')).not.toThrow();
    expect(() => thunk('yellow')).toThrow(RuleService.AllowRuleError);
    expect(() => thunk('greenish')).toThrow(RuleService.AllowRuleError);
    expect(() => thunk('greenish', v => false)).not.toThrow();
  });

  test('Deny', () => {
    const thunk = RuleService.deny('purple', 'poison');
    expect(() => thunk('blue')).not.toThrow();
    expect(() => thunk('red')).not.toThrow();
    expect(() => thunk('green')).not.toThrow();
    expect(() => thunk('purple.')).not.toThrow();
    expect(() => thunk('purple')).toThrow(RuleService.DenyRuleError);
    expect(() => thunk('poison')).toThrow(RuleService.DenyRuleError);
    expect(() => thunk('poison', v => false)).not.toThrow();
  });

  test('Range', () => {
    const pct = RuleService.range(0, 100);
    expect(() => pct(0)).not.toThrow();
    expect(() => pct(2)).not.toThrow();
    expect(() => pct(22.33)).not.toThrow();
    expect(() => pct(100)).not.toThrow();
    expect(() => pct(100.000)).not.toThrow();
    expect(() => pct(-1)).toThrow(RuleService.RangeError);
    expect(() => pct(100.0001)).toThrow(RuleService.RangeError);
    expect(() => pct(100.0001, v => false)).not.toThrow();

    const floor = RuleService.range(0);
    expect(() => floor(0)).not.toThrow();
    expect(() => floor(2)).not.toThrow();
    expect(() => floor(22.33)).not.toThrow();
    expect(() => floor(100)).not.toThrow();
    expect(() => floor(10000)).not.toThrow();
    expect(() => floor(-1)).toThrow(RuleService.RangeError);
    expect(() => floor(-100)).toThrow(RuleService.RangeError);
    expect(() => floor(-100, v => false)).not.toThrow();

    const ceil = RuleService.range(null, 100);
    expect(() => ceil(0)).not.toThrow();
    expect(() => ceil(2)).not.toThrow();
    expect(() => ceil(22.33)).not.toThrow();
    expect(() => ceil(100)).not.toThrow();
    expect(() => ceil(-1)).not.toThrow();
    expect(() => ceil(-1000)).not.toThrow();
    expect(() => ceil(100.01)).toThrow(RuleService.RangeError);
    expect(() => ceil(100.01, v => false)).not.toThrow();
  });

  test('Email', () => {
    const thunk = RuleService.email();
    expect(() => thunk('me@mail.com')).not.toThrow();
    expect(() => thunk('you@mail.com')).not.toThrow();
    expect(() => thunk('them@mail.com')).not.toThrow();
    expect(() => thunk('me.you.them@email.com')).not.toThrow();
    expect(() => thunk('me.you.email.com')).toThrow(RuleService.EmailRuleError);
    expect(() => thunk('me@')).toThrow(RuleService.EmailRuleError);
    expect(() => thunk('me@.com')).toThrow(RuleService.EmailRuleError);
    expect(() => thunk('me@.com', v => false)).not.toThrow();
  });

  test('Required', () => {
    expect(() => RuleService.required()()).not.toThrow();
    expect(() => RuleService.required(true)()).toThrow();
  });
});
