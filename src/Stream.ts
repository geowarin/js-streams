import {MappingFunction, Predicate} from "./index";
import {None, Optional} from "./Optional";
import {Pipeline} from "./Pipeline";
import {getIterator, isIterable} from "./utils";

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


  findFirst(predicate: Predicate<T> = Boolean): Optional<T> {
    for (let x of this) {
      if (predicate(x)) {
        return Optional(x);
      }
    }
    return None;
  }
}
