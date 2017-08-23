
import {streamOf} from "../src/index";
import {asc, desc} from "../src/Comparators";

interface Person {
  name: string
  age: number
}

const persons: Person[] = [
  {
    name: "Gustav",
    age: 42,
  },
  {
    name: "Maria",
    age: 30,
  },
  {
    name: "Kevin",
    age: 15,
  }
];

function isElderly(person: Person) {
  return person.age > 60;
}

describe('complex case', () => {

  it('should find the oldest person with max', () => {

    const oldest = streamOf(persons)
        .max(asc<Person>(p => p.age))
        .map(p => p.name).getOrElse(null);

    expect(oldest).toEqual("Gustav");
  });

  it('should find the oldest person with maxBy', () => {

    const oldest = streamOf(persons)
        .maxBy(p => p.age)
        .map(p => p.name).getOrElse(null);

    expect(oldest).toEqual("Gustav");
  });

  it('should find the oldest person with sort', () => {

    const oldest = streamOf(persons)
        .sort(desc<Person>("age"))
        .findFirst().map(p => p.name).getOrElse(null);

    expect(oldest).toEqual("Gustav");
  });
});
