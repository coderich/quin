import Type from './Type';
import { isScalarDataType } from '../service/app.service';

export default class Field extends Type {
  constructor(schema, field) {
    super(field);
    this.schema = schema;
    this.toString = () => `${this.getName()}`;
  }

  getDataType() {
    const type = this.getType();
    if (!this.isArray()) return type;
    const isSet = this.getDirectiveArg('quin', 'restrict', '').indexOf('dupes') > -1;
    return Object.assign([type], { isSet });
  }

  getSimpleType() {
    return this.getType();
  }

  // getGQLType(suffix) {
  //   let type = this.getSimpleType();
  //   if (suffix && !isScalarDataType(type)) type = this.options.embedded ? `${type}${suffix}` : 'ID';
  //   if (this.options.enum) type = `${this.model.getName()}${ucFirst(this.getName())}Enum`;
  //   type = this.isArray() ? `[${type}]` : type;
  //   if (suffix !== 'InputUpdate' && this.isRequired()) type += '!';
  //   return type;
  // }

  // getGQLDefinition() {
  //   const fieldName = this.getName();
  //   const type = this.getGQLType();
  //   const ref = this.getDataRef();

  //   if (ref) {
  //     if (this.isArray()) return `${fieldName}(first: Int after: String lfield: Int before: String query: ${ref}InputQuery): Connection`;
  //     return `${fieldName}(query: ${ref}InputQuery): ${type}`;
  //   }

  //   return `${fieldName}: ${type}`;
  // }

  getDataRef() {
    const ref = this.getSimpleType();
    return isScalarDataType(ref) ? null : ref;
  }

  getModelRef() {
    return this.schema.getModel(this.getDataRef());
  }

  getVirtualRef() {
    return this.getDirectiveArg('quin', 'materializeBy');
  }

  getVirtualModel() {
    return this.schema.getModel(this.getSimpleType());
  }

  getVirtualField() {
    return this.getVirtualModel().getField(this.getVirtualRef());
  }

  getOnDelete() {
    return Boolean(this.getDirectiveArg('quin', 'onDelete'));
  }

  isCreateField() {
    return this.getSimpleType() !== 'ID' && !this.isVirtual();
  }

  isUpdateField() {
    return this.isCreateField() && !this.isImmutable();
  }

  isVirtual() {
    return this.isMaterialized();
  }

  isMaterialized() {
    return Boolean(this.getDirectiveArg('quin', 'materializeBy'));
  }

  isImmutable() {
    return this.getDirectiveArg('quin', 'restrict', '').indexOf('change') > -1;
  }

  isEmbedded() {
    return Boolean(this.getDirectiveArg('quin', 'embedded'));
  }

  transform(value) {
    return this;
  }

  validate(value) {
    return this;
  }
}
