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
      obj = operation.apply(obj);
    }
    return obj;
  }
}

export class Stream<T> {
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
          return [obj]
        }
        return []
      }
    });
    return this
  }

  toArray(): T[] {
    const result = [];
    for (let el of this.iterable) {
      const transformed = this.pipeline.run(el);
      result.push(transformed);
    }
    return result;
  }
}

export function streamOf<T>(iterable: Iterable<T>): Stream<T> {
  return new Stream<T>(iterable)
}