
export type OperationWork = (previousOperation: Operation) => IterableIterator<any>

export class Operation {
  previousOperation: Operation;

  constructor(private operationWork: OperationWork) {
  }

  iterator() {
    return this.operationWork(this.previousOperation);
  }
}

export class Pipeline<T> {
  private lastOperation: Operation;

  addOperation(work: OperationWork) {
    const newOperation = new Operation(work);
    if (this.lastOperation) {
      newOperation.previousOperation = this.lastOperation;
    }
    this.lastOperation = newOperation;
  }

  iterator(): Iterator<T> {
    return this.lastOperation.iterator();
  }
}