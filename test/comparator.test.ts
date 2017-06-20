
import {asc, comparators, desc} from "../src/Comparators";

interface Person {
  name: string
  age: number
}

const persons: Person[] = [
  {
    name: "Gustav",
    age: 17,
  },
  {
    name: "Maria",
    age: 30,
  },
  {
    name: "Eddy",
    age: 30,
  },
  {
    name: "Kevin",
    age: 15,
  }
];

describe('comparators', () => {

  it('should', () => {
    const sorted = persons.sort(comparators(desc<Person>("age"), asc<Person>("name")));
    expect(sorted.map(p => p.name)).toEqual(["Eddy", "Maria", "Gustav", "Kevin"])
  });
});
