import { Result, Ok, Err } from '../src/index.js';
import { jest } from '@jest/globals';

const err1 = Err(1);

test('Err(1) instanceof Result', () =>
  expect(err1).toBeInstanceOf(Result)
);

test('Err(1) instanceof Err', () =>
  expect(err1).toBeInstanceOf(Err)
);

test('Err(1).isOk = false', () =>
  expect(err1.isOk).toBe(false)
);

test('Err(1).isErr = true', () =>
  expect(err1.isErr).toBe(true)
);

test('Err(1).map(fn) does not call fn', () => {
  const fn = jest.fn();
  err1.map(fn);

  expect(fn.mock.calls.length).toBe(0);
});

test('Err(1).map(x => x + 1) = Err(1)', () =>
  expect(err1.map(x => x + 1)).toBe(err1)
);

test('Err(1).map(x => Ok(x + 1)) = Err(1)', () =>
  expect(err1.map(x => Ok(x + 1))).toBe(err1)
);

test('Err(1).map(_ => Err("Oh no!")) = Err(1)', () =>
  expect(err1.map(_ => Err('Oh no!'))).toBe(err1)
);

test('Err(1).mapErr(fn) calls fn', () => {
  const fn = jest.fn();
  err1.mapErr(fn);

  expect(fn.mock.calls.length).toBe(1);
  expect(fn.mock.calls[0]).toEqual([1]);
});

test('Err(1).mapErr(x => x + 1) = Err(2)', () =>
  expect(err1.mapErr(x => x + 1).getErr()).toBe(2)
);

test('Err(1).forEach(fn) does not call fn', () => {
  const fn = jest.fn();
  err1.forEach(fn);

  expect(fn.mock.calls.length).toBe(0);
});

test('Err(1).forEach(fn) = Err(1)', () =>
  expect(err1.forEach(x => x + 1)).toBe(err1)
);

test('Err(1).forEachErr(fn) calls fn', () => {
  const fn = jest.fn();
  err1.forEachErr(fn);

  expect(fn.mock.calls.length).toBe(1);
  expect(fn.mock.calls[0]).toEqual([1]);
});

test('Err(1).forEachErr(fn) = Err(1)', () =>
  expect(err1.forEachErr(x => x + 1)).toBe(err1)
);

test('Err(1).merge() = 1', () =>
  expect(err1.merge()).toBe(1)
);

test('Err(1).merge(x => x + 1) = 1', () =>
  expect(err1.merge(x => x + 1)).toBe(1)
);

test('Err(1).merge(x => x + 1, y => y + 2) = 3', () =>
  expect(err1.merge(x => x + 1, y => y + 2)).toBe(3)
);

test('results respect array interface', () => {
  expect(err1.length).toBe(2);
  expect(err1[0]).toBe(undefined);
  expect(err1[1]).toBe(1);
});

test('const [ok, err] = err1; gives [undefined, 1]', () => {
  const [ok, err] = err1;

  expect(ok).toBe(undefined);
  expect(err).toBe(1);
});
