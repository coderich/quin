import { isListType, isNonNullType, getNamedType } from 'graphql';
import { isScalarDataType } from '../service/app.service';

export default class Type {
  constructor(type) {
    this.type = type;
  }

  getName() {
    return this.type.name;
  }

  getType() {
    return `${getNamedType(this.type.type)}`;
  }

  getDirective(name) {
    return this.type.astNode.directives.find(directive => directive.name.value === name);
  }

  isArray() {
    return isListType(this.type.type);
  }

  isScalar() {
    return isScalarDataType(this.getSimpleType());
  }

  isRequired() {
    return isNonNullType(this.type.type);
  }
}
