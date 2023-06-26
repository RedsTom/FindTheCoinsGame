export default class Ref<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  toString(): string {
    return `${this.value}`;
  }
}

export function ref<T>(value: T): Ref<T> {
  return new Ref(value);
}