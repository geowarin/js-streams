import {streamOf} from "../src/index";

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
            .filter(i => i % 2 == 0)
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
            .groupBy(e => e % 2 == 0 ? "even" : "odd")
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
});