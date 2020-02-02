import isEmail from 'validator/lib/isEmail';
import Quin from '../../src/quin/Quin';
import Rule from '../../src/quin/Rule';
import graphSchema from '../schema';

const quin = new Quin();
// const email = Rule.factory('email', () => v => !isEmail(v));
// quin.register('email', email());
const schema = quin.mergeSchema(graphSchema);
const { Person, Book, Art } = schema.getModelMap();

describe('Model', () => {
  test('Transform', () => {
    expect(Person.transform({ name: 'rich' })).toEqual({ name: 'Rich' });
    expect(Person.transform({ name: 'RICH' })).toEqual({ name: 'Rich' });
    expect(Person.transform({ name: 'RicH' })).toEqual({ name: 'Rich' });
  });

  // test('Rules', () => {
  //   const required = v => v === null;
  //   expect(() => Person.validate({ name: 'rich' })).toThrow();
  //   expect(() => Person.validate({ name: 'rich', emailAddress: 'me@' })).toThrow();
  //   expect(() => Person.validate({ name: 'rich' }, { required })).not.toThrow();
  //   expect(() => Person.validate({ name: 'rich', emailAddress: 'me@me.com' })).not.toThrow();

  //   expect(() => Book.validate()).toThrow();
  //   expect(() => Book.validate(null)).toThrow();
  //   expect(() => Book.validate({ name: 'book' })).toThrow();
  //   expect(() => Book.validate({ price: '50.55' })).toThrow();
  //   expect(() => Book.validate({ name: 'the bible' }, { required })).toThrow();
  //   expect(() => Book.validate({ price: '150.55' }, { required })).toThrow();
  //   expect(() => Book.validate({ price: '50.55' }, { required })).not.toThrow();
  //   expect(() => Book.validate(null, { required })).not.toThrow();

  //   expect(() => Art.validate({ name: 'art', comments: 'yes' })).not.toThrow();
  //   expect(() => Art.validate({ name: 'art', comments: ['yes'] })).not.toThrow();
  //   expect(() => Art.validate({ name: 'art', comments: ['yes', 'maybe'] })).not.toThrow();
  //   expect(() => Art.validate({ name: 'art', comments: ['yes', 'maybe', 'perhaps'] })).toThrow();
  // });
});