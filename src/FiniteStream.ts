import {Consumer, GroupingResult, MappingFunction, Pair, Predicate} from "./index";
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

  filter(predicate: Predicate<T>): FiniteStream<T> {
    return super.filter(predicate) as FiniteStream<T>;
  }

  flatten(): FiniteStream<T> {
    return super.flatten() as FiniteStream<T>;
  }

  flatMap<U>(mapper: MappingFunction<T, U>): FiniteStream<U> {
    return super.flatMap(mapper) as FiniteStream<U>;
  }

  forEach(consumer: Consumer<T>) {
    for (let x of this) {
      consumer(x);
    }
  }

  findLast(predicate: Predicate<T> = Boolean): Optional<T> {
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