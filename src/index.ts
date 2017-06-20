import {Stream} from "./Stream";
import {entries, isIterable} from "./utils";
import {FiniteStream} from "./FiniteStream";

export * from "./Stream";
export * from "./FiniteStream";
export * from "./Optional";
export * from "./Comparators";

export interface MappingFunction<T, U> {
  (e: T, index: number): U
}

export interface Predicate<T> {
  (e: T): boolean
}

export interface Consumer<T> {
  (e: T): void
}

export interface Comparator<T> {
  (a: T, b: T): number
}

export type Map<T> = { [key: string]: T };
export type GroupingResult<T> = Map<T[]>;
export type Pair<T, U> = [T, U];

export function streamOf<T>(array: T[]): FiniteStream<T>;
export function streamOf<T>(map: Map<T>): FiniteStream<Pair<string, T>>;
export function streamOf<T>(iterable: Iterable<T>): Stream<T>;

export function streamOf<T>(iterable: any) {
  if (iterable instanceof Array) {
    return new FiniteStream(iterable);
  }
  if (isIterable(iterable)) {
    return new Stream(iterable)
  }
  return new FiniteStream(entries(iterable));
}