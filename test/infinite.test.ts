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

  it('should tap', () => {
    const tapper = (arr) => (x) => arr.push(x);
    const tap1 = [];
    const tap2 = [];
    streamOf(naturals()).tap(tapper(tap1)).take(2).tap(tapper(tap2)).toArray();

    expect(tap1).toEqual([0, 1, 2]);
    expect(tap2).toEqual([0, 1]);
  });

  it('should tap lazily', () => {
    const tapper = (arr) => (x) => arr.push(x);
    const tap1 = [];
    streamOf(naturals()).tap(tapper(tap1)).findFirst();

    expect(tap1).toEqual([0]);
  });

  it('should find some positive values', () => {
    expect(streamOf(naturals()).some(x => x > 0)).toEqual(true)
  });

});