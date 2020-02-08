import isEmail from 'validator/lib/isEmail';
import Rule from '../../src/core/Rule';

describe('Rule', () => {
  test('allow', async () => {
    expect(Rule.allow).toBeDefined();
    const rgb = Rule.allow('red', 'green', 'blue');
    await expect(rgb('red')).resolves;
    await expect(rgb('green')).resolves;
    await expect(rgb('blue')).resolves;
    await expect(rgb('yellow')).rejects.toThrow();
    await expect(rgb('yellow', v => false)).resolves;
  });

  test('deny', async () => {
    expect(Rule.deny).toBeDefined();
    const rgb = Rule.deny('red', 'green', 'blue');
    await expect(rgb('red')).rejects.toThrow();
    await expect(rgb('green')).rejects.toThrow();
    await expect(rgb('blue')).rejects.toThrow();
    await expect(rgb('yellow')).resolves;
    await expect(rgb('yellow', v => true)).rejects.toThrow();
  });

  test('range', async () => {
    expect(Rule.range).toBeDefined();
    const pct = Rule.range(0, 100);
    await expect(pct(0)).resolves;
    await expect(pct(2)).resolves;
    await expect(pct(22.33)).resolves;
    await expect(pct(100)).resolves;
    await expect(pct(100.000)).resolves;
    await expect(pct(-1)).rejects.toThrow();
    await expect(pct(100.0001)).rejects.toThrow();
    await expect(pct(100.0001, v => false)).resolves;

    const floor = Rule.range(0);
    await expect(floor(0)).resolves;
    await expect(floor(2)).resolves;
    await expect(floor(22.33)).resolves;
    await expect(floor(100)).resolves;
    await expect(floor(10000)).resolves;
    await expect(floor(-1)).rejects.toThrow();
    await expect(floor(-100)).rejects.toThrow();
    await expect(floor(-100, v => false)).resolves;

    const ceil = Rule.range(null, 100);
    await expect(ceil(0)).resolves;
    await expect(ceil(2)).resolves;
    await expect(ceil(22.33)).resolves;
    await expect(ceil(100)).resolves;
    await expect(ceil(-1)).resolves;
    await expect(ceil(-1000)).resolves;
    await expect(ceil(100.01)).rejects.toThrow();
    await expect(ceil(100.01, v => false)).resolves;
  });

  test('required', async () => {
    expect(Rule.required).toBeDefined();
    const required = Rule.required();
    await expect(required()).rejects.toThrow();
    await expect(required(null)).rejects.toThrow();
    await expect(required(undefined)).rejects.toThrow();
    await expect(required({})).resolves;
    await expect(required({ name: 'Rich' })).resolves;
  });

  test('email', async () => {
    const thunk = new Rule(v => !isEmail(v));
    await expect(thunk('me@mail.com')).resolves;
    await expect(thunk('you@mail.com')).resolves;
    await expect(thunk('them@mail.com')).resolves;
    await expect(thunk('me.you.them@email.com')).resolves;
    await expect(thunk('me.you.email.com')).rejects.toThrow();
    await expect(thunk('me@')).rejects.toThrow();
    await expect(thunk('me@.com')).rejects.toThrow();
    await expect(thunk('me@.com', v => false)).resolves;
  });
});
