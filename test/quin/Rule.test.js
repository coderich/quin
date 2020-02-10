import isEmail from 'validator/lib/isEmail';
import Rule from '../../src/core/Rule';

describe('Rule', () => {
  test('allow', async () => {
    expect(Rule.allow).toBeDefined();
    const rgb = Rule.allow('red', 'green', 'blue');
    await expect(rgb(null, 'red')).resolves.not.toThrow();
    await expect(rgb(null, 'green')).resolves.not.toThrow();
    await expect(rgb(null, 'blue')).resolves.not.toThrow();
    await expect(rgb(null, 'yellow')).rejects.toThrow();
    await expect(rgb(null, 'yellow', v => false)).resolves.not.toThrow();
  });

  test('deny', async () => {
    expect(Rule.deny).toBeDefined();
    const rgb = Rule.deny('red', 'green', 'blue');
    await expect(rgb(null, 'red')).rejects.toThrow();
    await expect(rgb(null, 'green')).rejects.toThrow();
    await expect(rgb(null, 'blue')).rejects.toThrow();
    await expect(rgb(null, 'yellow')).resolves.not.toThrow();
    await expect(rgb(null, 'yellow', v => true)).rejects.toThrow();
  });

  test('range', async () => {
    expect(Rule.range).toBeDefined();
    const pct = Rule.range(0, 100);
    await expect(pct(null, 0)).resolves.not.toThrow();
    await expect(pct(null, 2)).resolves.not.toThrow();
    await expect(pct(null, 22.33)).resolves.not.toThrow();
    await expect(pct(null, 100)).resolves.not.toThrow();
    await expect(pct(null, 100.000)).resolves.not.toThrow();
    await expect(pct(null, -1)).rejects.toThrow();
    await expect(pct(null, 100.0001)).rejects.toThrow();
    await expect(pct(null, 100.0001, v => false)).resolves.not.toThrow();

    const floor = Rule.range(0);
    await expect(floor(null, 0)).resolves.not.toThrow();
    await expect(floor(null, 2)).resolves.not.toThrow();
    await expect(floor(null, 22.33)).resolves.not.toThrow();
    await expect(floor(null, 100)).resolves.not.toThrow();
    await expect(floor(null, 10000)).resolves.not.toThrow();
    await expect(floor(null, -1)).rejects.toThrow();
    await expect(floor(null, -100)).rejects.toThrow();
    await expect(floor(null, -100, v => false)).resolves.not.toThrow();

    const ceil = Rule.range(null, 100);
    await expect(ceil(null, 0)).resolves.not.toThrow();
    await expect(ceil(null, 2)).resolves.not.toThrow();
    await expect(ceil(null, 22.33)).resolves.not.toThrow();
    await expect(ceil(null, 100)).resolves.not.toThrow();
    await expect(ceil(null, -1)).resolves.not.toThrow();
    await expect(ceil(null, -1000)).resolves.not.toThrow();
    await expect(ceil(null, 100.01)).rejects.toThrow();
    await expect(ceil(null, 100.01, v => false)).resolves.not.toThrow();
  });

  test('required', async () => {
    expect(Rule.required).toBeDefined();
    const required = Rule.required();
    await expect(required()).rejects.toThrow();
    await expect(required(null)).rejects.toThrow();
    await expect(required(null, null)).rejects.toThrow();
    await expect(required(null, undefined)).rejects.toThrow();
    await expect(required(null, {})).resolves.not.toThrow();
    await expect(required(null, { name: 'Rich' })).resolves.not.toThrow();
  });

  test('email', async () => {
    const thunk = new Rule((f, v) => !isEmail(v));
    await expect(thunk(null, 'me@mail.com')).resolves.not.toThrow();
    await expect(thunk(null, 'you@mail.com')).resolves.not.toThrow();
    await expect(thunk(null, 'them@mail.com')).resolves.not.toThrow();
    await expect(thunk(null, 'me.you.them@email.com')).resolves.not.toThrow();
    await expect(thunk(null, 'me.you.email.com')).rejects.toThrow();
    await expect(thunk(null, 'me@')).rejects.toThrow();
    await expect(thunk(null, 'me@.com')).rejects.toThrow();
    await expect(thunk(null, 'me@.com', () => false)).resolves.not.toThrow();
  });
});
