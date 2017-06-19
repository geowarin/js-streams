export interface MappingFunction<T, U> {
  (e: T): U
}

export interface Predicate<T> {
  (e: T): boolean
}

class Operation {
  previousOperation: Operation;

  constructor(private operationWork: OperationWork) {
  }

  next() {
    return this.operationWork(this.previousOperation);
  }
}

type OperationWork = (previousOperation: Operation) => IterableIterator<any>

function getIterator(iterable): IterableIterator<any> {
  return iterable [Symbol.iterator]()
}

class Pipeline<T> {
  private lastOperation: Operation;

  addOperation(work: OperationWork) {
    const newOperation = new Operation(work);
    if (this.lastOperation) {
      newOperation.previousOperation = this.lastOperation;
    }
    this.lastOperation = newOperation;
  }

  next(): Iterator<T> {
    return this.lastOperation.next();
  }
}

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

export class Stream<T> implements Iterable<T> {
  private pipeline: Pipeline<any>;

  [Symbol.iterator](): Iterator<T> {
    return this.pipeline.next();
  }

  constructor(private iterable: Iterable<any>) {
    this.pipeline = new Pipeline();
    let iterator = getIterator(iterable);
    this.pipeline.addOperation(
        () => {
          return iterator;
        }
    );
  }

  map<U>(mapper: MappingFunction<T, U>): Stream<U> {
    this.pipeline.addOperation(
        (prev) => {
          return (function* () {
            for (let val of prev.next()) {
              yield mapper(val);
            }
          })();
        }
    );
    return this as any
  }

  flatMap<U>(mapper: MappingFunction<T, U>): Stream<U> {
    this.map(mapper);
    return this.flatten() as any;
  }

  flatten(): Stream<T> {
    // let currentIterator: Iterator<any> = null;
    this.pipeline.addOperation(
        (prev) => {
          return (function* () {
            for (let x of prev.next()) {
              if (typeof x !== "string" && isIterable(x)) {
                yield* x;
              } else {
                yield x;
              }
            }
          })();
        }
    );
    return this as any
  }

  filter(predicate: Predicate<T>): Stream<T> {
    this.pipeline.addOperation(
        (prev) => {
          return (function* () {
            for (let val of prev.next()) {
              if (predicate(val))
                yield val;
            }
          })();
        }
    );
    return this
  }

  toArray(): T[] {
    const result = [];
    for (let el of this) {
      result.push(el);
    }
    return result;
  }
}

export function streamOf<T>(iterable: Iterable<T>): Stream<T> {
  return new Stream<T>(iterable)
}