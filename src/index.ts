const eop = {};

export interface MappingFunction<T, U> {
  (e: T): U
}

interface Operation {
  apply(obj)
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

  // [Symbol.iterator](): Iterator<any> {
  //   return {
  //     next: () => {
  //       return this.operationWork(this.previousOperation)
  //     }
  //   }
  // }
}

type OperationWork = (previousOperation: Operation) => IteratorResult<any>

class Pipeline<T> implements Iterable<T> {
  private lastOperation: Operation;

  addOperation(newOperation: Operation) {
    if (this.lastOperation) {
      const prev = this.lastOperation;
      newOperation.previousOperation = prev;
    }
    this.lastOperation = newOperation;
  }

  [Symbol.iterator](): Iterator<T> {
    return {
      next: () => {
        return this.lastOperation.next();
      }
    }
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
    return this.pipeline[Symbol.iterator]();
  }

  constructor(private iterable: Iterable<any>) {
    this.pipeline = new Pipeline();
    let iterator = iterable [Symbol.iterator]();
    this.pipeline.addOperation(new Operation(
        () => {
          return iterator.next();
        }
    ));
  }

  map<U>(mapper: MappingFunction<T, U>): Stream<U> {
    this.pipeline.addOperation(new Operation(
        (prev) => {
          const nextResult = prev.next();
          if (nextResult.done) {
            return nextResult;
          }
          return {
            value: mapper(nextResult.value),
            done: false
          }
        }
    ));
    return this as any
  }

  flatMap<U>(mapper: MappingFunction<T, U>): Stream<U> {
    this.map(mapper);
    return this.flatten() as any;
  }

  flatten(): Stream<T> {
    let currentIterator: Iterator<any> = null;
    this.pipeline.addOperation(new Operation(
        (prev) => {

          while (true) {
            if (currentIterator != null) {
              const iteratorResult = currentIterator.next();
              if (!iteratorResult.done) {
                return iteratorResult
              }
            }

            const nextResult = prev.next();
            if (nextResult.done) {
              return nextResult;
            }

            if (isIterable(nextResult.value)) {
              currentIterator = nextResult.value[Symbol.iterator]();
            } else {
              return nextResult;
            }
          }
        }
    ));
    return this as any
  }

  filter(predicate: Predicate<T>): Stream<T> {
    this.pipeline.addOperation(new Operation(
        (prev) => {
          while (true) {
            const nextResult = prev.next();
            if (nextResult.done) {
              return nextResult;
            }

            if (predicate(nextResult.value)) {
              return {
                value: nextResult.value,
                done: false
              }
            }
          }
        }
    ));
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