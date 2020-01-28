import { isListType, isNonNullType, getNamedType } from 'graphql';
import { isScalarDataType } from '../service/app.service';
import Directive from './Directive';

export default class Type {
  constructor(ast) {
    this.ast = ast;
    this.directives = this.ast.astNode.directives.map(directive => new Directive(directive));
  }

  getName() {
    return this.ast.name;
  }

  getType() {
    return `${getNamedType(this.ast.type)}`;
  }

  getDirective(name) {
    return this.directives.find(directive => directive.getName() === name);
  }

  getDirectiveArg(name, arg, defaultValue) {
    const directive = this.getDirective(name);
    if (!directive) return defaultValue;
    return directive.getArg(arg) || defaultValue;
  }

  getDirectiveArgs(name, defaultValue) {
    const directive = this.getDirective(name);
    if (!directive) return defaultValue;
    return directive.getArgs();
  }

  getAlias(defaultValue) {
    return this.getDirectiveArg('quin', 'alias', defaultValue || this.getName());
  }

  isArray() {
    return isListType(this.ast.type);
  }

  isScalar() {
    return isScalarDataType(this.getSimpleType());
  }

  isRequired() {
    return isNonNullType(this.ast.type);
  }

  toString() {
    return `${this.getName()}`;
  }
}
