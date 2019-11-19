import { Result, Ok, Err } from '../src';

/* global Promise */
/* eslint-disable
    brace-style,
    no-throw-literal,
    max-statements-per-line,
    prefer-promise-reject-errors
 */

test('Result(0) throws an error', () =>
  expect(() => Result(0)).toThrow('Expected function or promise, got number')
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

test('Result(Promise.resolve()) returns an `Ok` instance in a Promise', () => {
  const prom = Result(Promise.resolve('Ok'));

  return prom.then(res => expect(res).toBeInstanceOf(Result));
});

test('Result(Promise.reject()) returns an `Err` instance in a Promise', () => {
  const prom = Result(Promise.reject('Oh no!'));

  return prom.then(res => expect(res).toBeInstanceOf(Result));
});

test('Result(succPromise) wraps the value correctly', () => {
  const prom = Result(Promise.resolve('Ok'));

  return prom.then(res => expect(res.get()).toBe('Ok'));
});

test('Result(errPromise) wraps the value correctly', () => {
  const prom = Result(Promise.reject('Oh no!'));

  return prom.then(res => expect(res.getErr()).toBe('Oh no!'));
});

test('res instanceof Result(fn) returns true if fn is a function', () => {
  expect(Result(() => 'Ok')).toBeInstanceOf(Result);
  expect(Result(() => { throw 'Oh no!'; })).toBeInstanceOf(Result);
});
