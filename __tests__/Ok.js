import { Result, Ok, Err } from '../src/index.js';

const ok0 = Ok(0);

test('Ok(0) instanceof Result', () =>
  expect(ok0).toBeInstanceOf(Result)
);

test('Ok(0) instanceof Ok', () =>
  expect(ok0).toBeInstanceOf(Ok)
);

test('Ok(0).isOk = true', () =>
  expect(ok0.isOk).toBe(true)
);

test('Ok(0).isErr = false', () =>
  expect(ok0.isErr).toBe(false)
);

test('Ok(0).map(x => x + 1) = Ok(1)', () =>
  expect(ok0.map(x => x + 1).get()).toBe(1)
);

test('Ok(0).map(x => Ok(x + 1)) = Ok(1)', () =>
  expect(ok0.map(x => Ok(x + 1)).get()).toBe(1)
);

test('Ok(0).map(_ => Err("Oh no!")) = Err("Oh no!")', () =>
  expect(ok0.map(_ => Err('Oh no!')).getErr()).toBe('Oh no!')
);

test('Ok(0).mapErr(fn) does not call fn', () => {
  const fn = jest.fn();
  ok0.mapErr(fn);

  expect(fn.mock.calls.length).toBe(0);
});

test('Ok(0).mapErr(x => x + 1) = Ok(0)', () =>
  expect(ok0.mapErr(x => x + 1)).toBe(ok0)
);

test('Ok(0).forEach(fn) calls fn', () => {
  const fn = jest.fn();
  ok0.forEach(fn);

  expect(fn.mock.calls.length).toBe(1);
  expect(fn.mock.calls[0]).toEqual([0]);
});

test('Ok(0).forEach(fn) = Ok(0)', () =>
  expect(ok0.forEach(x => x + 1)).toBe(ok0)
);

test('Ok(0).forEachErr(fn) does not call fn', () => {
  const fn = jest.fn();
  ok0.forEachErr(fn);

  expect(fn.mock.calls.length).toBe(0);
});

test('Ok(0).forEachErr(fn) = Ok(0)', () =>
  expect(ok0.forEachErr(x => x + 1)).toBe(ok0)
);

test('Ok(0).merge() = 0', () =>
  expect(ok0.merge()).toBe(0)
);

test('Ok(0).merge(x => x + 1) = 1', () =>
  expect(ok0.merge(x => x + 1)).toBe(1)
);

test('Ok(0).merge(x => x + 1, y => y + 2) = 1', () =>
  expect(ok0.merge(x => x + 1, y => y + 2)).toBe(1)
);

test('results respect array interface', () => {
  expect(ok0.length).toBe(2);
  expect(ok0[0]).toBe(0);
  expect(ok0[1]).toBe(undefined);
});

test('const [ok, err] = ok0; gives [0, undefined]', () => {
  const [ok, err] = ok0;

  expect(ok).toBe(0);
  expect(err).toBe(undefined);
});
