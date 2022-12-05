# @fpc/result

<div align="center">
  <a href="https://drone.tno.sh/fpc-js/result" target="_blank">
    <img src="https://drone.tno.sh/api/badges/fpc-js/result/status.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://snyk.io/test/github/fpc-js/result?targetFile=package.json">
    <img src="https://snyk.io/test/github/fpc-js/result/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/fpc-js/result?targetFile=package.json" style="max-width:100%;">
  </a>
  <a href="https://codecov.io/gh/fpc-js/result" target="_blank">
    <img src="https://codecov.io/gh/fpc-js/result/branch/master/graph/badge.svg?token=O1I1B4UGYJ" alt="Coverage Status">
  </a>
  <a href="https://github.com/semantic-release/semantic-release" target="_blank">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="semantic-release">
  </a>
</div>

A `Result` is an object that represents either
a success status `Ok(value)` or failure `Err(e)`.

E.g.:

```javascript
import { Result } from '@fpc/result';
import { expectNumber } from '@fpc/types';

const parseNum = str => Result(() => expectNumber(+str));

parseNum('hello').mapErr(e => e.message).getErr(); // 'Expected number, got NaN'
parseNum(6).get(); // 6
```

## API

### Ok()

```javascript
import { Ok } from '@fpc/result';

const res = Ok(0);

res.isOk; // true
res.isErr; // false
```

### Err()

```javascript
import { Err } from '@fpc/result';

const res = Err('Something went wrong');

res.isOk; // false
res.isErr; // true
```

### Result()

Takes a function `fn` that may return either an `Ok` or an `Err` instance.

- If `fn()` returns a `Result` instance it will be returned as it is
- If `fn()` throws an error `e`, the exception is catched and `Err(e)` is returned
- Otherwise `Ok(fn())` is returned

```javascript
import { Result } from '@fpc/result';

const r1 = Result(() => Err('Some message'));
r1.getErr(); // 'Some message'

const r2 = Result(() => Ok('Some value'));
r2.get(); // 'Some value'

const r3 = Result(() => {
  throw new Error('Some message');
});

r3.mapErr(e => e.message).getErr(); // 'Some message'

const r4 = Result(() => 'Some value');
r4.get(); // 'Some value'
```

### .isOk

`Ok(value).isOk` is `true`, `Err(e).isOk` is `false`.

### .isErr

`Ok(value).isErr` is `false`, `Err(e).isErr` is `true`.

### .get()

`Ok(value).get()` returns `value`, `Err(e).get()` throws an error.

### .getErr()

`Ok(value).getErr()` throws an error. `Err(e).getErr()` returns `e`.

### .map()

`Ok(value).map(fn)` returns `Result(() => fn(value))`. Note that if `fn` throws
an exception, `map` will catch it and will return an `Err` instance.

`Err(e).map(fn)` is `Err(e)`.

### .mapErr()

`Ok(value).mapErr(fn)` is `Ok(value)`.

`Err(e).mapErr(fn)` returns `Err(fn(e))`.

### .forEach()

`Ok(value).forEach(fn)` executes `fn(value)`, `Err(e).forEach(fn)` does nothing.

The `Result` itself is always returned.

### .forEachErr()

`Ok(value).forEachErr(fn)` does nothing, `Err(e).forEachErr(fn)` executes `fn(e)`.

The `Result` itself is always returned.

### .merge()

`Ok(value).merge(mapFn, mapErrFn)` returns `mapFn(value)`,
`Err(e).merge(mapFn, mapErrFn)` returns `mapErrFn(e)`.

Both `mapFn` and `mapErrFn` are optional:

`Ok(value).merge()` returns `value`, `Err(e).merge()` returns `e`.

```javascript
import { Err, Ok } from '@fpc/result';

Ok(1).merge(); // 1
Err('I am a message').merge(); // 'I am a message'

Ok(1).merge(x => x + 1); // 2
Ok(1).merge(x => x + 1, () => 0); // 2
Err('Oops').merge(x => x + 1); // 'Oops'
Err('Oops').merge(x => x + 1, () => 0); // 0
```

### [Symbol.iterator]

Results implement the [iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol).

```javascript
import { Err, Ok } from '@fpc/result';

Array.from(Ok(0)); // [ 0, undefined ]
Array.from(Err('message')); // [ undefined, 'message' ]

const [ res0, err0 ] = Ok(0); // res0 is 0, err0 is `undefined`
const [ res1, err1 ] = Err('message'); // res1 is `undefined`, err1 is 'message'
```

### Result.promise()

Wraps the result value of a promise in a `Result` instance:

```javascript
import { Result } from '@fpc/result';

Result.promise(Promise.resolve('yay!'))
  .then(([ value, error ]) => console.log(value)); // logs 'yay!'

Result.promise(Promise.reject('oh no'))
  .then(([ value, error ]) => console.log(error)); // logs 'oh no!'
```
