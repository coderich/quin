import Schema from '../../src/core/Schema';
import typeDefs from '../typeDefs';

const schema = new Schema(typeDefs);
const [person, book] = schema.getModels();
const [personFields, bookFields] = [person.getFields(), book.getFields()];
const [personId, personName, personAuthored] = personFields;

describe('Schema', () => {
  test('sanity', () => {
    expect(personFields.length).toBe(5);
    expect(bookFields.length).toBe(3);
  });

  test('schema', () => {
    expect(schema.getModel('Person')).toBe(person);
    expect(schema.getModel('Book')).toBe(book);
  });

  test('model', () => {
    expect(person.getField('id')).toBe(personId);
    expect(person.getField('name')).toBe(personName);
    expect(person.getField('authored')).toBe(personAuthored);
    expect(person.getDataRefFields()).toEqual([personAuthored]);
    expect(person.getEmbeddedArrayFields()).toEqual([personAuthored]);
  });

  test('field', () => {
    // Data types
    expect(personId.getDataType()).toBe('ID');
    expect(personName.getDataType()).toBe('String');
    expect(personName.getDataRef()).toBeNull();
    expect(personAuthored.getDataType()).toBe('Book');
    expect(personAuthored.getDataRef()).toBe('Book');

    // Booleans
    expect(personName.isArray()).toBe(false);
    expect(personName.isScalar()).toBe(true);
    // expect(personName.isVirtual()).toBe(true);
    // expect(personName.isEmbedded()).toBe(true);
    // expect(personName.isImmutable()).toBe(true);
    expect(personName.isRequired()).toBe(true);

    expect(personAuthored.isArray()).toBe(true);
    expect(personAuthored.isScalar()).toBe(false);
    // expect(personAuthored.isVirtual()).toBe(true);
    // expect(personAuthored.isEmbedded()).toBe(true);
    // expect(personAuthored.isImmutable()).toBe(true);
    expect(personAuthored.isRequired()).toBe(false);

    // // Options
    // expect(personName.getTransforms()).toBe(false);
    // expect(personName.getRules()).toBe(false);
    // expect(personName.getOnDelete()).toBe(false);
  });
});
