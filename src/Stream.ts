import {FiniteStream} from "./FiniteStream";
import {MappingFunction, Predicate, streamOf} from "./index";
import {None, Optional} from "./Optional";
import {Pipeline} from "./Pipeline";
import {getIterator, isIterable} from "./utils";

export class Stream<T> implements Iterable<T> {
  private pipeline: Pipeline<any>;

  [Symbol.iterator](): Iterator<T> {
    return getIterator(this.pipeline);
  }

  constructor(private iterable: Iterable<T>) {
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

  filter(predicate: Predicate<T> = Boolean): Stream<T> {
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

  take(num: number = 1): FiniteStream<T> {
    this.pipeline.addOperation(
        function* (prev) {
          let count = 0;
          for (let val of prev.iterator()) {
            if (count++ >= num) {
              break;
            }
            yield val;
          }
        }
    );
    // TODO: pass the iterable directly
    return streamOf([...this.pipeline]);
  }

  skip(num: number = 1): Stream<T> {
    this.pipeline.addOperation(
        function* (prev) {
          let count = 0;
          for (let val of prev.iterator()) {
            if (count++ >= num) {
              yield val;
            }
          }
        }
    );
    return this;
  }

  findFirst(predicate: Predicate<T> = () => true): Optional<T> {
    for (let x of this) {
      if (predicate(x)) {
        return Optional(x);
      }
    }
    return None;
  }
}
