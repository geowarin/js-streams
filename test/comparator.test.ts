import {asc, comparators, compare, desc} from "../src/Comparators";
import {Comparator, streamOf} from "../src/index";

interface Person {
  name: string
  age: number
}

const defaultPersons: Person[] = [
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

  it('should be composable', () => {
    const persons = defaultPersons.slice();
    const sorted = persons.sort(comparators(desc<Person>("age"), asc<Person>("name")));
    expect(sorted.map(p => p.name)).toEqual(["Eddy", "Maria", "Gustav", "Kevin"])
  });

  it('should be nicely chainable', () => {
    const persons = defaultPersons.slice();
    const comparator: Comparator<Person> = compare<Person>().desc("age").asc("name");
    const sorted = persons.sort(comparator);
    expect(sorted.map(p => p.name)).toEqual(["Eddy", "Maria", "Gustav", "Kevin"])
  });

  it('should be available on streams', () => {
    const sorted = streamOf(defaultPersons.slice())
      .sortedBy(it => it.desc("age").asc("name"));
    expect(sorted.map(p => p.name)).toEqual(["Eddy", "Maria", "Gustav", "Kevin"])
  });
});
