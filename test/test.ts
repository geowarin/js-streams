
import {Stream, streamOf} from "../src/index";

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
});