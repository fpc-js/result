import { Result, Ok, Err } from '../src';

/* eslint-disable brace-style, no-throw-literal, max-statements-per-line */

test('Result(fn) returns an `Ok` instance by default', () => {
  const res = Result(() => 1);

  expect(res.get()).toBe(1);
  expect(res).toBeInstanceOf(Ok);
});

test('Result(errFn) returns an `Err` instance', () => {
  const res = Result(() => { throw 'Oh no!'; });

  expect(res.getErr()).toBe('Oh no!');
  expect(res).toBeInstanceOf(Err);
});

test('res instanceof Result(fn) returns true', () => {
  expect(Result(() => 'Ok')).toBeInstanceOf(Result);
  expect(Result(() => { throw 'Oh no!'; })).toBeInstanceOf(Result);
});
