import Transformer from '../../src/quin/Transformer';

describe('Transformer', () => {
  test('case', () => {
    expect(Transformer.toLowerCase()('RiChArD')).toBe('richard');
    expect(Transformer.toUpperCase()('RiChArD')).toBe('RICHARD');
    expect(Transformer.toTitleCase()('now is the time for all good men to come to the aid of their country')).toBe('Now Is The Time For All Good Men To Come To The Aid Of Their Country');
    expect(Transformer.toSentenceCase()('now is the time for all good men to come to the aid of their country')).toBe('Now is the time for all good men to come to the aid of their country');
    expect(Transformer.dedupe()(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
  });
});
