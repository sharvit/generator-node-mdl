import <%= camelProject %>, { namedExport } from './index';

test('output', () => {
  expect(<%= camelProject %>('🐰')).toBe('🐰');
  expect(<%= camelProject %>()).toBe('No args passed!');

  expect(namedExport('🐰')).toBe('🐰');
  expect(namedExport()).toBe('No args passed!');
});
