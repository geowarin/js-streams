import {streamOf} from "../src/index";

const isEven = x => x % 2 == 0;

describe("inifite stream operations", () => {
  function* naturals() {
    let i = 0;
    while (true) {
      yield i++;
    }
  }

  it('should find first element', () => {
    expect(streamOf(naturals()).findFirst().getOrElse(null)).toEqual(0)
  });

  it('should take the first two elements', () => {
    expect(streamOf(naturals()).take(2).toArray()).toEqual([0, 1])
  });

  it('should skip the first two elements', () => {
    expect(streamOf(naturals()).skip(2).take(2).toArray()).toEqual([2, 3])
  });

  it('should filter and take', () => {
    expect(streamOf(naturals()).filter(isEven).take(2).toArray()).toEqual([0, 2])
  });

});