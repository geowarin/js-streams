
class Some<A> implements Optional<A> {
  constructor(private a: A) {
  }
  getOrElse(a: A) {
    return this.a;
  }
  isPresent(): boolean {
    return true;
  }
  map<B>(func: (a: A) => B) {
    return Optional(func(this.a));
  }
  match<B>(cases: {
    some: (a: A) => B;
    none: () => B;
  }): B {
    return cases.some(this.a);
  }
}

export const None: Optional<any> = {
  getOrElse(a: any) {
    return a;
  },
  map() {
    return this;
  },
  isPresent() {
    return false;
  },
  match<B>(cases: {
    some: (a: any) => B;
    none: () => B;
  }): B {
    return cases.none();
  }
};

export interface Optional<A> {
  match<B>(cases: {
    some: (a: A) => B;
    none: () => B;
  }): B;
  getOrElse(a: A): A;
  isPresent(): boolean;
  map<B>(func: (a: A) => B): Optional<B>;
}

export function Optional<A>(a: A): Optional<A> {
  if (typeof a === 'undefined' || a === null) {
    return None;
  } else {
    return new Some(a);
  }
}
