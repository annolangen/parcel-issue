import { Factor, newFactor } from './factor';
import arrayContaining = jasmine.arrayContaining;

describe('Factor', () => {
  const elements = ['y', 'n', 'y', 'n', 'n', 'n'];
  const f = newFactor(elements);
  it('has size', () => {
    expect(f.size).toBe(6);
  });
  it('has levels', () => {
    expect(f.level).toEqual(arrayContaining(['y', 'n']));
  });
  it('has elements', () => {
    expect([...f.elements()]).toEqual(elements);
  });
  it('can loop over elements', () => {
    const histogram: { [key: string]: number } = { y: 0, n: 0 };
    for (const v of f.elements()) {
      histogram[v] += 1;
    }
    expect(histogram).toEqual({ y: 2, n: 4 });
  });
});
