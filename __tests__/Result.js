import { Result, Ok, Err } from '../src';

/* global Promise */
/* eslint-disable
    brace-style,
    no-throw-literal,
    max-statements-per-line,
    prefer-promise-reject-errors
 */

test('Result(0) throws an error', () =>
  expect(() => Result(0)).toThrow('Expected function, got number')
);

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

test('Result.promise(Promise.resolve()) makes an `Ok` instance', () => {
  const prom = Result.promise(Promise.resolve('Ok'));

  return prom.then(res => expect(res).toBeInstanceOf(Result));
});

test('Result.promise(Promise.reject()) makes an `Err` instance', () => {
  const prom = Result.promise(Promise.reject('Oh no!'));

  return prom.then(res => expect(res).toBeInstanceOf(Result));
});

test('Result.promise(succPromise) wraps the value correctly', () => {
  const prom = Result.promise(Promise.resolve('Ok'));

  return prom.then(res => expect(res.get()).toBe('Ok'));
});

test('Result.promise(errPromise) wraps the value correctly', () => {
  const prom = Result.promise(Promise.reject('Oh no!'));

  return prom.then(res => expect(res.getErr()).toBe('Oh no!'));
});

test('res instanceof Result(fn) returns true if fn is a function', () => {
  expect(Result(() => 'Ok')).toBeInstanceOf(Result);
  expect(Result(() => { throw 'Oh no!'; })).toBeInstanceOf(Result);
});
