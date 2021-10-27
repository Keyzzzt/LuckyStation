import { addFn } from '@src/add';

describe('Test', () => {
  it('Should pass', () => {
    expect(addFn(2, 4)).toBe(6);
  });
});
