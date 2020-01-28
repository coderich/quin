import typeDefs from '../typeDefs';
import Schema from '../../src/core/Schema';
import * as RuleService from '../../src/service/rule.service';

const schema = new Schema(typeDefs);
const { Person, Book, Chapter, Building, Library, Apartment, Color } = schema.getModelMap();

describe('Model', () => {
  test('Transform', () => {
    expect(Person.transform({ name: 'rich' })).toEqual({ name: 'Rich' });
    expect(Person.transform({ name: 'RICH' })).toEqual({ name: 'Rich' });
    expect(Person.transform({ name: 'RicH' })).toEqual({ name: 'Rich' });
  });

  test('Rules', () => {
    const required = RuleService.required(true);
    expect(() => Person.validate({ name: 'rich' })).not.toThrow();
    expect(() => Person.validate({ name: 'rich', emailAddress: 'me@' })).toThrow(RuleService.EmailRuleError);
    expect(() => Person.validate({ name: 'rich' }, { required })).toThrow(RuleService.RequiredRuleError);

    expect(() => Book.validate()).not.toThrow();
    expect(() => Book.validate(null)).not.toThrow();
    expect(() => Book.validate(null, { required })).toThrow(RuleService.RequiredRuleError);
    expect(() => Book.validate({ name: 'book' })).not.toThrow();
    expect(() => Book.validate({ name: 'the bible' })).toThrow(RuleService.DenyRuleError);
    expect(() => Book.validate({ price: '50.55' })).not.toThrow();
    expect(() => Book.validate({ price: '150.55' })).toThrow(RuleService.RangeRuleError);
  });
});
