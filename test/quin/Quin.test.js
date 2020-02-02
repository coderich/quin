import Quin from '../../src/quin/Quin';
import Rule from '../../src/quin/Rule';
import Transformer from '../../src/quin/Transformer';
import graphSchema from '../schema';

let schema;
const quin = new Quin();

describe('Quin', () => {
  test('register', () => {
    // Incorrect
    expect(() => quin.register()).toThrow();
    expect(() => quin.register('bull')).toThrow();
    expect(() => quin.register('bull', () => {})).toThrow();
    expect(() => quin.register('bs', new Rule())).toThrow();
    expect(() => quin.register('nope', new Rule(() => {}))).toThrow();
    expect(() => quin.register('bad', Rule.required)).toThrow();
    expect(() => quin.register('a', Rule.factory('badRule'))).toThrow();
    expect(() => quin.register('b', Rule.factory('badRule', () => {}))).toThrow();
    expect(() => quin.register('c', new Transformer())).toThrow();
    expect(() => quin.register('d', new Transformer(() => {}))).toThrow();
    expect(() => quin.register('e', Transformer.toLowerCase)).toThrow();
    expect(() => quin.register('f', Transformer.factory('badTransformer'))).toThrow();
    expect(() => quin.register('g', Transformer.factory('badTransformer', () => {}))).toThrow();

    // Proper
    const rule = quin.register('rule', Rule.factory('myRule', () => {})()); // Instantiating instance
    const transformer = quin.register('transformer', Transformer.factory('myTransformer', () => {})()); // Instantiating instance
    expect(Rule.myRule).toBeDefined();
    expect(rule).toBeDefined();
    expect(rule.method).toBe('myRule');
    expect(rule.type).toBe('rule');
    expect(Transformer.myTransformer).toBeDefined();
    expect(transformer).toBeDefined();
    expect(transformer.method).toBe('myTransformer');
    expect(transformer.type).toBe('transformer');
  });

  test('mergeSchema', () => {
    schema = quin.mergeSchema(graphSchema);
    expect(schema).toBeDefined();

    const models = schema.getModels();
    expect(models.length).toBe(10);
  });
});
