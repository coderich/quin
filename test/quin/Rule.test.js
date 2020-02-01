import Rule from '../../src/quin/Rule';

describe('Rule', () => {
  test('allow', () => {
    expect(Rule.allow).toBeDefined();
    const rgb = new Rule(Rule.allow('red', 'green', 'blue'));
    expect(() => rgb('red')).not.toThrow();
    expect(() => rgb('green')).not.toThrow();
    expect(() => rgb('blue')).not.toThrow();
    expect(() => rgb('yellow')).toThrow();
    expect(() => rgb('yellow', v => false)).not.toThrow();
  });

  test('deny', () => {
    expect(Rule.deny).toBeDefined();
    const rgb = new Rule(Rule.deny('red', 'green', 'blue'));
    expect(() => rgb('red')).toThrow();
    expect(() => rgb('green')).toThrow();
    expect(() => rgb('blue')).toThrow();
    expect(() => rgb('yellow')).not.toThrow();
    expect(() => rgb('yellow', v => true)).toThrow();
  });

  test('range', () => {
    expect(Rule.range).toBeDefined();
    const pct = new Rule(Rule.range(0, 100));
    expect(() => pct(0)).not.toThrow();
    expect(() => pct(2)).not.toThrow();
    expect(() => pct(22.33)).not.toThrow();
    expect(() => pct(100)).not.toThrow();
    expect(() => pct(100.000)).not.toThrow();
    expect(() => pct(-1)).toThrow();
    expect(() => pct(100.0001)).toThrow();
    expect(() => pct(100.0001, v => false)).not.toThrow();

    const floor = new Rule(Rule.range(0));
    expect(() => floor(0)).not.toThrow();
    expect(() => floor(2)).not.toThrow();
    expect(() => floor(22.33)).not.toThrow();
    expect(() => floor(100)).not.toThrow();
    expect(() => floor(10000)).not.toThrow();
    expect(() => floor(-1)).toThrow();
    expect(() => floor(-100)).toThrow();
    expect(() => floor(-100, v => false)).not.toThrow();

    const ceil = new Rule(Rule.range(null, 100));
    expect(() => ceil(0)).not.toThrow();
    expect(() => ceil(2)).not.toThrow();
    expect(() => ceil(22.33)).not.toThrow();
    expect(() => ceil(100)).not.toThrow();
    expect(() => ceil(-1)).not.toThrow();
    expect(() => ceil(-1000)).not.toThrow();
    expect(() => ceil(100.01)).toThrow();
    expect(() => ceil(100.01, v => false)).not.toThrow();
  });

  test('required', () => {
    expect(Rule.required).toBeDefined();
    const required = new Rule(Rule.required());
    expect(() => required()).toThrow();
    expect(() => required(null)).toThrow();
    expect(() => required(undefined)).toThrow();
    expect(() => required({})).not.toThrow();
    expect(() => required({ name: 'Rich' })).not.toThrow();
  });
});
