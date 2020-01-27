export default class Directive {
  constructor(ast) {
    this.ast = ast;
  }

  getName() {
    return this.ast.name.value;
  }

  getArgs() {
    return this.ast.arguments.reduce((prev, { name, value }) => {
      return Object.assign(prev, { [name.value]: Directive.parseValue(value) });
    }, {});
  }

  getArg(arg) {
    return this.getArgs()[arg];
  }

  static parseValue(value) {
    return value.value || value.values.map(v => v.value);
  }
}
