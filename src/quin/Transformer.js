export default class Transformer {
  constructor(name, thunk) {
    return Object.defineProperties(thunk, {
      name: { value: name },
      type: { value: 'transformer' },
    });
  }

  static factory(name, thunk) {
    Object.defineProperty(Transformer, name, { value: thunk });
  }
}
