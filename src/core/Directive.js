export default class Directive {
  constructor(ast) {
    this.ast = ast;
  }

  getName() {
    return this.ast.name.value;
  }

  getArgs() {
    return this.ast.arguments.reduce((prev, { name, value }) => {
      return Object.assign(prev, { [name.value]: value.value || value.values });
    }, {});
  }

  getArg(arg) {
    return this.getArgs()[arg];
  }
}
