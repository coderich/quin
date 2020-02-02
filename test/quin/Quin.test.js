import Quin from '../../src/quin/Quin';
import Rule from '../../src/quin/Rule';
import Transformer from '../../src/quin/Transformer';
import graphSchema from '../schema';

describe('Quin', () => {
  test('factory', () => {
    // Incorrect
    expect(() => Quin.factory()).toThrow();
    expect(() => Quin.factory('bull')).toThrow();
    expect(() => Quin.factory('bull', () => {})).toThrow();
    expect(() => Quin.factory('bs', new Rule())).toThrow();
    expect(() => Quin.factory('nope', new Rule(() => {}))).toThrow();
    expect(() => Quin.factory('bad', Rule.required)).toThrow();
    expect(() => Quin.factory('a', Rule.factory('badRule'))).toThrow();
    expect(() => Quin.factory('b', Rule.factory('badRule', () => {}))).toThrow();
    expect(() => Quin.factory('c', new Transformer())).toThrow();
    expect(() => Quin.factory('d', new Transformer(() => {}))).toThrow();
    expect(() => Quin.factory('e', Transformer.toLowerCase)).toThrow();
    expect(() => Quin.factory('f', Transformer.factory('badTransformer'))).toThrow();
    expect(() => Quin.factory('g', Transformer.factory('badTransformer', () => {}))).toThrow();

    // Proper
    const rule = Quin.factory('rule', Rule.factory('myRule', () => {})()); // Instantiating instance
    const transformer = Quin.factory('transformer', Transformer.factory('myTransformer', () => {})()); // Instantiating instance
    expect(Rule.myRule).toBeDefined();
    expect(rule).toBeDefined();
    expect(rule.method).toBe('myRule');
    expect(rule.type).toBe('rule');
    expect(Transformer.myTransformer).toBeDefined();
    expect(transformer).toBeDefined();
    expect(transformer.method).toBe('myTransformer');
    expect(transformer.type).toBe('transformer');
  });

  test('schema', () => {
    const schema = new Quin(graphSchema);
    expect(schema).toBeDefined();

    const { email, bookName } = schema.getRules();
    const { toLowerCase } = schema.getTransformers();

    expect(email).toBeDefined();
    expect(toLowerCase).toBeDefined();
    expect(bookName).toBeDefined();

    expect(() => email('hi')).toThrow();
    expect(() => email('me@me.com')).not.toThrow();
    expect(() => bookName('The Bible')).toThrow();
    expect(() => bookName('Anything else')).not.toThrow();
  });
});
