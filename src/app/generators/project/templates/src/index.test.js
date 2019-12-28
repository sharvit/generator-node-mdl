import <%= camelProject %>, { isEven, isOdd } from './index';

describe('node-mdl-starter', () => {
  test('default', () => {
    expect(<%= camelProject %>('🐰')).toBe('🐰');
    expect(<%= camelProject %>()).toBe('No args passed!');
  });

  /** @test {isEven} */
  test('isEven', () => {
    for (let i = 0; i < 20; i += 2) {
      expect(isEven(i)).toBe(true);
    }

    for (let i = 1; i < 20; i += 2) {
      expect(isEven(i)).toBe(false);
    }

    expect(() => isEven('not-a-number')).toThrow(TypeError);
  });

  /** @test {isOdd} */
  test('isOdd', () => {
    for (let i = 0; i < 20; i += 2) {
      expect(isOdd(i)).toBe(false);
    }

    for (let i = 1; i < 20; i += 2) {
      expect(isOdd(i)).toBe(true);
    }

    expect(() => isOdd('not-a-number')).toThrow(TypeError);
  });
});
