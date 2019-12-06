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
  length: 2,

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
    const ret = fn(...args);

    return ret instanceof Result ? ret : new Ok(ret);
  } catch (e) {
    return e instanceof Err ? e : new Err(e);
  }
};

Result.promise = promise => promise.then(Ok, Err);

Result.prototype = Ctor.prototype;

export function Ok (val) {
  if (this instanceof Ok) {
    this[0] = val;
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
    this[1] = val;
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
