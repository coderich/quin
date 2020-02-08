import Quin from '../../src/core/Quin';
import Rule from '../../src/core/Rule';
import Transformer from '../../src/core/Transformer';
import graphSchema from '../schema';

describe('Quin', () => {
  test('factory', () => {
    // Incorrect
    expect(() => Quin.extend()).toThrow();
    expect(() => Quin.extend('bull')).toThrow();
    expect(() => Quin.extend('bull', () => {})).toThrow();
    expect(() => Quin.extend('bs', new Rule())).toThrow();
    expect(() => Quin.extend('nope', new Rule(() => {}))).toThrow();
    expect(() => Quin.extend('bad', Rule.required)).toThrow();
    expect(() => Quin.extend('a', Rule.factory('badRule'))).toThrow();
    expect(() => Quin.extend('b', Rule.factory('badRule', () => {}))).toThrow();
    expect(() => Quin.extend('c', new Transformer())).toThrow();
    expect(() => Quin.extend('d', new Transformer(() => {}))).toThrow();
    expect(() => Quin.extend('e', Transformer.toLowerCase)).toThrow();
    expect(() => Quin.extend('f', Transformer.factory('badTransformer'))).toThrow();
    expect(() => Quin.extend('g', Transformer.factory('badTransformer', () => {}))).toThrow();

    // Proper
    const rule = Quin.extend('rule', Rule.factory('myRule', () => {})()); // Instantiating instance
    const transformer = Quin.extend('transformer', Transformer.factory('myTransformer', () => {})()); // Instantiating instance
    expect(Rule.myRule).toBeDefined();
    expect(rule).toBeDefined();
    expect(rule.method).toBe('myRule');
    expect(rule.type).toBe('rule');
    expect(Transformer.myTransformer).toBeDefined();
    expect(transformer).toBeDefined();
    expect(transformer.method).toBe('myTransformer');
    expect(transformer.type).toBe('transformer');
  });

  test('schema', async () => {
    const schema = new Quin(graphSchema);
    expect(schema).toBeDefined();

    const { email, bookName } = schema.getRules();
    const { toLowerCase } = schema.getTransformers();

    expect(email).toBeDefined();
    expect(toLowerCase).toBeDefined();
    expect(bookName).toBeDefined();

    await expect(email('hi')).rejects.toThrow();
    await expect(email('me@me.com')).resolves;
    await expect(bookName('The Bible')).rejects.toThrow();
    await expect(bookName('Anything else')).resolves;
  });
});
