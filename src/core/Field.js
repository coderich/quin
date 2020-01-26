import { getNamedType, GraphQLList, GraphQLNonNull } from 'graphql';
import { ucFirst, isScalarDataType } from '../service/app.service';

export default class Field {
  constructor(schema, name, ast) {
    this.schema = schema;
    this.name = name;
    this.ast = ast;
    this.toString = () => `${name}`;
  }

  getName() {
    return this.name;
  }

  getDataType() {
    return `${getNamedType(this.ast.type)}`;
  }

  getSimpleType() {
    return this.getDataType();
  }

  // getDataType(field = this.options) {
  //   switch (field) {
  //     case String: return 'String';
  //     case Number: return 'Float';
  //     case Boolean: return 'Boolean';
  //     default: {
  //       if (Array.isArray(field)) { field[0] = this.getDataType(field[0]); return field; }
  //       if (field instanceof Object) return this.getDataType(field.type);
  //       return field;
  //     }
  //   }
  // }

  getGQLType(suffix) {
    let type = this.getSimpleType();
    if (suffix && !isScalarDataType(type)) type = this.options.embedded ? `${type}${suffix}` : 'ID';
    if (this.options.enum) type = `${this.model.getName()}${ucFirst(this.getName())}Enum`;
    type = this.isArray() ? `[${type}]` : type;
    if (suffix !== 'InputUpdate' && this.isRequired()) type += '!';
    return type;
  }

  getGQLDefinition() {
    const fieldName = this.getName();
    const type = this.getGQLType();
    const ref = this.getDataRef();

    if (ref) {
      if (this.isArray()) return `${fieldName}(first: Int after: String last: Int before: String query: ${ref}InputQuery): Connection`;
      return `${fieldName}(query: ${ref}InputQuery): ${type}`;
    }

    return `${fieldName}: ${type}`;
  }

  getDataRef() {
    const ref = this.getSimpleType();
    return isScalarDataType(ref) ? null : ref;
  }

  getModelRef() {
    return this.schema.getModel(this.getDataRef());
  }

  getAlias(alias) {
    return this.options.alias || alias || this.getName();
  }

  getVirtualRef() {
    return this.options.by;
  }

  getVirtualModel() {
    return this.schema.getModel(this.getSimpleType());
  }

  getVirtualField() {
    return this.getVirtualModel().getField(this.getVirtualRef());
  }

  getTransforms() {
    return this.options.transforms;
  }

  getRules() {
    return this.options.rules;
  }

  getOnDelete() {
    return this.options.onDelete;
  }

  isArray() {
    return this.ast.type instanceof GraphQLList;
  }

  isScalar() {
    return isScalarDataType(this.getSimpleType());
  }

  isVirtual() {
    return Boolean(this.options.by);
  }

  isEmbedded() {
    return Boolean(this.options.embedded);
  }

  isRequired() {
    return this.ast.type instanceof GraphQLNonNull;
  }

  // TODO: These are broken

  isImmutable() {
    return this.options.immutable;
  }
}
