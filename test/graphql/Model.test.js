import Quin from '../../src/core/Quin';
import graphSchema from '../schema';

const schema = new Quin(graphSchema);
const { Person, Book, Art } = schema.getModels();

describe('Model', () => {
  test('Transform', () => {
    expect(Person.transform({ name: 'rich' })).toEqual({ name: 'Rich' });
    expect(Person.transform({ name: 'RICH' })).toEqual({ name: 'Rich' });
    expect(Person.transform({ name: 'RicH' })).toEqual({ name: 'Rich' });
    expect(Person.transform({ name: 'RicH', authored: ['book1', 'book2'], hero: 'paul' })).toEqual({ name: 'Rich', authored: ['book1', 'book2'], hero: 'richard' });
  });

  test('Rules', async () => {
    const required = v => v === null;
    await expect(Person.validate({ name: 'rich' })).rejects.toThrow();
    await expect(Person.validate({ name: 'rich', emailAddress: 'me@' })).rejects.toThrow();
    await expect(Person.validate({ name: 'rich' }, { required })).resolves.toBeDefined();
    await expect(Person.validate({ name: 'rich', emailAddress: 'me@me.com' })).resolves.toBeDefined();

    await expect(Book.validate()).rejects.toThrow();
    await expect(Book.validate(null)).rejects.toThrow();
    await expect(Book.validate({ name: 'book' })).rejects.toThrow();
    await expect(Book.validate({ price: '50.55' })).rejects.toThrow();
    await expect(Book.validate({ name: 'the bible' }, { required })).rejects.toThrow();
    await expect(Book.validate({ price: '150.55' }, { required })).rejects.toThrow();
    await expect(Book.validate({ price: '50.55' }, { required })).resolves.toBeDefined();
    await expect(Book.validate(null, { required })).resolves.toBeDefined();
    await expect(Book.validate({ name: 'book', price: '50.55', author: 'abcde' })).resolves.toBeDefined();


    await expect(Art.validate({ name: 'art', comments: 'yes' })).resolves.toBeDefined();
    await expect(Art.validate({ name: 'art', comments: ['yes'] })).resolves.toBeDefined();
    await expect(Art.validate({ name: 'art', comments: ['yes', 'maybe'] })).resolves.toBeDefined();
    await expect(Art.validate({ name: 'art', comments: ['yes', 'maybe', 'perhaps'] })).rejects.toThrow();
  });
});
