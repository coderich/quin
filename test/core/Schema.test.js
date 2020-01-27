import Schema from '../../src/core/Schema';
import typeDefs from '../typeDefs';

const schema = new Schema(typeDefs);
const [person, book, chapter] = schema.getModels();
const [personFields, bookFields, chapterFields] = [person.getFields(), book.getFields(), chapter.getFields()];
const [personId, personName, personAuthored,, personFriends] = personFields;
const [bookId, bookName, bookPrice, bookAuthor, bookBestSeller, bookBids, bookChapters] = bookFields;
const [chapterId, chapterName, chapterBook] = chapterFields;

describe('Schema', () => {
  test('sanity', () => {
    expect(personFields.length).toBe(6);
    expect(bookFields.length).toBe(7);
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
    expect(person.getField('authored.id')).toBe(bookId);
    expect(person.getField('authored.name')).toBe(bookName);
    expect(person.getDataRefFields()).toEqual([personAuthored, personFriends]);
    expect(person.getEmbeddedArrayFields()).toEqual([personFriends]);
    expect(person.getCountableFields()).toEqual([personAuthored, personFriends]);
    expect(person.getScalarFields().length).toEqual(4);
    expect(person.getCreateFields().length).toEqual(4);
    expect(person.getUpdateFields().length).toEqual(4);
    expect(person.getOnDeleteFields()).toEqual([]);
    expect(person.getAlias()).toBe('user');
    expect(person.getIndexes().length).toBe(1);
    expect(person.getDriver()).toBe('default');
    expect(person.isHidden()).toBe(false);
    expect(person.isVisible()).toBe(true);
  });

  test('bookModel', () => {
    expect(book.getName()).toBe('Book');
    expect(book.getField('author')).toBe(bookAuthor);
    expect(book.getField('author.friends')).toBe(personFriends);
    expect(book.getDataRefFields()).toEqual([bookAuthor, bookChapters]);
    expect(book.getEmbeddedArrayFields()).toEqual([bookBids]);
    expect(book.getCountableFields()).toEqual([bookChapters]);
    expect(book.getScalarFields().length).toEqual(5);
    expect(book.getCreateFields().length).toEqual(5);
    expect(book.getUpdateFields().length).toEqual(4);
    expect(book.getOnDeleteFields()).toEqual([bookAuthor]);
    expect(book.getAlias()).toBe('Book');
    expect(book.getIndexes().length).toBe(1);
    expect(book.getDriver()).toBe('default');
    expect(book.isHidden()).toBe(false);
    expect(book.isVisible()).toBe(true);
  });

  test('personFields', () => {
    // Data types
    expect(personId.getName()).toBe('id');
    expect(personId.getDataType()).toBe('ID');
    expect(personName.getName()).toBe('name');
    expect(personName.getDataType()).toBe('String');
    expect(personName.getSimpleType()).toBe('String');
    expect(personName.getDataRef()).toBeNull();
    expect(personAuthored.getName()).toBe('authored');
    expect(personAuthored.getDataType()).toEqual(['Book']);
    expect(personAuthored.getSimpleType()).toBe('Book');
    expect(personAuthored.getDataRef()).toBe('Book');

    // Booleans
    expect(personName.isArray()).toBe(false);
    expect(personName.isScalar()).toBe(true);
    expect(personName.isVirtual()).toBe(false);
    expect(personName.isImmutable()).toBe(false);
    expect(personName.isRequired()).toBe(true);
    expect(personName.isEmbedded()).toBe(false);

    expect(personAuthored.isArray()).toBe(true);
    expect(personAuthored.isScalar()).toBe(false);
    expect(personAuthored.isVirtual()).toBe(true);
    expect(personAuthored.isImmutable()).toBe(false);
    expect(personAuthored.isEmbedded()).toBe(false);
    expect(personAuthored.isRequired()).toBe(false);
    expect(personAuthored.getVirtualRef()).toBe('author');
    expect(personAuthored.getVirtualModel()).toBe(book);
    expect(personAuthored.getVirtualField()).toBe(bookAuthor);

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
    expect(bookChapters.getVirtualRef()).toBe('book');
    expect(bookChapters.getVirtualModel()).toBe(chapter);
    expect(bookChapters.getVirtualField()).toBe(chapterBook);

    // // Options
    // expect(personName.getTransforms()).toBe(false);
    // expect(personName.getRules()).toBe(false);
    // expect(personName.getOnDelete()).toBe(false);
  });
});
