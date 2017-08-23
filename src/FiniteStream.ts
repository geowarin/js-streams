import {asc, ComparatorChain, ComparatorMapping, compare} from "./Comparators";
import {Comparator, Consumer, GroupingResult, MappingFunction, Pair, Predicate} from "./index";
import {None, Optional} from "./Optional";
import {Stream} from "./Stream";

function emptyPair(): Pair<any, any> {
  let result = [];
  result[0] = [];
  result[1] = [];
  return result as Pair<any, any>;
}

export class FiniteStream<T> extends Stream<T> {
  toArray(): T[] {
    return [...this];
  }

  map<U>(mapper: MappingFunction<T, U>): FiniteStream<U> {
    return super.map(mapper) as FiniteStream<U>;
  }

  filter(predicate: Predicate<T> = Boolean): FiniteStream<T> {
    return super.filter(predicate) as FiniteStream<T>;
  }

  flatten(): FiniteStream<T> {
    return super.flatten() as FiniteStream<T>;
  }

  flatMap<U>(mapper: MappingFunction<T, U>): FiniteStream<U> {
    return super.flatMap(mapper) as FiniteStream<U>;
  }

  tap(consumer: Consumer<T> = console.log.bind(console)): FiniteStream<T> {
    return super.tap(consumer) as FiniteStream<T>
  }

  skip(num: number = 1): FiniteStream<T> {
    return super.skip(num) as FiniteStream<T>
  }

  forEach(consumer: Consumer<T>) {
    for (let x of this) {
      consumer(x);
    }
  }

  findLast(predicate: Predicate<T> = () => true): Optional<T> {
    let last: Optional<T> = None;
    for (let x of this) {
      if (predicate(x)) {
        last = Optional(x);
      }
    }
    return last;
  }

  partition(predicate: Predicate<T> = Boolean): Pair<T[], T[]> {
    const result = emptyPair();
    for (let x of this) {
      if (predicate(x)) {
        result[0].push(x)
      } else {
        result[1].push(x)
      }
    }
    return result;
  }

  groupBy(mappingFunction: MappingFunction<T, string>): GroupingResult<T> {
    const result: GroupingResult<T> = {};
    let index = 0;
    for (let x of this) {
      const key = mappingFunction(x, index++);
      if (result[key] === undefined) {
        result[key] = [];
      }
      result[key].push(x);
    }
    return result;
  }

  every(predicate: Predicate<T> = Boolean): boolean {
    for (let x of this) {
      if (!predicate(x)) {
        return false;
      }
    }
    return true;
  }

  sortedBy(comparatorBuilder: (chain: ComparatorChain<T>) => Comparator<T>): T[] {
    return this.sorted(comparatorBuilder(compare<T>()));
  }

  sorted(comparator?: Comparator<T>): T[] {
    // TODO: is this n^2 ?
    return this.toArray().sort(comparator);
  }

  sort(comparator?: Comparator<T>): FiniteStream<T> {
    // TODO: is this n^2 ?
    this.pipeline.addOperation(
        function* (prev) {
          const sorted = [...prev.iterator()].sort(comparator);
          for (let x of sorted) {
            yield x;
          }
        }
    );
    return this;
  }

  max(comparator: Comparator<T> = asc()): Optional<T> {
    let result: Optional<T> = None;
    for (let x of this) {
      result = Optional(x);
      break;
    }
    for (let x of this) {
      if (comparator(result.get(), x) < 0) {
        result = Optional(x);
      }
    }
    return result;
  }

  maxBy(mapping: ComparatorMapping<T>): Optional<T> {
    return this.max(asc(mapping));
  }
}