import Quin from '../../src/quin/Quin';
import Rule from '../../src/quin/Rule';
import Transformer from '../../src/quin/Transformer';
import graphSchema from '../schema';

let schema;
const quin = new Quin();

describe('Quin', () => {
  test('mergeSchema', () => {
    schema = quin.mergeSchema(graphSchema);
    expect(schema).toBeDefined();
  });

  test('register', () => {
    // Incorrect
    expect(() => quin.register()).toThrow();
    expect(() => quin.register('bull')).toThrow();
    expect(() => quin.register(() => {})).toThrow();
    expect(() => quin.register(new Rule())).toThrow();
    expect(() => quin.register(new Rule(() => {}))).toThrow();
    expect(() => quin.register(Rule.required)).toThrow();
    expect(() => quin.register(Rule.factory('badRule'))).toThrow();
    expect(() => quin.register(Rule.factory('badRule', () => {}))).toThrow();
    expect(() => quin.register(new Transformer())).toThrow();
    expect(() => quin.register(new Transformer(() => {}))).toThrow();
    expect(() => quin.register(Transformer.toLowerCase)).toThrow();
    expect(() => quin.register(Transformer.factory('badTransformer'))).toThrow();
    expect(() => quin.register(Transformer.factory('badTransformer', () => {}))).toThrow();

    // Proper
    quin.register(Rule.factory('myRule', () => {})()); // Instantiating instance
    quin.register(Transformer.factory('myTransformer', () => {})()); // Instantiating instance
    expect(Rule.myRule).toBeDefined();
    expect(Transformer.myTransformer).toBeDefined();
  });
});
