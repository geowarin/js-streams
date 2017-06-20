import {streamOf} from "../src/index";

const isEven = x => x % 2 == 0;

describe("Stream operations", () => {

  it('should return an array', () => {
    expect(streamOf([1, 2]).toArray()).toEqual([1, 2])
  });

  it('should map', () => {
    expect(
        streamOf([1, 2])
            .map(i => i * 2)
            .toArray()
    ).toEqual([2, 4])
  });

  it('should map twice', () => {
    expect(
        streamOf([1, 2])
            .map(i => i * 2)
            .map(i => i * i)
            .toArray()
    ).toEqual([4, 16])
  });

  it('should filter', () => {
    expect(
        streamOf([1, 2])
            .filter(isEven)
            .toArray()
    ).toEqual([2])
  });

  it('should flatten one level', () => {
    expect(
        streamOf([[[1, 2]]])
            .flatten()
            .toArray()
    ).toEqual([[1, 2]])
  });

  it('should flatmap', () => {
    expect(
        streamOf([1, 2])
            .flatMap(i => [i, i * 2])
            .toArray()
    ).toEqual([1, 2, 2, 4])
  });

  it('should groupBy', () => {
    expect(
        streamOf([1, 2])
            .groupBy(e => isEven(e) ? "even" : "odd")
    ).toEqual({
      odd: [1],
      even: [2],
    })
  });

  it('stream map entries', () => {
    const map = {
      hello: "world",
      hi: "people"
    };
    expect(streamOf(map).toArray()).toEqual([["hello", "world"], ["hi", "people"]])
  });

  it('support map elegantly', () => {
    const map = {
      hello: ["world", "people"],
      "buon giorno": ["amici"]
    };
    const result = streamOf(map)
        .map(([salutation, subjects]) => `${salutation}, ${subjects.join(" & ")}`)
        .toArray();

    expect(result).toEqual(["hello, world & people", "buon giorno, amici"])
  });

  it('finds first', () => {
    const result = streamOf([1, 2]).findFirst().getOrElse(null);
    expect(result).toEqual(1);
  });

  it('finds first with predicate', () => {
    const result = streamOf([1, 2]).findFirst(isEven).getOrElse(null);
    expect(result).toEqual(2);
  });

  it('findFirst returns none on empty collection', () => {
    const result = streamOf([]).findFirst().getOrElse(42);
    expect(result).toEqual(42);
  });

  it('should find last with predicate', () => {
    const result = streamOf([1, 2, 3, 4, 5]).findLast().getOrElse(null);
    expect(result).toEqual(5);
  });

  it('should find last with predicate', () => {
    const result = streamOf([1, 2, 3, 4, 5]).findLast(isEven).getOrElse(null);
    expect(result).toEqual(4);
  });

  it('should partition', () => {
    const [evens, odds] = streamOf([1, 2, 3, 4, 5]).partition(isEven);
    expect(evens).toEqual([2, 4]);
    expect(odds).toEqual([1, 3, 5]);
  });
});