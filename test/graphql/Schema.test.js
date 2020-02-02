import Quin from '../../src/core/Quin';
import graphSchema from '../schema';

const schema = new Quin(graphSchema);
const { Person, Book, Building } = schema.getModelMap();
const [personFields, bookFields] = [Person.getFields(), Book.getFields()];
const [personId, personName, personAuthored,, personFriends] = personFields;
const [bookId, bookName, bookPrice, bookAuthor, bookBestSeller, bookBids, bookChapters] = bookFields;

describe('Schema', () => {
  test('sanity', () => {
    expect(personFields.length).toBe(7);
    expect(bookFields.length).toBe(7);
  });

  test('schema', () => {
    expect(schema.getModels().length).toBe(10);
    expect(schema.getModel('Person')).toBe(Person);
    expect(schema.getModel('Book')).toBe(Book);
    expect(schema.getModel('Building')).toBe(Building);
  });

  test('personModel', () => {
    expect(Person.getName()).toBe('Person');
    expect(Person.getField('id')).toBe(personId);
    expect(Person.getField('name')).toBe(personName);
    expect(Person.getField('authored')).toBe(personAuthored);
    expect(Person.getField('authored.id')).toBe(bookId);
    expect(Person.getField('authored.name')).toBe(bookName);
    expect(Person.getScalarFields().length).toEqual(5);
    expect(Person.getArrayFields().length).toEqual(2);
    expect(Person.getDataRefFields()).toEqual([personAuthored, personFriends]);
  });

  test('bookModel', () => {
    expect(Book.getName()).toBe('Book');
    expect(Book.getField('author')).toBe(bookAuthor);
    expect(Book.getField('author.friends')).toBe(personFriends);
    expect(Book.getScalarFields().length).toEqual(5);
    expect(Person.getArrayFields().length).toEqual(2);
    expect(Book.getDataRefFields()).toEqual([bookAuthor, bookChapters]);
  });

  test('personFields', () => {
    // Data types
    expect(personId.getName()).toBe('id');
    expect(personId.getType()).toBe('ID');
    expect(personName.getName()).toBe('name');
    expect(personName.getType()).toBe('String');
    expect(personName.getDataRef()).toBeNull();
    expect(personAuthored.getName()).toBe('authored');
    expect(personAuthored.getType()).toBe('Book');
    expect(personAuthored.getDataRef()).toBe('Book');

    // Booleans
    expect(personName.isArray()).toBe(false);
    expect(personName.isScalar()).toBe(true);
    expect(personName.isRequired()).toBe(true);
    expect(personAuthored.isArray()).toBe(true);
    expect(personAuthored.isScalar()).toBe(false);
    expect(personAuthored.isRequired()).toBe(false);
  });

  test('bookFields', () => {
    // Data types
    expect(bookAuthor.getName()).toBe('author');
    expect(bookAuthor.getType()).toBe('Person');
    expect(bookAuthor.getDataRef()).toBe('Person');
    expect(bookPrice.getName()).toBe('price');
    expect(bookPrice.getType()).toBe('Float');

    // Booleans
    expect(bookAuthor.isArray()).toBe(false);
    expect(bookAuthor.isScalar()).toBe(false);
    expect(bookAuthor.isRequired()).toBe(true);
  });
});
