import Type from './Type';
import { ucFirst, isScalarDataType } from '../service/app.service';

export default class Field extends Type {
  constructor(schema, field) {
    super(field);
    this.schema = schema;
    this.toString = () => `${this.getName()}`;
  }

  getDataType() {
    return this.getType();
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
      if (this.isArray()) return `${fieldName}(first: Int after: String lfield: Int before: String query: ${ref}InputQuery): Connection`;
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
    return Boolean(this.getDirective('onDelete'));
  }

  isCreateField() {
    return this.getSimpleType() !== 'ID' && !this.isVirtual();
  }

  isUpdateField() {
    return this.isCreateField() && !this.isImmutable();
  }

  isVirtual() {
    return Boolean(this.getDirective('virtual'));
  }

  isImmutable() {
    return Boolean(this.getDirective('immutable'));
  }

  // TODO: These are broken
  isEmbedded() {
    return Boolean(this.options.embedded);
  }
}
