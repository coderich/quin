import TransformService from '../../src/service/transform.service';

describe('TransformService', () => {
  test('Case', () => {
    expect(TransformService.toLowerCase()('RiChArD')).toBe('richard');
    expect(TransformService.toUpperCase()('RiChArD')).toBe('RICHARD');
    expect(TransformService.toTitleCase()('now is the time for all good men to come to the aid of their country')).toBe('Now Is The Time For All Good Men To Come To The Aid Of Their Country');
    expect(TransformService.toSentenceCase()('now is the time for all good men to come to the aid of their country')).toBe('Now is the time for all good men to come to the aid of their country');
    expect(TransformService.dedupe()(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
  });
});
