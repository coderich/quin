import * as TransformService from '../../src/service/transform.service';

describe('TransformService', () => {
  test('Case', () => {
    expect(TransformService.lowerCase('RiChArD')).toBe('richard');
    expect(TransformService.upperCase('RiChArD')).toBe('RICHARD');
    expect(TransformService.titleCase('now is the time for all good men to come to the aid of their country')).toBe('Now Is The Time For All Good Men To Come To The Aid Of Their Country');
    expect(TransformService.sentenceCase('now is the time for all good men to come to the aid of their country')).toBe('Now is the time for all good men to come to the aid of their country');
  });
});
