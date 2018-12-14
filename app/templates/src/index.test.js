import <%= camelProject %> from '.';

test('output', () => {
  expect(<%= camelProject %>('🐰')).toBe('🐰');
  expect(<%= camelProject %>()).toBe('No args passed!');
});
