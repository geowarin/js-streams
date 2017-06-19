export interface MappingFunction<T, U> {
  (e: T): U
}

export interface Predicate<T> {
  (e: T): boolean
}

export interface Consumer<T> {
  (e: T): void
}

export type Map<T> = {[key: string]: T}
export type GroupingResult<T> = Map<T[]>

function getIterator(iterable): IterableIterator<any> {
  return iterable [Symbol.iterator]()
}

function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

function entries <T> (obj: Map<T>) {
  return Object.keys(obj).map(key => [key, obj[key]]);
}

type OperationWork = (previousOperation: Operation) => IterableIterator<any>

class Operation {
  previousOperation: Operation;

  constructor(private operationWork: OperationWork) {
  }

  iterator() {
    return this.operationWork(this.previousOperation);
  }
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

  iterator(): Iterator<T> {
    return this.lastOperation.iterator();
  }
}

export class Stream<T> implements Iterable<T> {
  private pipeline: Pipeline<any>;

  [Symbol.iterator](): Iterator<T> {
    return this.pipeline.iterator();
  }

  constructor(private iterable: Iterable<any>) {
    this.pipeline = new Pipeline();
    this.pipeline.addOperation(() => getIterator(iterable));
  }

  map<U>(mapper: MappingFunction<T, U>): Stream<U> {
    this.pipeline.addOperation(
        function* (prev) {
          for (let val of prev.iterator()) {
            yield mapper(val);
          }
        }
    );
    return this as any;
  }

  flatMap<U>(mapper: MappingFunction<T, U>): Stream<U> {
    this.map(mapper);
    return this.flatten() as any;
  }

  flatten(): Stream<T> {
    this.pipeline.addOperation(
        function* (prev) {
          for (let x of prev.iterator()) {
            if (typeof x !== "string" && isIterable(x)) {
              yield* x;
            } else {
              yield x;
            }
          }
        }
    );
    return this as any;
  }

  filter(predicate: Predicate<T>): Stream<T> {
    this.pipeline.addOperation(
        function* (prev) {
          for (let val of prev.iterator()) {
            if (predicate(val))
              yield val;
          }
        }
    );
    return this;
  }

  toArray(): T[] {
    return [...this];
  }

  forEach(consumer: Consumer<T>) {
    for (let x of this) {
      consumer(x);
    }
  }

  groupBy(mappingFunction: MappingFunction<T, string>): GroupingResult<T> {
    const result = {};
    for (let x of this) {
      const key = mappingFunction(x);
      if (result[key] === undefined) {
        result[key] = [];
      }
      result[key].push(x);
    }
    return result;
  }
}

export function streamOf<T>(map: Map<T>): Stream<[string, T]>;
export function streamOf<T>(iterable: Iterable<T>): Stream<T>;

export function streamOf<T>(iterable) {
  if (isIterable(iterable)) {
    return new Stream<T>(iterable)
  }
  return new Stream(entries(iterable));
}