import Transformer from '../../src/core/Transformer';

describe('Transformer', () => {
  test('case', () => {
    expect(Transformer.toLowerCase()(null, 'RiChArD')).toBe('richard');
    expect(Transformer.toUpperCase()(null, 'RiChArD')).toBe('RICHARD');
    expect(Transformer.toTitleCase()(null, 'now is the time for all good men to come to the aid of their country')).toBe('Now Is The Time For All Good Men To Come To The Aid Of Their Country');
    expect(Transformer.toSentenceCase()(null, 'now is the time for all good men to come to the aid of their country')).toBe('Now is the time for all good men to come to the aid of their country');
    expect(Transformer.dedupe()(null, ['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    expect(Transformer.cast('Int')(null, '123.34')).toEqual(123);
    expect(Transformer.cast('Float')(null, '89.337')).toEqual(89.337);
    expect(Transformer.cast('Number')(null, '89.337')).toEqual(89.337);
    expect(Transformer.cast('String')(null, 89.92)).toEqual('89.92');
    expect(Transformer.cast('Boolean')(null, 'true')).toEqual(true);
    expect(Transformer.cast('Boolean')(null, 'false')).toEqual(false);
  });
});
