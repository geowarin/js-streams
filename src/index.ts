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

class Pipeline {
  private operations: Operation[] = [];

  addOperation(operation: Operation) {
    this.operations.push(operation);
  }

  run(obj) {
    for (let operation of this.operations) {
      let operationResult = operation.apply(obj);
      if (operationResult === eop) {
        return eop;
      }
      obj = operationResult;
    }
    return obj;
  }
}

class StreamIterator<T> implements Iterator<T> {
  private iterator: Iterator<any>;

  constructor(private iterable: Iterable<any>, private pipeline: Pipeline) {
    this.iterator = iterable[Symbol.iterator]();
  }

  next(): IteratorResult<T> {
    let iteratorResult;
    while (true) {
      iteratorResult = this.iterator.next();
      if (iteratorResult.done) {
        return {
          done: true,
          value: undefined
        }
      }

      const nextVal = this.pipeline.run(iteratorResult.value);
      if (nextVal === eop) {
        continue;
      }

      return {
        value: nextVal,
        done: iteratorResult.done
      }
    }
  }
}

export class Stream<T> implements Iterable<T> {

  [Symbol.iterator](): Iterator<T> {
    return new StreamIterator<T>(this.iterable, this.pipeline);
  }

  private pipeline = new Pipeline();

  constructor(private iterable: Iterable<any>) {
  }

  map<U>(mapper: MappingFunction<T, U>): Stream<U> {
    this.pipeline.addOperation({
      apply: (obj) => {
        return mapper(obj)
      }
    });
    return this as any
  }

  filter(predicate: Predicate<T>): Stream<T> {
    this.pipeline.addOperation({
      apply: (obj) => {
        if (predicate(obj)) {
          return obj
        }
        return eop
      }
    });
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