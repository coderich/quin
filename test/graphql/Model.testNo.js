import typeDefs from '../typeDefs';
import Schema from '../../src/core/Schema';
import * as RuleService from '../../src/service/rule.service';

const schema = new Schema(typeDefs);
const { Person, Book, Art } = schema.getModelMap();

describe('Model', () => {
  test('Transform', () => {
    expect(Person.transform({ name: 'rich' })).toEqual({ name: 'Rich' });
    expect(Person.transform({ name: 'RICH' })).toEqual({ name: 'Rich' });
    expect(Person.transform({ name: 'RicH' })).toEqual({ name: 'Rich' });
  });

  test('Rules', () => {
    const required = v => v === null;
    expect(() => Person.validate({ name: 'rich' })).toThrow(RuleService.RequiredRuleError);
    expect(() => Person.validate({ name: 'rich', emailAddress: 'me@' })).toThrow(RuleService.EmailRuleError);
    expect(() => Person.validate({ name: 'rich' }, { required })).not.toThrow();
    expect(() => Person.validate({ name: 'rich', emailAddress: 'me@me.com' })).not.toThrow();

    expect(() => Book.validate()).toThrow(RuleService.RequiredRuleError);
    expect(() => Book.validate(null)).toThrow(RuleService.RequiredRuleError);
    expect(() => Book.validate({ name: 'book' })).toThrow(RuleService.RequiredRuleError);
    expect(() => Book.validate({ price: '50.55' })).toThrow(RuleService.RequiredRuleError);
    expect(() => Book.validate({ name: 'the bible' }, { required })).toThrow(RuleService.DenyRuleError);
    expect(() => Book.validate({ price: '150.55' }, { required })).toThrow(RuleService.RangeRuleError);
    expect(() => Book.validate({ price: '50.55' }, { required })).not.toThrow();
    expect(() => Book.validate(null, { required })).not.toThrow();

    expect(() => Art.validate({ name: 'art', comments: 'yes' })).not.toThrow();
    expect(() => Art.validate({ name: 'art', comments: ['yes'] })).not.toThrow();
    expect(() => Art.validate({ name: 'art', comments: ['yes', 'maybe'] })).not.toThrow();
    expect(() => Art.validate({ name: 'art', comments: ['yes', 'maybe', 'perhaps'] })).toThrow();
  });
});
