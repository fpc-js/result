import { expectFunction } from '@fpc/types';

/* global Symbol */
/* eslint-disable func-style, no-use-before-define, no-sequences */

const identity = x => x;

function Ctor (props) {
  /* eslint-disable-next-line guard-for-in */
  for (const key in props) {
    this[key] = props[key];
  }
}

Ctor.prototype = {
  map (fn) {
    return this.isErr ? this : Result(fn, this.get());
  },

  mapErr (fn) {
    return this.isOk ? this : new Err(fn(this.getErr()));
  },

  forEach (fn) {
    return this.isErr || fn(this.get()), this;
  },

  forEachErr (fn) {
    return this.isOk || fn(this.getErr()), this;
  },

  /*
   * Call `mapErr` first so `mapErrFn` doesn't get called
   * if the result is an Ok instance and `mapFn` gives
   * an Err instance.
   */
  merge (mapFn = identity, mapErrFn = identity) {
    const result = this.mapErr(mapErrFn).map(mapFn);

    return result.isOk ? result.get() : result.getErr();
  },

  *[Symbol.iterator] () {
    yield this.isOk ? this.get() : undefined;
    yield this.isErr ? this.getErr() : undefined;
  },
};

export const Result = (fn, ...args) => {
  expectFunction(fn);

  try {
    const val = fn(...args);

    return val instanceof Result ? val : new Ok(val);
  } catch (e) {
    return e instanceof Err ? e : new Err(e);
  }
};

Result.prototype = Ctor.prototype;

export function Ok (val) {
  if (this instanceof Ok) {
    this.get = () => val;
  } else {
    return new Ok(val);
  }
}

Ok.prototype = new Ctor({
  isOk: true,
  isErr: false,
  getErr: () => {
    throw new Error('Trying to get error of Ok');
  },
});

export function Err (val) {
  if (this instanceof Err) {
    this.getErr = () => val;
  } else {
    return new Err(val);
  }
}

Err.prototype = new Ctor({
  isOk: false,
  isErr: true,
  get: () => {
    throw new Error('Trying to get value of Err');
  },
});
