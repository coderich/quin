import Schema from '../../src/core/Schema';
import typeDefs from '../typeDefs';

const schema = new Schema(typeDefs);
const [person, book] = schema.getModels();
const [personFields, bookFields] = [person.getFields(), book.getFields()];
const [personId, personName, personAuthored] = personFields;
const [,, bookAuthor, bookPrice] = bookFields;

describe('Schema', () => {
  test('sanity', () => {
    expect(personFields.length).toBe(5);
    expect(bookFields.length).toBe(4);
  });

  test('schema', () => {
    expect(schema.getModel('Person')).toBe(person);
    expect(schema.getModel('Book')).toBe(book);
  });

  test('personModel', () => {
    expect(person.getName()).toBe('Person');
    expect(person.getField('id')).toBe(personId);
    expect(person.getField('name')).toBe(personName);
    expect(person.getField('authored')).toBe(personAuthored);
    expect(person.getDataRefFields()).toEqual([personAuthored]);
    expect(person.getEmbeddedArrayFields()).toEqual([]);
    expect(person.getCountableFields()).toEqual([personAuthored]);
    expect(person.getScalarFields().length).toEqual(4);
    expect(person.getCreateFields().length).toEqual(3);
    expect(person.getUpdateFields().length).toEqual(3);
    expect(person.getOnDeleteFields()).toEqual([]);
  });

  test('bookModel', () => {
    expect(book.getName()).toBe('Book');
    expect(book.getField('author')).toBe(bookAuthor);
    expect(book.getDataRefFields()).toEqual([bookAuthor]);
    expect(book.getEmbeddedArrayFields()).toEqual([]);
    expect(book.getCountableFields()).toEqual([]);
    expect(book.getScalarFields().length).toEqual(3);
    expect(book.getCreateFields().length).toEqual(3);
    expect(book.getUpdateFields().length).toEqual(2);
    expect(book.getOnDeleteFields()).toEqual([bookAuthor]);
  });

  test('personFields', () => {
    // Data types
    expect(personId.getName()).toBe('id');
    expect(personId.getDataType()).toBe('ID');
    expect(personName.getName()).toBe('name');
    expect(personName.getDataType()).toBe('String');
    expect(personName.getDataRef()).toBeNull();
    expect(personAuthored.getName()).toBe('authored');
    expect(personAuthored.getDataType()).toBe('Book');
    expect(personAuthored.getDataRef()).toBe('Book');

    // Booleans
    expect(personName.isArray()).toBe(false);
    expect(personName.isScalar()).toBe(true);
    expect(personName.isVirtual()).toBe(false);
    expect(personName.isImmutable()).toBe(false);
    expect(personName.isRequired()).toBe(true);

    expect(personAuthored.isArray()).toBe(true);
    expect(personAuthored.isScalar()).toBe(false);
    expect(personAuthored.isVirtual()).toBe(true);
    expect(personAuthored.isImmutable()).toBe(false);
    expect(personAuthored.isRequired()).toBe(false);

    // // Options
    // expect(personName.getTransforms()).toBe(false);
    // expect(personName.getRules()).toBe(false);
    // expect(personName.getOnDelete()).toBe(false);
  });

  test('bookFields', () => {
    // Data types
    expect(bookAuthor.getName()).toBe('author');
    expect(bookAuthor.getDataType()).toBe('Person');
    expect(bookAuthor.getDataRef()).toBe('Person');
    expect(bookPrice.getName()).toBe('price');
    expect(bookPrice.getDataType()).toBe('Float');

    // Booleans
    expect(bookAuthor.isArray()).toBe(false);
    expect(bookAuthor.isScalar()).toBe(false);
    expect(bookAuthor.isVirtual()).toBe(false);
    expect(bookAuthor.isImmutable()).toBe(true);
    expect(bookAuthor.isRequired()).toBe(true);

    // // Options
    // expect(personName.getTransforms()).toBe(false);
    // expect(personName.getRules()).toBe(false);
    // expect(personName.getOnDelete()).toBe(false);
  });
});
