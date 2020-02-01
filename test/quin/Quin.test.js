import Quin from '../../src/quin/Quin';
import graphSchema from '../schema';

let schema;
const quin = new Quin();

describe('Quin', () => {
  test('mergeSchema', () => {
    schema = quin.mergeSchema(graphSchema);
    expect(schema).toBeDefined();
  });
});
