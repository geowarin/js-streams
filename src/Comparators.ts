import {Comparator} from "./index";

export interface ComparatorMapping<T> {
  (e: T): any
}

export type ComparatorMapper<T> = keyof T | ComparatorMapping<T>

export function desc<T>(attribute: ComparatorMapper<T> = a => a): Comparator<T> {
  return (a: T, b: T) => {
    const aVal = get(a, attribute);
    const bVal = get(b, attribute);
    return aVal < bVal ? 1 : aVal == bVal ? 0 : -1;
  }
}

export function asc<T>(attribute: ComparatorMapper<T> = a => a): Comparator<T> {
  return (a: T, b: T) => {
    const aVal = get(a, attribute);
    const bVal = get(b, attribute);
    return aVal > bVal ? 1 : aVal == bVal ? 0 : -1;
  }
}

function get<T>(obj: any, attr: ComparatorMapper<T>) {
  if (typeof attr == "function") {
    const fn = attr as ComparatorMapping<T>;
    return fn(obj);
  }
  return obj[attr];
}

export interface ComparatorChain<T> extends Comparator<T> {
  asc?(attribute: ComparatorMapper<T>): ComparatorChain<T>;

  desc?(attribute: ComparatorMapper<T>): ComparatorChain<T>;
}

export function compare<T>(): ComparatorChain<T> {
  const comparatorChain: Comparator<T>[] = [];
  let finalComparator: Comparator<T>;
  const comparator: ComparatorChain<T> = (a: T, b: T): number => {
    if (!finalComparator) {
      finalComparator = comparators(...comparatorChain);
    }
    return finalComparator(a, b);
  };
  comparator.asc = function (attribute: ComparatorMapper<T>): ComparatorChain<T> {
    comparatorChain.push(asc(attribute));
    return comparator;
  };
  comparator.desc = function (attribute: ComparatorMapper<T>): ComparatorChain<T> {
    comparatorChain.push(desc(attribute));
    return comparator;
  };
  return comparator;
}

export function comparators<T>(...comparators: Comparator<T>[]): Comparator<T> {
  return (a: T, b: T) => {
    for (let comparator of comparators) {
      const comparisonVal = comparator(a, b);
      if (comparisonVal != 0) {
        return comparisonVal;
      }
    }
    return 0;
  }
}

