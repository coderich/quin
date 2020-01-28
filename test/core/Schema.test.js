import Schema from '../../src/core/Schema';
import typeDefs from '../typeDefs';

const schema = new Schema(typeDefs);
const { Person, Book, Chapter, Page, Building, Library, Apartment, Color } = schema.getModelMap();
const [personFields, bookFields] = [Person.getFields(), Book.getFields()];
const [personId, personName, personAuthored,, personFriends] = personFields;
const [bookId, bookName, bookPrice, bookAuthor, bookBestSeller, bookBids, bookChapters] = bookFields;

describe('Schema', () => {
  test('sanity', () => {
    expect(personFields.length).toBe(6);
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
    expect(Person.getDataRefFields()).toEqual([personAuthored, personFriends]);
    expect(Person.getEmbeddedArrayFields()).toEqual([personFriends]);
    expect(Person.getCountableFields()).toEqual([personAuthored, personFriends]);
    expect(Person.getScalarFields().length).toEqual(4);
    expect(Person.getCreateFields().length).toEqual(4);
    expect(Person.getUpdateFields().length).toEqual(4);
    expect(Person.getOnDeleteFields()).toEqual([personFriends]);
    expect(Person.getAlias()).toBe('user');
    expect(Person.getIndexes()).toEqual([{ name: 'uix_person_name', type: 'unique', on: 'name' }]);
    expect(Person.getDriver()).toBe('default');
    expect(Person.isHidden()).toBe(false);
    expect(Person.isVisible()).toBe(true);
    expect(Person.referentialIntegrity().length).toBe(8);
  });

  test('bookModel', () => {
    expect(Book.getName()).toBe('Book');
    expect(Book.getField('author')).toBe(bookAuthor);
    expect(Book.getField('author.friends')).toBe(personFriends);
    expect(Book.getDataRefFields()).toEqual([bookAuthor, bookChapters]);
    expect(Book.getEmbeddedArrayFields()).toEqual([bookBids]);
    expect(Book.getCountableFields()).toEqual([bookChapters]);
    expect(Book.getScalarFields().length).toEqual(5);
    expect(Book.getCreateFields().length).toEqual(5);
    expect(Book.getUpdateFields().length).toEqual(4);
    expect(Book.getOnDeleteFields()).toEqual([bookAuthor]);
    expect(Book.getAlias()).toBe('Book');
    expect(Book.getIndexes()).toEqual([{ name: 'uix_book', type: 'unique', on: ['name', 'author'] }]);
    expect(Book.getDriver()).toBe('default');
    expect(Book.isHidden()).toBe(false);
    expect(Book.isVisible()).toBe(true);
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
    expect(personAuthored.getDataType()).toContainEqual('Book'); // Since we append isSet for now
    expect(personAuthored.getDataType().isSet).toBe(false);
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
    expect(personAuthored.getVirtualModel()).toBe(Book);
    expect(personAuthored.getVirtualField()).toBe(bookAuthor);

    // // Options
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
    expect(bookChapters.getVirtualModel()).toBe(Chapter);
    expect(bookChapters.getVirtualField()).toBe(Chapter.getField('book'));

    // // Options
    // expect(personName.getOnDelete()).toBe(false);
  });

  test('otherTests', () => {
    const { isDefault } = Color.getFieldMap();
    const { tenants } = Building.getFieldMap();
    expect(tenants.getDataType()).toContainEqual('Person');
    expect(tenants.getDataType().isSet).toBe(true);
    expect(Library.getField('building').isEmbedded()).toBe(true);
    expect(Apartment.getField('building').isEmbedded()).toBe(true);
    expect(isDefault.getAlias()).toBe('is_default');
    expect(Building.isHidden()).toBe(true);
    expect(Page.getIndexes()).toEqual([
      { name: 'uix_page', type: 'unique', on: ['number', 'chapter'] },
      { name: 'uix_page_verbage', type: 'unique', on: 'verbage' },
    ]);
  });
});
