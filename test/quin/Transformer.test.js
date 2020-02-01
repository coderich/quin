import Transformer from '../../src/quin/Transformer';

describe('Transformer', () => {
  test('case', () => {
    expect(new Transformer(Transformer.toLowerCase())('RiChArD')).toBe('richard');
    expect(new Transformer(Transformer.toUpperCase())('RiChArD')).toBe('RICHARD');
    expect(new Transformer(Transformer.toTitleCase())('now is the time for all good men to come to the aid of their country')).toBe('Now Is The Time For All Good Men To Come To The Aid Of Their Country');
    expect(new Transformer(Transformer.toSentenceCase())('now is the time for all good men to come to the aid of their country')).toBe('Now is the time for all good men to come to the aid of their country');
    expect(new Transformer(Transformer.dedupe())(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
  });
});
